---
linkTitle: Azure Policy
breadcrumbs: true
weight: 10
cascade:
  type: docs
toc: true
---

## Identity for Azure Policy

Policy enforcement needs both authority and clarity. I use a **single, user-assigned managed identity** for all Azure Policy assignments across the platform — consistent, predictable, and easy to recognize.

This identity lives in the platform management subscription with a `Contributor` role at the top-level management group. That role gives it the permissions needed to remediate non-compliant resources automatically. Policies with `modify` or `deployIfNotExists` effects work out of the box without manual fixes.

Using one identity also keeps the Azure Portal clean. Instead of every landing zone listing multiple cryptic system-assigned identities in the **Access Control** section — each one a puzzle to decode — there’s just one clear entry. Anyone looking can immediately see *what* it’s for and *why* it’s there.


## Custom Policy Definitions

Built-in policies are my default choice — they’re simple, supported, and ready to go. But the platform can’t depend on Microsoft covering every edge case. When the built-ins fall short, I create **custom policy definitions** designed to be reusable across all landing zones.

All custom policies live at the **top management group**. That placement ensures they’re available everywhere without duplication, and it keeps the platform’s policy library consistent.

Adding one is straightforward: drop a JSON file into `/policy/parameters/customDefinitions` and register it in `policyDefinitions.bicepparam`. The pipeline takes it from there — packaging, deploying, and making it instantly available platform-wide.

This setup keeps the process predictable: one location for authoring, one step to register, and zero manual deployments. Every landing zone sees the same definitions, and changes flow automatically through the platform.


## Set Definitions and Assignments

Policy configuration should be lean and predictable. I keep it that way by bundling the **set definition** and **assignment** into a single unit.

In this model, the set definition exists purely to group related policies, while all values for policy effects are passed directly from the assignment itself. No double-handling of parameters, no chasing references across files.

Clarity is built in through strict naming conventions: every policy name starts with its effect (`Allow`, `Deny`, `Config`) followed by the requirement. At a glance, both platform engineers and application teams can see exactly what a policy does and why it exists.

Each policy is explicitly declared in the main policy Bicep file, all using the same module. This makes it easy to publish the policy assignment ID into a GitHub variable group — essential for creating policy exemptions — while keeping the codebase free of hardcoded resource IDs. Everything is resolved and passed through variables so deployments stay clean.

The result is a far cleaner Azure Policy parameter file — minimal verbosity, fewer opportunities for mistakes, and a faster path to adding or extending policies as requirements change.


## Set Definitions and Assignments

Policy configuration should be both lean and predictable. I keep it that way by bundling the **set definition** and **assignment** into a single unit.

In this model, the set definition exists purely to group related policies, while all values for policy effects are passed directly from the assignment itself. No double-handling of parameters, no chasing references across files.

Clarity is built in through strict naming conventions: every policy name starts with its effect (`Allow`, `Deny`, `Config`) followed by the requirement. At a glance, both platform engineers and application teams can see exactly what a policy does and why it exists.

Each policy is explicitly declared in the main policy Bicep file, although use the same module. This approach lets me publish the policy assignment ID into a GitHub variable group — crucial when creating policy exemptions later. And as always, there are **no hardcoded resource IDs** in the codebase; everything is resolved and passed through variables to keep deployment flow clean.

The result is a far cleaner Azure Policy parameter file — minimal verbosity, fewer opportunities for mistakes, and a faster path to adding or extending policies as requirements change.

## Assignment Scope

While custom definitions live at the **top management group** for maximum reuse, assignments are scoped to **child management groups**. This gives me fine-grained control over what applies where — `platform` and `isolation` landing zones can each have their own approved resources or even a completely different security baseline.

## Policy Exemptions

Even in a tightly governed platform, there are valid cases where a policy doesn’t fit. When that happens, application teams can request an exemption by editing their landing zone parameter file and submitting a Pull Request.

Exemptions are created at the **resource group** level, removing a specific policy from the requirement scope. Teams can create as many exemptions as needed — but with that flexibility comes ownership. If you request the exemption, you’re responsible for the implications.

```json
  "policyExemptions": [
    {
      "PolicyAssignmentId": "policy_isolation_deny_local_authentication_id",
      "policyDefinitionReferenceId": "storageAccount",
      "resourceGroup": "myApp-test",
      "description": "the app does not support Entra ID authentication"
    }
  ]

```

## Diagnostic Settings

Diagnostics follow a slightly different pattern than other policies. The rules for *what* data to collect are managed centrally, but the assignments — specifically, *where* to send that data — happen at the **landing zone** scope instead of the management group level.

This ensures that from day one, every landing zone is configured to collect audit logs for all its resources. Each landing zone sends its diagnostics to its own Log Analytics workspace, which the app team owns — along with the data and the costs that come with it. Ownership stays local, but consistency stays central.

If I need to change diagnostic settings across the platform, it’s just a matter of updating the central definition and re-running the `create-landing-zone` pipeline. Changes roll out everywhere, instantly.

## Existing Policy Assignments

Here’s the current set of enforced policies at the ´isolation´ management group scope

- **Allowed locations** – restrict deployments to approved Azure regions  
- **Allowed resources** – limit resource types to what’s actually needed  
- **Deny public network access** – block public endpoints by default  
- **Deny local authentication methods** – enforce Entra ID as the only way in  
- **Deny cross-tenant replication** – prevent data leakage across tenants  
- **Config diagnostic settings** – enforce collection of required logs and metrics

**TL;DR**  

- Policy is the enforcement layer of platform intent — if the code says it, policy makes it true.  
- Managed identity with top-level Contributor role handles all assignments and remediations.  
- Custom policies live at the top management group for maximum reuse.  
- Bundling set definitions with assignments keeps things lean and scalable.  
- Central control defines the rules; local enforcement ensures ownership.  
- Scoped assignments allow tailored rules per landing zone type without losing baseline consistency.