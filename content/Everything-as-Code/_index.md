---
linkTitle: Everything-as-Code
description: "How I apply infrastructure-as-code principles to build Azure landing zones with Bicep and GitHub"
breadcrumbs: false
weight: 20
cascade:
  type: docs  
toc: true
sidebar:
  open: true
---

I wanted every piece to be self-contained, and easier to evolve. Just clear, independent blocks you can assemble, update, or remove without breaking a sweat. The goal: deliver every capability as a standalone building block, managed entirely in code. 

Here’s how that foundation is built—and why it matters.

## No Human Touch

Direct human access to production is blocked by design. Nobody logs into the platform to make changes by hand. All updates flow through code, reviewed and deployed via automated pipelines. This keeps production stable, predictable, and fully reproducible.

## Independent Building Blocks

From the start, I wanted the platform to be modular—no monoliths, no tangled dependencies. That means breaking everything down into building blocks: complete, independent GitHub Actions workflows, each delivering a single capability end-to-end. Think access control, policy, monitoring—each is its own block, responsible for everything it needs to do its job in Azure.

A building block owns its lifecycle. Add a block, and the capability appears in Azure—services, config, connections, everything. Remove it, and it’s gone, with nothing left behind. 

| Building Block   | Description |
|------------------|-------------|
| **Tenant Level** | Sets up the Azure Management Group hierarchy and billing account. |
| **Monitor**      | Deploys Log Analytics workspace, alerts, and action groups. |
| **Access Control** | Manages access control at the management group. |
| **Automation**   | Handles operational tasks to keep things healthy and clean. |
| **Policy**       | Deploys policy identities, custom policy definitions, and assigns. |

Blocks are designed to be independent—redeploy or update one without touching the rest. Outputs are passed between blocks using GitHub variables—no hardcoding, no hidden coupling.

## Purpose-Built Bicep Modules

Inside each building block, Bicep modules do the heavy lifting. Each module is small and focused—wrapping a single Azure service or capability (like defining a policy, assigning a role, or standing up a workspace).

Logic is built right into the module, using Bicep’s native functions and loops for platform-wide needs. Tuning or scaling? That’s handled by swapping parameter files, not rewriting code. Need to whitelist a new resource or tweak access? Update the parameters, redeploy, done.

Because modules are isolated, a change in one part of the system, does not break anything somewhere else.

## GitHub 

GitHub is the management plane for Gazelle. Every platform operation — from creating a landing zone to updating a policy — starts as an issue and makes its way to a pull request. This keeps every change visible, reviewed, and traceable — nothing happens in the dark.

All deployments run via GitHub Actions, using federated Entra ID credentials scoped to `org/repo/environment`. It has `Owner` permissions at the top level management group. The service connection also has a token with write permissions for GitHub operations, like write variables.

Rather than hardcoding resource IDs in Bicep files, each deployment publishes its outputs — such as resource IDs — to GitHub variables. Downstream pipelines consume those variables as inputs, keeping deployments modular, decoupled, and easy to chain together.

## Built-in Test Environments

Every change gets proven in a fully isolated, production-like replica. Same management group structure, same policies, same access control—just in a separate subscription. It’s a safe space: experiment, test edge cases, or validate changes before they hit production.

Need to reset? The `destroy` workflow wipes the environment. Need a fresh start? `Big Bang` spins up a clean copy,predictable and identical, every time.

## GitHub Flow

All platform changes follow short-lived branches, using a GitHub Flow:

```
Issue → Branch → Push → Test Environment → Validate → Pull Request

```
You start by opening an Issue to describe the change. From there, create a branch, make your updates, and push them to GitHub to deploy to a test environment. Once deployed, you manually validate the results. If everything checks out, you open a Pull Request to merge back into main. The process is quick, lightweight, and keeps the platform fully aligned with the source code at all times.

## Code as the Source of Truth

Azure Deployment Stacks handle both create and destroy, with DeleteAll set by default. If it’s not in the code, it doesn’t exist—period. For things Azure can’t clean up (like invoice sections), I fall back to classic deployments, accepting the manual cleanup tradeoff.  

## Deployment Scope

All core capabilities—identity, policy, RBAC—deploy via Deployment Stacks at the top-level management group. Stacks are named after the capability they deliver, so it’s always clear what’s running.  
Resources land in a dedicated management subscription, grouped by function for clarity and governance.

## Big Bang

The platform must always remain in a reproducible state — capable of being deployed and configured from scratch, end-to-end, using a single GitHub workflow. Every change to the platform, whether introducing a new capability or updating an existing one, is held to that principle. If you can’t destroy and rebuild cleanly, the change isn’t ready.

To validate this, two workflows are provided:

- **Destroy** — wipes the entire Azure platform setup. The workflow deletes all deployment stacks with `deleteAll` set by default, clearing the platform management subscription, management group configuration, deployment history, and child management groups. What remains is only the initial tenant configuration described in the *Getting Started* page.

- **Big Bang** — a GitHub workflow that chains together every platform building block. It deploys the entire platform from scratch — management groups, policies, automation, monitoring, access control, everything. The result is a clean, fully functioning environment that can be recreated at any time, predictable and identical to the baseline defined in code.

Together, `Destroy` and `Big Bang` guarantee that the platform can always be reset, rebuilt, and trusted. The ability to redeploy from nothing is the final check of truth.

## TL;DR

- Everything—build and operations—is defined in code
- Capabilities are delivered as independent building blocks, each with its own lifecycle
- Building blocks are made from small, purpose-built Bicep modules
- GitHub is platform management plane
- All platform changes follow a GitHub Flow 
- Deployment outputs flow between pipelines via GitHub Variables
- Every change is tested in a fully isolated, prod-like environment
- Azure Deployment Stacks enforce “code is the source of truth” and automatic cleanup