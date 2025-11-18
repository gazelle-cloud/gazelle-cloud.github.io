---
linkTitle: Azure Policy
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 40
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# Policy Driven Governance

Azure Policy is a powerful service that helps ensure consistent configuration of Azure resources across all subscriptions. It enables enforcing standards — for example, denying public network access, disabling insecure authentication methods, or configuring diagnostic settings — on all resources including Storage Accounts, Key Vaults, and so on.

To make Azure Policy work smoothly, a few moving parts have to click together, so platform engineers can manage platform rules by editing parameter files only, while enabling application teams to request Policy Exemptions through GitHub Workflows and Pull Requests.  

## Design Principles

- Following a whitelist approach, only approved Azure resources and configurations can be deployed to landing zones.

- Every change to a policy is first [validated in a production-like test environment](../deployment-logic/#test-environment), identical to the live setup, minimizing the risk of misconfiguration.
  
- Everything is managed as code — from deployment and configuration to exemptions — eliminating manual steps and ensuring consistency and reproducibility.
  
- All custom Policy Definitions are deployed at the top-level management group, allowing them to be reused across child management groups just like built-in definitions.

- Policies are grouped into Policy Set Definitions based on their purpose, following naming conventions to make their intent clear.

- Assignments are configured at the child management groups, where each policy has its own Bicep module for fine-grained configuration possibilities.

- Landing zone engineers can request Policy Exemptions by editing landing zone parameter file and submitting a Pull Request.

## Whitelisting Approach 

I wanted a platform that prevents mistakes before they happen, rather than chasing misconfigurations later — running cleanup scripts or coordinating across teams to fix technical debt. The whitelisting approach achieves exactly that: Azure Policy allows only approved Azure services and configurations, while everything else is denied by default.

## Policy Definitions

Built-in policies are the default choice — they’re supported and ready to use. But the platform can’t rely on Microsoft to cover every edge case. When the built-ins fall short, custom Policy Definitions are deployed at the top-level management group, ensuring they’re available everywhere without duplication. This approach keeps the platform’s policy library maintainable.

## Policy Assignments

### Assignment Scope
Policy assignments are applied at the child management group level, where each scope runs its own deployment stack bundling all relevant policies and parameters. While the overall model remains consistent across the tenant, the allowed resources and configurations can vary slightly between scopes. This structure ensures consistency and flexibility while still allowing each Management Group to fine-tune its security and operational baseline.

### Name Standards

To improve clarity, Azure Policies are named by intent and grouped by compliance requirement. Each policy name starts with its effect — **Allow**, **Deny**, or **Config**.

- **Allow** and **Deny** policies rely on Azure Policy `Deny` effect.
- **Config** policies use `Modify` or `DeployIfNotExists` to automatically remediate non-compliant resources.

The effect is followed by the compliance requirement — for example, Deny Public Network Access. This naming pattern makes policies self-documenting, so you can quickly understand what a policy does and how it’s enforced.

### Existing Assignments
Below are policy assignments that apply across `platform` and `isolation` management groups:

- **Allowed Locations** – Restricts resource deployments to approved Azure regions.
- **Allowed Resources** – Limits deployments to specific, approved resource types.
- **Deny Public Network Access** – Blocks public network endpoints, allowing only restricted and controlled network traffic.
- **Deny Local Authentication Methods** – Enforces Entra ID–based authentication by denying legacy access methods such as access keys or SAS tokens.
- **Deny Cross-Tenant Replication** – Prevents accidental data replication or leakage across tenants.
- **Deny Weak TLS** – Ensures all network traffic uses strong, encrypted TLS configurations.
- **Config Diagnostic Settings** – Enforces collection of required logs for monitoring.

## Policy Exemptions

There are cases where a required resource configuration simply doesn’t work for a specific scenario. When that happens, an application team can request an exemption from a particular policy — for example, allowing authentication to a Storage Account using a SAS token instead of RBAC roles via Entra ID.

The purpose of a policy exemption is to acknowledge legitimate application requirements that don’t fit the default security or operational baseline. The process ensures that such deviations are intentional, reviewed, and traceable — not accidental misconfigurations. In other words, exemptions capture the difference between a design decision and a mistake.

Teams can create as many exemptions as needed — but with that flexibility comes ownership and accountability. If you request an exemption, you’re responsible for understanding and managing its implications. To balance flexibility with control, the tenant defines two types of policy exemptions: `temporary` and `long-term`.

### Temporary

Used primarily for troubleshooting or development purposes. These exemptions are short-lived — allowing engineers to unblock themselves quickly without compromising long-term compliance.

- It is applied at the subscription level, meaning all resources within that subscription are potentially affected.
- The exemption excludes all policies under the selected assignment, like `Deny Public Network Access`.
- The exemption is valid for 4 hours.

### Long Term

Workloads that require a permanent exclusion from an Azure Policy can request it by editing the landing zone parameter file and submitting a Pull Request.

- The full lifecycle of each exemption is managed by the landing zone engineers. Once an exemption is no longer needed, they simply remove it from the parameter file, and the corresponding exemption is removed from Azure.

### Policy Assignment Dump File

To simplify the user experience when creating a policy exemption, a `policy-assignment-reference.json` file containing policy assignment details (assignment and reference ID) is provided, allowing engineers to use tab-completion, making the exemption process clear and straightforward.

The reference file is updated automatically in GitHub Actions during a policy assignment workflow. After the policy is assigned, the next step is to fetch policy assignment data using Azure Resource Graph from the live Azure environment and generate a JSON file. If there are any updates in the file, a Pull Request is created by GitHub Actions. This flow helps ensure that the policy reference is always up to date and provides users a friendly experience when creating policy exemptions.

## Policy Identity

A single user-assigned managed identity is used for Azure Policy assignments across the platform. The main driver is to reduce access control overhead from policy assignment and provide a clean overview under the `Identity and Access Control` blade in portal.azure.com.

The identity lives in a platform management subscription with a `Contributor` role at the top-level management group. It grants the permissions needed to remediate non-compliant policies with `modify` or `deployIfNotExists` effects. 

## Remediation Tasks

Azure Policies that have `modify` or `deployIfNotExists` effects are remediated on a scheduled basis by the platform automation jobs. The job detects resources that are out of drift and automatically applies the fix, such as enforcing required tags or wiring up diagnostic settings. This ensures platform guardrails are always applied, without waiting for someone to notice and correct it by hand.