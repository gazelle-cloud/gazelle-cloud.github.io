---
title: Policy
breadcrumbs: true
weight: 50
toc: true
sidebar:
  open: true
---

The Policy functional unit defines and enforces platform-wide security and operational standards using Azure Policy. Policies are deployed and configured in a modular way, with each policy designed to address a single compliance requirement—such as denying public network access or configuring diagnostic settings. This approach allows for precise control and keeps the codebase easy to read. 

![Policy deployment overview](/policy.png)

## Design Overview
- **Policy Driven**: Landing zone management follows a policy driven approach, ensuring that security and operational standards are met out of the box. No manual work required from the platform team.

- **Deny**: Security baselines use a `Deny` effect: if a resource doesn’t meet platform security requirements, it simply won’t get deployed. This gives application teams immediate feedback about misconfigurations and lets them correct issues early—before anything goes live.

- **Fix It On The Fly**: Platform operational requirements—such as tags or diagnostic settings—are applied using `DeployIfNotExists` or `Modify` effects. These policies auto-configure non-critical settings in the background, reducing friction while keeping the platform consistent and reliable.

- **Whitelisting**: Only whitelisted Azure services are allowed. This helps keep control over security areas like identity or networking. 

- **Grouped by compliance scope**: Azure Policies are grouped by compliance scope, and their names start with the policy effect—like 'Deny Public Network Access' or 'Config Diagnostic Settings'. This makes it easy for teams to understand both the intent and the impact of each policy.

- **Flexibility**: Where flexibility is needed, teams can exclude specific resources by editing the landing zone’s parameter file—striking a balance between governance and team autonomy.  
  
- **Identity**: A dedicated user-assigned managed identity is provisioned specifically for Azure Policy. This identity is granted `Contributor` permissions at the top-level management group and is used by Azure Policy effects like `Modify` or `DeployIfNotExists`

- **Custom Definitions**: All custom policy definitions are deployed at the top-level management group, making them available across the entire hierarchy. This setup mirrors built-in policies and supports reuse without duplication.

- **Single-Purpose Set Definitions**: Unlike reusable policy Set Definitions, Gazelle defines each policy set for a single assignment. Each Set Definition and its assignment are managed as a single unit — deployed, updated, and removed together. This modular approach streamlines the process of adding or updating policies, enables further platform automation using policy resource IDs, and helps maintain a clean, user-friendly codebase.

- **Scoped Assignments**: Policies are assigned at the child management group level, allowing each management group to implement its own set of security, and operational rules. 

## Applied Policies

### Deny Local Authentication Methods

Identity is built around Entra ID as the single source of truth. Local authentication methods like connection strings and access keys are disabled by Azure Policy. All authentication is handled through Entra ID and authorized via Role-Based Access Control, following modern identity and access management patterns.

### Diagnostic Settings
![Diagnostic Settings](/diagnostic-settings.png)

A centrally managed policy Set Definition governs the collection of diagnostic settings from Azure resources. While the definition is shared, the assignment is applied at the landing zone level — ensuring that logs flow into each zone’s local Log Analytics workspace. This enables centralized consistency while giving app teams control over log data and associated costs.