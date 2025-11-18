---
linkTitle: Landing Zone
description: "Azure landing zones: exploring self-service and autonomy in the Gazelle tenant"
weight: 100
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# What is a landing zone

A landing zone is a blueprint applied to an empty Azure subscription — a standardized foundation that every cloud application must follow. It defines how costs are controlled, what security and operational baselines are enforced, and it provides a ready-to-use deployment pipeline so application teams never have to start from scratch.

The landing zone is built for team autonomy, minimized dependencies on centrally managed components, and promotes a self-service model to create or update landing zones to match an application's path from development to production. 

## What You Get

- **Self-service**: create, update, and remove landing zones via GitHub Issues and Pull Requests.
- **You build it, you run it**: design, implement, and operate the application from start to sunset.
- **Autonomy**: foundational Azure configuration baked directly into the landing zone.
- **hello-world**: a getting-started deployment pipeline aligned with platform management principles.

## Platform Rules

- **Cost** — tracked at the application level — every landing zone maps directly to the [app’s invoice section](../cost-management/#cost-per-applicaiton).
- **Isolated landing zones** — one application — one environment — one landing zone: a isolated subscription for each application/environment.
- **[Policy-driven governance](../azure-policy/#existing-assignments)** — Azure Policies enforce allowed configurations and deny anything outside the security baseline.
- **Diagnostic settings** — logs are collected in the [landing zone’s Log Analytics workspace](../monitor/#central-control-with-local-ownership).
- **[Single Region Deployments](../resource-organization/#single-region-deployment)**: deployment flow is streamlined to a single Azure region.

## Register the Application

Getting started in Gazelle begins with a quick application registration. This step wires up the essentials — Azure, Entra ID, and GitHub — so engineers can create and manage landing zones through a self-service model. [The entire process is automated](../github-workflows/#request-new-cloud-application) and requires only a few basic inputs, making onboarding effortless.

- **Azure** — a dedicated Invoice Section is created for the application. All landing zones for this app are created under this same section, ensuring costs roll up into a single financial boundary. This gives teams accurate visibility into total application spend.

- **Entra ID** — an Entra ID group is provisioned with read access to all landing zone subscriptions and cost visibility at the invoice section level.

- **Getting Started Pipelines** — a GitHub repository is cloned from the starter template, containing a hello-world deployment pipeline aligned with Gazelle’s development and deployment flow. Engineers can continue building without needing to set up their own pipelines.

- **Application variables** — application-specific values — like the Invoice Section ID created during registration — are stored as GitHub Variables. These values are consumed by automation pipelines when creating and updating landing zones.

## Request New Landing Zone

Once the initial application configuration is complete, a new landing zone can be requested by opening the `New Landing Zone Request` GitHub Issue template. The workflow generates only the files required to operate a landing zone, not the Azure resources themselves. Landing zone workflows are triggered immediately after the Pull Request is merged.

- **Parameter File** — generates a parameter file for the landing zone and places it under `azurePlatform/landingzones`. This file defines all settings, such as name and budget. It serves as the single source of truth for the landing zone. You can modify it at any time by opening a Pull Request.

- **GitHub Workflow** — a landing zone–specific GitHub workflow is created. It contains the trigger rules and Bicep templates that configure foundational landing zone services.

- **Pull Request** — once the landing zone parameter file and GitHub workflow are generated, a Pull Request is opened automatically. When the Pull Request is merged to main, the landing zone is ready to be configured in the actual Azure environment.

## Landing Zone Workflows

- **Ready** — a landing zone is considered ready when the engineer receives an email from Azure Monitor. That notification means budgets are configured, guardrails are enforced, and the environment is prepared for building in Azure.

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

- **Landing zone name** — Automatically generated by concatenating: `management-group-name` - `application-name` - `environment`.

- **Budget** — Alerts are triggered when **80%** of the configured amount is reached.  
  A notification email is sent to the engineer’s email address.

- **Engineer email** — Used for sending budget alerts and Azure Health notifications.

- **addressPrefix** — Defines the virtual network address space for the landing zone. Once configured, it cannot be changed later. The default is `/24`, which provides 255 IP addresses.

- **subscriptionId** — Used when Bring-Your-Own-Subscription is required so the landing zone can be built on top of an existing Azure subscription. In all other cases, this value should be left empty so automation can provision a new subscription.

- **exemptions** — Azure Policy exemptions applied to the landing zone. The `policyReferences` variable provides up-to-date Azure Policy assignment and reference IDs, removing the need for landing zone users to handle cumbersome resource IDs.

- **applicationReaderEntraGroupId** — The Entra ID group that provides read-only access at the landing zone level. This group is created automatically during the application registration process.

- **diagnosticSettingsPolicyResourceId** — The resource ID used to reference centrally managed Azure Policy definitions. It allows the landing zone to automatically apply the organisation-wide diagnostic settings policy. This value is generated by the `Azure-Policy` workflow.
