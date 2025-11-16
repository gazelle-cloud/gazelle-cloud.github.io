---
linkTitle: Azure Policy
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 40
toc: true
---
# Policy Driven Governance

Azure Policy is a powerful service that helps ensure consistent configuration of Azure resources across all subscriptions in a tenant. It enables you to enforce organization-wide standards — for example, denying public network access, disabling insecure authentication methods, or configuring diagnostic settings — on all resources including Storage Accounts, Key Vaults, and databases.

Under the Azure Policy umbrella, I manage everything from custom definitions, assignments, exemptions, and remediation tasks to a full Bicep and GitHub Actions codebase that orchestrates the service end to end.

In this post, I’ll explain how Azure Policy is managed in Gazelle tenant, so platform engineers can focus on defining new rules using parameter files only. It also empowers application teams to request Policy Exemptions through self-service — eliminating ticket overhead while keeping every exemption documented and traceable.

## Design Principles

Before diving into configuraiton and implementation details, these design principles outline how Azure Policy is structured and operated in Gazelle tenant.

- All custom Policy Definitions are deployed at the top-level management group, allowing them to be reused across child management groups just like built-in definitions.

- Policies are grouped into Policy Set Definitions (initiatives) based on their purpose, following strict naming conventions to make their intent immediately clear.

- Assignments are configured at the child management group level, providing fine-grained control for different types of cloud applications.

- Application teams can request Policy Exemptions by editing their landing zone parameter file and submitting a Pull Request — enabling a self-service workflow with full traceability.

- Everything is managed as code — from deployment and configuration to exemptions — eliminating manual steps and ensuring consistency across environments.

- Every change to a policy is first validated in a production-like test environment, identical to the live setup, minimizing the risk of misconfiguration or unintended impact.

- Following a whitelist approach, only approved Azure resources and configurations can be deployed to landing zones, ensuring consistent and compliant environments.


## Policy Assignment Structure

### Assignment Scope
Policy assignments are applied at the child management group level, where each scope runs its own deployment stack bundling all relevant policies and parameters. While the overall governance model remains consistent across the tenant, the allowed resources and configurations can vary slightly between scopes. This structure ensures uniform governance while still allowing each environment to fine-tune its security and operational baseline.

### Name Convention
To maintain clarity and consistency, Azure Policies are grouped by compliance requirement and named by intent. Each policy name begins with its effect (`Allow`, `Deny`, or `Config`) followed by the requirement — for example, `Deny Public Network Access`.
Behind this naming convention is a simple, explicit mapping to Azure Policy effects:

- **Allow and Deny** both leverage the `Deny` policy effect to enforce configuration consistency.
- **Config** policies use `Modify` or `DeployIfNotExists` effects to automatically apply or remediate required configurations.

This pattern makes policies self-documenting and easy to understand — both platform engineers and application teams can quickly see what a policy does and how it’s enforced.

### Existing Assignments
Below are policy assignments that apply across `platform` and `isolation` management groups:

- **Allowed Locations** – Restricts resurce deployments to approved Azure regions.
- **Allowed Resources** – Limits deployments to specific, approved resource types.
- **Deny Public Network Access** – Blocks public network endpoints, allowing only restricted and controlled network traffic.
- **Deny Local Authentication Methods** – Enforces Entra ID–based authentication by denying legacy access methods such as access keys or SAS tokens.
- **Deny Cross-Tenant Replication** – Prevents accidental data replication or leakage across tenants.
- **Deny weak TLS** - Ensures all network traffic uses strong, encrypted TLS configurations.
- **Config Diagnostic Settings** – Enforce collection of required logs for monitoring.

## Policy Definitions

Built-in policies are my default choice — they’re simple, supported, and ready to use. But the platform can’t rely on Microsoft to cover every edge case. When the built-ins fall short, I create custom policy definitions designed to be reusable across all landing zones.

All custom policies are deployed at the top-level management group, ensuring they’re available everywhere without duplication. This approach keeps the platform’s policy library consistent and maintainable, while enabling centralized updates that automatically propagate to all environments.

## Whitelisting Approach 

I wanted a platform that prevents mistakes before they happen, rather than chasing misconfigurations later — running cleanup scripts or coordinating across teams to fix technical debt. The whitelisting approach achieves exactly that: Azure Policy allows only approved Azure services and configurations, while everything else is denied by default.

## Policy Exemptions

There are cases where a required resource configuration simply doesn’t work for a specific scenario. When that happens, a team can request an exemption from a particular policy — for example, allowing authentication to a Storage Account using a SAS token instead of RBAC roles via Entra ID.

The purpose of a policy exemption is to acknowledge legitimate application requirements that don’t fit the default security or operational baseline. The process ensures that such deviations are intentional, reviewed, and traceable — not accidental misconfigurations. In other words, exemptions capture the difference between a design decision and a mistake.

Teams can create as many exemptions as needed — but with that flexibility comes ownership and accountability. If you request an exemption, you’re responsible for understanding and managing its implications. To balance flexibility with control, the tenant defines two types of policy exemptions: `temporary` and `long-term`.

### Temporary
Used primarily for troubleshooting or development purposes. These exemptions are short-lived — allowing engineers to unblock themselves quickly without compromising long-term compliance.

- The exemption excludes all policy references defined under the selected assignment.
- It is applied at the subscription level, meaning all resources within that subscription are affected.
- The Exemption is valid for 4 hours.

A temporary exemption is created by running a GitHub workflow - `lz - flow - create Policy Exemption`, simply choose the policy to exclude and provide the subscription ID — the automation takes care of the rest.

### Long Term

Workloads that require a permanent exlusion from an Azure Policy can request it by editing the landing zone parameter file and submitting a Pull Reqest.

- The full lifecycle of each exemption is managed by the landing zone engineers. Once an exemption is no longer needed, they simply remove it from the parameter file, and the corresponding policy is automatically removed from Azure.

- If the exemption needs to apply to an entire subscription, engineers can create it at the subscription level by leaving the `resourceGroup` value empty. 

### Policy Assignment Dump File

To simplify use experience to create a policy exemption, a `json` file containing policy assignments details (assignment and refentrece id) is provided, allowing engineers to use tab-completion, making the exemption process clear and stightforward process.  

The reference file is update automatically, in a GitHub Actions, during a policy assignment workflow. After the policy is assigned, next step in a pipeline is to fetch policy assignments data from the live Azure environment and generate a json file. If there any update in the file, a Pull Request is created by the GitHub Actions. This flow helps to ensure that policy reference is allways up to date.

## Policy Identity

I use a single, user-assigned managed identity for all Azure Policy assignments across the platform. The main driver is to keep clean overview under the `identity and access control` blade in portal.azure.com.

The identity lives in a platform management subscriotion with a `Contributor` role at the top-level (`Gazelle`) management group. It gives permissions needed to remediate non-compliant policies with `modify` or `deployIfNotExists` effects. 

## Remediation Tasks

Azurer Policies that has `modify` or `deployIfNotExists` effect are remediate on a schedule base by the platform automation jobs. The job detectes resoruces that are out of compliance and automaticaly applies the fix, like enforcing required tags or wiring up diagnostic settings. This ensures platform guardrails are always applied, without waiting for someone to notice and correct it by hand.

The automation itself is written in PowerShell, packed into the Docker container and hosted under in the container app environment under the platform-automation capability. 


## Deployment Logic

- **Zero Human Touch** - all aspects of the Azure Policy is managed as a code, there is no direct human involved in the flow.
- **Test Envirornment** - all changes are first pushed to the identitical test environment, to validate that everything works as expected. 
- **Hardcoded SetDefiniition Values**: To reduce policy management verbosity from the Bicep perspective, Policy Set Definitions and Policy Assignment bundle into a single unit. Intead of tradional flow, where Set Definition is decleared onced and re-used accross all assignments, I flip it around - set definition is dedicated to policy assignment. It's one-to-one mapping. This tweak enables to have a single, user-friendly parameter file for each policy assignment. 
- **GitHub workflow**:
  -  **Identity** - create a user assigned identity and RBAC role at the management group level.
  - **Custom Definitions** - deploy custom policy definition at the top level management group, so policy assignments can use them in the same way as they are built-in.
  - **Policy Assignment** - policies assigned at the child management group level, allowing granular control and flexibility.
  - **Temporary Exemption** - created using Azure CLI by running a GitHub workflow.
  - **Long Term Exemption** - managed by the Azure landing zone specific Deployment Stack.
