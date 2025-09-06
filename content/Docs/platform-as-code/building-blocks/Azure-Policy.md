---
linkTitle: Azure Policy
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
breadcrumbs: true
weight: 30
cascade:
  type: docs
toc: true
---
# Policy Driven Governance

Gazelle is built from [modular blocks](/docs/platform-as-code/#building-blocks), each designed to be deployed and managed independently end-to-end. This page covers the Azure Policy block.

Azure Policy is how I enforce boundaries: defining what’s allowed, blocking insecure configurations, and wiring up operational settings automatically. The goal is simple — every landing zone starts safe and consistent, without relying on manual checks.

The rest of this page explains how it works in practice: the design decisions I’ve made, and how to operate policies inside Gazelle.

## Identity for Azure Policy

Policy enforcement needs both authority and clarity. I use a single, user-assigned managed identity for all Azure Policy assignments across the platform — consistent, predictable, and easy to recognize.

This identity lives in the platform management subscription with a `Contributor` role at the top-level management group. That role gives it the permissions needed to remediate non-compliant resources automatically. Policies with `modify` or `deployIfNotExists` effects work out of the box without manual fixes.

Using one identity also keeps the Azure Portal clean. Instead of every landing zone listing multiple cryptic system-assigned identities in the Access Control section — each one a puzzle to decode — there’s just one clear entry. Anyone looking can immediately see *what* it’s for and *why* it’s there.


## Custom Policy Definitions

Built-in policies are my default choice — they’re simple, supported, and ready to go. But the platform can’t depend on Microsoft covering every edge case. When the built-ins fall short, I create custom policy definitions designed to be reusable across all landing zones.

All custom policies live at the top management group. That placement ensures they’re available everywhere without duplication, and it keeps the platform’s policy library consistent.

## Policy Assignments
### Naming
Azure Policies are grouped by compliance requirement and named for intent. Each starts with its effect (`Allow`, `Deny`, `Config`) followed by the requirement. Example: `Deny public network access`. Behind the naming is a clear mapping to Azure Policy effects: `Allow` and `Deny` both use the `Deny` effect, while `Config` relies on `modify` or `deployIfNotExists` to enforce configuration baselines automatically. The pattern is simple and explicit, so both platform engineers and application teams can immediately see what a policy does and how it is enforced.

### Bicep Module 

Bicep modules for Azure Policy bundle the SetDefinition and Assignment into a single unit. The SetDefinition groups related policies and hardcodes policy parameter values. Those values are fixed in the definition itself — they can’t be changed later in the assignment. The Assignment’s role is simple: it applies that SetDefinition to a scope, like a child management group.

From the Bicep perspective, this keeps parameter files short and human-friendly, reducing verbosity and making changes straightforward. It’s a shift away from the traditional model — where one SetDefinition is shared across many assignments — toward a design that optimizes clarity and simplicity.

### Assignment Scope
Assignments themselves are scoped to child management groups like `platform` or `isolation`. Each scope runs its own deployment stack, bundling all relevant policies and parameters. This structure delivers precision: every scope can fine-tune its security and operational baseline.

### Main Bicep 
Each child management group has a dedicated Bicep file that contains all assignments at the scope. It calls the same shared module with prebuilt logic, but applies a local naming pattern, local parameters, and captures outputs. Those outputs (assignment IDs) are published to GitHub environment variables by the workflow, so application teams can request policy exemptions by referencing variables — never hardcoding resource IDs. Clean separation.

The outcome is clarity at every level — naming, assignment, and exemptions. Policies scale across the tenant without drift, and each environment can enforce exactly what it needs.

## Policy Exemptions

Even in a tightly governed platform, there are valid cases where a policy doesn’t fit. When that happens, application teams can request an exemption by editing their landing zone parameter file and submitting a Pull Request.

Exemptions are created at the resource group level, removing a specific policy from the requirement scope. Teams can create as many exemptions as needed — but with that flexibility comes ownership. If you request the exemption, you’re responsible for the implications.


## Diagnostic Settings

Diagnostics follow a slightly different pattern than other policies. The rules for *what* data to collect are managed centrally, but the assignments — specifically, *where* to send that data — happen at the landing zone scope instead of the management group level.

This ensures that from day one, every landing zone is configured to collect audit logs for all its resources. Each landing zone sends its diagnostics to its own Log Analytics workspace, which the app team owns — along with the data and the costs that come with it. Ownership stays local, but consistency stays central.

If I need to change diagnostic settings across the platform, it’s just a matter of updating the central definition and re-running the `create-landing-zone` pipeline. Changes roll out everywhere, instantly.

## Existing Policy Assignments

Here’s the current set of enforced policies at the ´isolation´ management group scope

- **Allowed locations** – restrict deployments to approved Azure regions  
- **Allowed resources** – limit resource types to what’s actually needed  
- **Deny public network access** – block public endpoints by default  
- **Deny local authentication methods** – enforce Entra ID as the only way in  
- **Deny cross-tenant replication** – prevent data leakage across tenants  
- **Deny weak TLS** - network traffic should be encrypted
- **Config diagnostic settings** – enforce collection of required logs and metrics

## How to
### Whitelist New Resource

To whitelist a new resource under the `isolation` management group, navigate to `building-blocks/policy/parameters/isolation/`. Review each parameter (aka policy assignment) to see how the resource fits against the current guardrails. 
- allowedResources.json
- denyLocalAuthentication.json
- denyPublicNetworkAccess.json
- denyCrossTenantReplication.json
- denyWeakTLS.json
- diagnosticSettings.bicepparam

Here is an example how to extend parameter files to include Azure Storage Account.
 `Deny public network access`
```json
[
  {
    "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/34c877ad-507e-4c82-993e-3452a6e0ad3c",
    "policyDefinitionReferenceId": "storageAccount-publicNetworkAccess",
    "parameters": {
      "effect": {
        "value": "Deny"
      }
    }
  }
]
```
`Deny local authentication methods`
```json
[
      {
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/8c6a50c6-9ffd-4ae7-986f-5fa6111f9a54",
        "policyDefinitionReferenceId": "storageAccount-sharedAccessKeys",
        "parameters": {
            "effect": {
                "value": "Deny"
            }
        }
    }
]
```
`Deny weak TLS`
```json
[
    {
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/fe83a0eb-a853-422d-aac2-1bffd182c5d0",
        "policyDefinitionReferenceId": "storageAccount-weakTLS",
        "parameters": {
            "effect": {
                "value": "Deny"
            },
            "minimumTlsVersion": {
                "value": "TLS1_2"
            }
        }
    }
]
```
`Deny cross tenant replication`
```json
[
    {
        "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/92a89a79-6c52-4a7e-a03f-61306fc49312",
        "policyDefinitionReferenceId": "storageAccount-crossTenantReplication",
        "parameters": {
            "effect": {
                "value": "Deny"
            }
        }
    }
]
```

`Allowed resources`
```json
[
    ...
    "Microsoft.Storage/storageAccounts",
    ...
]
```

That’s the whole flow: pick the right policy, extend its parameter file, commit. The deployment logic handle the rest.

### Add Custom Definition

Sometimes the built-in policies don’t cover everything. In that case, you bring your own definition. A custom definition must be authored in JSON and follow the standard schema:
```json
{
  "name": "MyCustomDefinition",
  "properties": {
    // insert policy logic here
  }
}
```
From there, it’s a simple two-step process:
- Drop the file into:
   `building-blocks/policy/parameters/customDefinitions/`
- Register it in `policyDefinitions.bicepparam` 
  
```bicep
param customDefinitions = [
  loadJsonContent('MyCustomDefinition.json')
]
```
Once committed, the pipeline deploys the definition, making it instantly available platform-wide.

### Assign Custom Definition
Custom policy definitions live at the top management group level, which means their resource IDs follow a different path than built-in policies. To handle that difference, I use a `{{custom}}` prefix. The deployment logic automatically resolves the correct path to the definition.
```json
    {
        "policyDefinitionId": "{{custom}}/providers/Microsoft.Authorization/policyDefinitions/MyCustomDefinition",
        "policyDefinitionReferenceId": "MyCustomDefinition",
        "parameters": {
            "effect": {
                "value": "Modify"
            }
        }
    }
```