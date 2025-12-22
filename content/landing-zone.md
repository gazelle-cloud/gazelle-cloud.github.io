---
title: "Azure Landing Zones – team autonomy and self-service"
linkTitle: Landing Zone
description: "Azure landing zones: GitHub as a self-service portal for Azure Landing Zones"
weight: 100
breadcrumbs: false
cascade:
  type: docs
toc: true
---
## What is a landing zone

A landing zone is a blueprint applied to an empty Azure subscription — a standardized foundation that every cloud application must follow. It defines how costs are controlled, what security and operational baselines are enforced, and it provides a ready-to-use deployment pipeline so application teams never have to start from scratch.

The landing zone is built for team autonomy, minimized dependencies on centrally managed components, and promotes a self-service model to create or update landing zones to match an application's path from development to production. 

## What Landing Zone Offers

- **Self-service landing zones**: Create, update, and remove landing zones through GitHub Issues and Pull Requests. Application teams control their own environments with a minimal reliance on platform team.

- **You Build It, You Run It**: Application teams own design, implementation, and operations of their Azure resources — from first deployment to eventual sunset. The platform provides guardrails and tooling; the app team owns the workload.

- **Autonomous environments**: Each landing zone is an isolated Azure subscription, tied to a single application and environment (for example: `myapp-dev`, `myapp-test`, `myapp-prod`). Foundational configuration is baked directly into the subscription, with no dependency on shared runtime services.

- **Hello-World pipeline**: A ready-to-use GitHub repository containing a “hello world” application, infrastructure-as-code modules (Bicep), and deployment pipelines. This lets teams ship their first deployment in minutes, not weeks.

- **Policy-driven governance**: Azure Policies enforce allowed configurations and deny anything outside the security baseline.

- **Cost visibility per application**: Each application receives a dedicated Azure invoice section. All of its landing zones are linked to this invoice section, enabling cost tracking, alerting, and reporting at the application level.

## Getting Started
### Step 1: Create Application Profile

The application profile is the foundational record for each application in the Gazelle tenant. This profile serves as the single source of truth for all associated landing zones, ensuring they inherit application-specific Azure and GitHub configurations.

- **Financial Tracking**: a dedicated Azure invoice section is created for the application, with all application landing zones (e.g., dev, test, prod) are automatically linked to this invoise section.
- **Metadata**: includes tags for an application's criticality level (low, medium, high) as well as contact details for the app owner and engineer.
- **GitHub Repository Setup**: a "hello world" repository is cloned, including deployment pipelines and Bicep modules. Application-specific values are stored as GitHub environment variables.
- **Access Control:** an Entra ID group is provisioned, granting read-only visibility into all subscriptions and cost details tied to the application.

### Step 2: Request Landing Zone

Application teams have full control over their landing zones, enabling them to provision as many environments as needed. The process begins by submitting a GitHub Issue with landing zone details, such as virtual network size and budget. Automation then takes over, generating two landing zone–specific files and opening a Pull Request for platform engineers to review:

- **Parameter File**: A Bicep parameter file containing landing zone–specific values. This file can be updated later to align with environment requirements by submitting additional Pull Requests.
- **GitHub Actions Workflow**: A workflow file tied to the landing zone, containing triggers that enable independent deployment for each landing zone.

Once the Pull Request is merged into the main branch, the platform automation configures the Azure landing zone. The environment is considered ready when the application engineer receives an Azure Monitor email confirming the creation of a new Action Group—an indirect confirmation that budgets, policies, and network configurations are in place, and the landing zone is ready for use.

## Landing Zone parameters

```bicep
using '../bicep/main.bicep'

param appName = 'HeyAzure'
param environment = 'test'
param budget = 100
param engineerEmail = 'mantas@outlook.dk'
param addressPrefix = '24'
param subscriptionId = ''

param exemptions = [
  {
    clarifications: 'pam param pam pam - urgen!'
    policyToExclude: policyReference.allowedLocations.assignmentId
    referenceId: [
      policyReference.allowedLocations.referenceIds['allowed-locations']
    ]
  }
  {
    clarifications: 'another policy exemption'
    policyToExclude: policyReference.denyCrossTenantReplicati.assignmentId
    referenceId: [
      policyReference.denyCrossTenantReplicati.referenceIds['storageAccount-crossTenantReplication']
    ]
  }
]

// values are fetched from GitHub Variables
param applicationReaderEntraGroupId = readEnvironmentVariable('ENTRAID_READER_GROUP_ID', '')
param diagnosticSettingsPolicyResourceId = readEnvironmentVariable('POLICY_CONFIG_DIAGNOSTICSETTINGS_RESOURCE_ID', '')

var policyReference = loadJsonContent('policy-assignment-reference.json')

```

- **Landing zone name** — Automatically generated by concatenating: `management-group-name` - `application-name` - `environment`.

- **Budget** — Alerts are triggered when **80%** of the configured amount is reached.  
  A notification email is sent to the engineer’s email address.

- **Engineer email** — Used for sending budget alerts and Azure Health notifications.

- **addressPrefix** — Defines the virtual network address space for the landing zone. The default is `/24`, which provides 255 IP addresses. Once configured, it cannot be changed later.

- **subscriptionId** — Used when Bring-Your-Own-Subscription is required so the landing zone can be built on top of an existing Azure subscription. In all other cases, this value should be left empty so automation can provision a new subscription.

- **exemptions** — Azure Policy exemptions applied to the landing zone. The `policyReferences` variable provides up-to-date Azure Policy assignment and reference IDs, removing the need for landing zone users to handle cumbersome resource IDs.

- **applicationReaderEntraGroupId** — The Entra ID group that provides read-only access at the landing zone level. This group is created automatically during the application registration process.

- **diagnosticSettingsPolicyResourceId** — The resource ID used to reference centrally managed Azure Policy definitions. It allows the landing zone to automatically apply the organisation-wide diagnostic settings policy. This value is generated by the `Azure-Policy` workflow.
