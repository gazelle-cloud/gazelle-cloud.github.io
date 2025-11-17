---
linkTitle: Landing Zone
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 100
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# What is a landing zone

A landing zone is a blueprint applied to an empty Azure subscription — a standardized foundation that every cloud application must follow. It defines how costs are controlled, how and what security and operational baselines are enforced, and it provides a ready-to-use deployment pipeline so application teams never have to start from scratch.

The landing zone is built for team autonomy, minimized dependencies on centrally managed components and promote self-service model to create/update landing zones to match applicion's path from development to production. 

## What you Get

- **Self-service**: create, update, and remove landing zones via GitHub Issues and Pull Request.
- **You build it, you run it**: design, implement and operate the application from the start to sunset.
- **Autonomy**: foundational Azure configuration baked straight in the landing zone.
- **hello-world**: a getting started deployment pipeline aligned with platform management principles.

## Platform Rules

- **Cost**: is tracked at the application level — every landing zone maps directly to the app’s invoice section.
- **Isolated Landing zones**: One application - one environment - one landing zone — a fully isolated subscription for each application/environment
- **Policy-driven governance**: Azure Policies enforce allowed configurations and deny anything outside the security baseline.
- **Diagnostic settings**: logs are collected in the landing zone’s Log Analytics workspace.

## Register the Application

Getting started in Azure with Gazelle begins with a quick application registration. This step wires up the essentials — Azure, Entra ID, and GitHub — so teams can immediately create and manage landing zones through a fully self-service experience. The entire process is automated and requires only a few basic inputs, making onboarding fast, predictable, and effortless.

- **Azure** A dedicated Invoice Section is created for the application.  
All landing zones for this app are created under the same section, ensuring that costs roll up into a single financial boundary. This gives teams immediate, accurate visibility into total application spend.

- **Entra ID** An Entra ID group is provisioned with read access to all landing zone subscriptions and cost visibility at the invoice section level.  This provides out-of-the-box transparency across environments without any additional steps.

- **Getting Started Pipelines** A GitHub repository is cloned from the starter template, containing a hello-world deployment pipeline already aligned with Gazelle’s development and deployment flow. Teams can begin building immediately without needing to set up their own pipelines.

- **Application variables** with application-specific values — such as the resource IDs for the Log Analytics workspace, virtual network, and the Invoice Section ID created during registration. These values are consumed by automation pipelines when creating and updating landing zones.


## New Landing Zone

Once the initial application configuration is complete, a new landing zone can be created by submitting the `New Landing Zone Request` GitHub Issue template. The workflow is triggered when the issue is `closed`

- **Parameter File**: generates a parameter file for the landing zone and places it under `azurePlatform/landingzones`. This file defines all settings like name, and budget. It serves as the single source of truth for the landing zone. You can modifyed at any time by opening a Pull Request.

- **GitHub Workflow**: a landing  zone specific GitHub workflow is created. It contains the triggers rules and Bicep templates that will configures landing zone.

- **Ready**: landing zone is considered ready when engineer receive an email from Azure Monitor. That notification means budgets are configured, guardrails are enforced, and the environment is prepared for building in Azure.

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
    policyToExclude: policyRefences.allowedLocations.assignmentId
    referenceId: [
      policyRefences.allowedLocations.referenceIds['allowed-locations']
    ]
  }
  {
    clarifications: 'another policy exemption'
    policyToExclude: policyRefences.denyCrossTenantReplicati.assignmentId
    referenceId: [
      policyRefences.denyCrossTenantReplicati.referenceIds['storageAccount-crossTenantReplication']
    ]
  }
]

// values are fetched from GitHub Variables
param applicationReaderEntraGroupId = readEnvironmentVariable('ENTRAID_READER_GROUP_ID', '')
param diagnosticSettingsPolicyResourceId = readEnvironmentVariable('POLICY_CONFIG_DIAGNOSTICSETTINGS_RESOURCE_ID', '')

var policyRefences = loadJsonContent('policy-assignment-reference.json')

```

- **Landing zone name** - Automatically generated by concatenating: `management-group-name` + `application-name` + `environment`.

- **Budget** - Alerts are triggered when **80%** of the configured amount is reached.
  A notification email is sent to the engineer email address.

- **Engineer email** - Used for sending budget alerts and Azure Health notifications.

- **addressPrefix** - Defines the virtual network address space for the landing zone. Once configured, it cannot be changed later. The default is `/24`, which provides 255 IP addresses.

- **subscriptionId** - Used when Bring-Your-Own-Subscription is required so landing zone can be built on top of existing Azure subscription. In all other cases, this value should be left empty so automation can provision a new subscription.

- **exemptions** - Azure Policy exemptions applied to the landing zone. The policyReferences variable provides up-to-date Azure Policy assignment and reference IDs, removing the need for landing zone users to deal with cumbersome resource IDs.

- **applicationReaderEntraGroupId** - The Entra ID group that provides read-only access at the landing zone level. This group is created automatically during the application registration process.
- **diagnosticSettingsPolicyResourceId** - The resource ID used to reference centrally managed Azure Policy definitions. It allows the landing zone to automatically apply the organisation-wide diagnostic settings policy.This value is generated by the `Azure-Policy` workflow.