---
title: Policy
breadcrumbs: true
weight: 50
toc: true
sidebar:
  open: true
---

The Policy functional unit defines and enforces platform-wide security and operational standards using Azure Policy. Policies are deployed and configured in a modular way, with each policy designed to address a single compliance requirement—such as denying public network access or configuring diagnostic settings. This approach allows for precise control and keeps the codebase easy to read. 

![Policy deployment overview](/platform-policy-deployment-flow.png)

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

The following policies are applied to `online` landing zones to enforce platform standards across all applications. Each policy targets a specific risk area or configuration requirement—ensuring consistency, security, and operational readiness by default.

### Allowed Locations

- **Single Region Deployments**: The platform is intentionally limited to single-region deployments to reduce the complexity and cost associated with cross-region communication. This constraint simplifies architecture and keeps operational overhead low.

- **Centrally managed**: The target region is centrally managed as an environment variable in GitHub. All deployment pipelines automatically pull this value—so application teams don’t need to configure or manage regional settings themselves. This ensures consistency across environments.

### Allowed Resources

Only approved Azure services are allowed. This whitelisting model aligns with both security and operational goals.

By limiting which Azure resources can be deployed, the platform avoids unexpected configurations that could compromise security or disrupt operational tasks. It ensures that every service used in the platform has been reviewed and is fully compatible with platform standards—including identity integration, network configuration, diagnostic coverage, and support for the platform’s “getting started” deployment module.

### Config Diagnostic Settings

![Diagnostic Settings](/platform-policy-Diagnostic-settings-flow.png)

Every landing zone includes its own Log Analytics workspace, used to collect diagnostic data from Azure PaaS services. Diagnostic settings send data to this workspace by default—ensuring full visibility from day one.  

The Policy Definition is created at the management group level and defines what diagnostics should be collected. However, the Policy Assignment is scoped to the individual landing zone subscription. This pattern enables the enforcement of diagnostic standards at scale, while associating monitoring data—and its cost—directly with each landing zone.

It keeps configuration centralized but impact localized—supporting clear accountability, cost tracking, and full observability.

### Deny Local Authentication Methods

Identity is built around Entra ID as the single source of truth. Local authentication methods—such as connection strings and access keys—are explicitly denied through Azure Policy. All authentication is handled using Entra ID and enforced via Role-Based Access Control (RBAC). This ensures that access is centrally managed, auditable, and eliminates the risks associated with hardcoded, static credentials.

### Deny Public Network Access

Azure resources are not allowed to expose public endpoints by default. This policy enforces private connectivity by requiring traffic to PaaS services to flow through service endpoints, blocking unrestricted internet access.

The goal is to protect workloads from unintended exposure, reduce the attack surface, and ensure that all network traffic stays within trusted boundaries.

## How to Whitelist a New Resource

Whitelisting a new Azure resource type means allowing it across all landing zones at the management group level (e.g., `online` or `platform`). To be eligible, the resource must comply with platform security baselines and observability guardrails.

### Evaluate the Resource

Before editing any files, engineers should assess the new resource type against key platform requirements:

- **Does it support local authentication methods?**  
  Local methods—such as SAS keys, access tokens, or connection strings—must be disabled using Azure Policy if supported.

- **Is it accessible over the public internet?**  
  Resources should not expose public endpoints. Private access must be enforced via service endpoints or resource local firewall.

- **Does it support diagnostic settings?**  
  If the resource emits logs, it must send them to Log Analytics for observability.

These answers guide which policies to apply, and whether new custom definitions are required.

### Edit Policy Parameter Files

Once the resource type has been validated, follow the [Operational Flow](../#operational-flow) to begin your change. You'll need to update up to four policy parameter files:

- `policy/parameters/online/denyLocalAuthentication.json`
- `policy/parameters/online/denyPublicNetworkAccess.json`
- `policy/parameters/online/allowedResources.json`
- `policy/parameters/diagnosticSettings.bicepparam`

Each file accepts inputs defined by its parameter schema. In most cases, you'll provide:

- **`policyDefinitionId`**: The ID of the custom or built-in policy definition being referenced.
- **`policyDefinitionReferenceId`**: A short, human-readable identifier used for troubleshooting and for creating Azure Policy exemptions.
- **`effect`**: Typically set to `Deny`, `Modify`, or `DeployIfNotExists` depending on the policy's intended behavior.

### Validate and Submit

After editing the parameter files:

- Push your branch to trigger deployment in the test environment via GitHub Actions.
- Use the Azure Portal to validate the change—e.g., by attempting to deploy the resource and confirming expected policy behavior.
- Once verified, open a Pull Request to merge into `main`, triggering the production deployment.


