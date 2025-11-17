---
linkTitle: Deployment Logic
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 80
breadcrumbs: false
cascade:
  type: docs
toc: true
---

# Deployment Logic

Everything in Azure is a resource — each with its own properties, parameters, and configuration rules. Once you view the platform through that lens, you can standardize the entire lifecycle of every capability. The desired state is defined through purpose-built Bicep modules. Inputs and outputs flow in a controlled loop between GitHub variables and Azure, ensuring every deployment has the information it needs. Resources lifecycle is managed by Azure Deployment Stack, making the codebase the single source of truth. And every change flows through GitHub Actions — validated in the test environment before being applied to production.

## GitHub Flow

Every change to the platform starts the same way: with an Issue. That’s the conversation starter — the place to describe what you want to change and why. From there, you create a short-lived branch, make the edits in code, and push your changes.

The push triggers a deployment into the test environment, where you validate the change directly in Azure. If it works in test, you can trust it will work in production — same code, same structure.

Once you’re satisfied, the final step is open a Pull Request. The Pull Request is the only doorway into main, and merging it applies the exact same code you just validated to production.

## GitHub Actions

Every change to the platform runs through GitHub Actions. All deployments — test and production — are executed by pipelines hosted on GitHub. Nothing is applied directly in Azure; GitHub Actions is the single entry point for updating the platform. To support this model, each workflow authenticates using a service connection with permissions:

- **Entra ID** — Authentication via the `azure-gazelle-landingzones` application using federated credentials scoped at `organization/repository/environment`.
- **Microsoft Graph** — `Directory.ReadWrite.All` and `AppRoleAssignment.ReadWrite.All` for managing Graph permissions for managed identities.
- **Azure** — `Owner` at the `root-management-group`, enabling full platform deployment capabilities.
- **GitHub** — GitHub App `gazelle-landingzones` with write permissions for publishing outputs, updating variables, and interacting with other repositories. Authentication keys stored as a GitHub secret. 

## Deployment Orchestration

To ensure modularity, consistency, and independence across all platform capabilities, deployments are executed through a custom-built PowerShell cmdlet. This cmdlet standardizes how resources are created, updated, and removed by invoking an Azure Deployment Stack. Any resources no longer present in the templates are removed, ensuring environment drift is minimized and the desired state is always enforced.

After each deployment completes, the cmdlet processes the outputs from the Bicep templates. Outputs can be sent back to GitHub by defining one of the supported output objects:
- **GitHubEnvironmentVariables**
- **GitHubRepositoryVariables**
- **GitHubActionsVariables**

For example:
```bicep
output GitHubEnvironmentVariables object = {
  POLICY_IDENTITY_RESOURCE_ID: uami.outputs.resourceId
}

```
The deployment script flattens this object into key–value pairs and writes them into GitHub variables. These values then become inputs to downstream workflows, enabling sharing of information—such as a Log Analytics workspace ID or the resource ID of a virtual network—across all deployment pipelines. 

By standardizing how inputs are collected, how deployments are executed, and how outputs flow back into GitHub, the platform achieves a consistent and scalable model. 


## Azure Deployment Stacks

All platform resources in Azure are managed through Azure Deployment Stacks. A deployment stack creates new resources, updates existing configuration, and automatically removes anything no longer defined in the templates — making the code the single source of truth for the entire platform.

All essential platform capabilities — such as policies, management groups, and access control — are deployed at the top-level management group. Each deployment stack is named after the capability it delivers, ensuring it’s always clear what the stack manages.

Landing zones are also provisioned using Azure Deployment Stacks, but their scope is set to the corresponding child management group (platform or isolation) and it's protected from accidental or unauthorized changes. Even if a landing zone developer receives privileged access at the subscription level, the resources managed by the deployment stack cannot be modified or deleted outside the stack — because the stack’s authoritative scope is higher, and regular users never have access to that layer.

## Test Environment

Every change to the platform is validated in a test environment first. It mirrors production exactly — same management group hierarchy, same policies, same access control, and the same deployment flow — but runs in an isolated, separate subscription. This ensures every capability and configuration change is fully exercised before reaching production. Engineers can verify new functionality end-to-end — not just theoretically or by reading the code, but by observing real Azure behavior in a real Azure environment. This ensures changes are safe, predictable, and production-ready.

## End-to-End Flow

To keep the platform modular and lightweight deployment experience, the platform is broken into a set of “building blocks.” Each building block is an independent GitHub Actions workflow that delivers a single capability end-to-end. Every workflow is responsible for everything it needs to operate in Azure, to writing deployment outputs back into GitHub variables, by allowing other platfrom capabilities to to fetch a property, like `log-analytics-resource-id`.

All building blocks follow a standardized deployment flow built on GitHub Action templates, PowerShell orchestration logic, and Bicep modules tailored for specific capabilities. This design keeps the platform scalable, consistent, and easy to extend without increasing complexity.

## Bicep Modules

Inside each building block, the platform configuration is expressed through a set of small, task-focused Bicep modules. These modules encapsulate the platform’s design decisions, defining both the service configuration and the rules for how each capability scales.

Because every module is built for a specific purpose, the configuration remains simple and readable. There is no need for deeply complex or overly generic templates. Instead, each purpose-built module clearly communicates what the platform is deploying, how it behaves, and which standards it enforces — making it obvious how the environment is actually configured in Azure.

Modules also define the scaling rules, the standardized values, and which configuration options are intentionally exposed versus hardcoded. As a result, scaling or extending the platform becomes straightforward: engineers modify a human-readable parameter file, and the automation handles the rest. This approach keeps deployments predictable, maintainable, and aligned with the platform’s design principles.

## Always in Reproducable State

The platform must always remain in a reproducible state — capable of being deployed and configured from scratch, end-to-end, using a single GitHub workflow. Every change to the platform, whether introducing a new capability or updating an existing one, is held to that principle. If you can’t destroy and rebuild cleanly, the change isn’t ready. 

To validate this, two workflows are provided:

### Destroy 
The workflow wipes the entire Azure platform setup. By default, it deletes all deployment stacks, clearing out the platform management subscription, management group configuration, deployment history, and child management groups. Subscriptions from those child groups are moved back under the top-level management group.

What’s left is only the initial tenant configuration, exactly as described on the Getting Started page. The workflow also purges GitHub environment variables tied to the test/prod, so the next run starts with a clean state. Repository-level variables remain untouched, since they hold global tenant-wide values that production relies on (for example, the region).

### Big Bang 
A GitHub workflow that chains together every platform capability. It deploys the entire platform from scratch — management groups, policies, automation, initial landing zone - everything. The result is a clean, fully functioning environment that can be recreated at any time, predictable and identical to the baseline defined in code.

Together, Destroy and Big Bang guarantee that the platform can always be reset, rebuilt, and trusted. The ability to deploy from nothing is the final check of truth.
