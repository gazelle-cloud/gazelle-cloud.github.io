---
linkTitle: GitHub - Workflows
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 90
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# GitHub as management plane

## Naming

The platform management is running in a single repo style, where each platform capability and landing zone is deplyed indepdently - meaning that there are multiple GitHub Actions to manage. To make the process managable - all workflows have a prefix: 

- **lz-**: each landing zone workflow starts with *lz* prefix followed by the landing zone name.
- **lz-flow-**: random landing zone autoamtion tasks, managed by the GitHub Actions.
- **platform-**: platform workflow starts with *platform-* prefix followed by actual functionality.
- **platform-flow-**: random platform automation task, managed by the GitHub Actions.
- **template-**: each re-usesable template starts with *template*.

## Platform management workflows

### Management Groups

- Triggered on Push to test environment, and on Pull Request if it's main
- Deployes Azure Management Group hierarchy.
- Configures a default Management Group.

### [Access Control](../access-control/#role-assignments) 

- Triggered on Push to test environment, and on Pull Request if it's main
- Configures function based roles at the Management Groups.
  
### [Platform Automation](../platform-automation)

- Triggered on Push to test environment, and on Pull Request if it's main
- Configures identity and access for automation jobs.
- Push docker image to GitHub Container Registry.
- Configures Azure infrastructure for Container Apps.
- Provides "Bring-Your-PwSh-Script" experience.
  
### [Azure Policy](../azure-policy)

- Triggered on Push to test environment, and on Pull Request if it's main
- Configures identity and access for Azure Policy.
- Deploys custom policy definitions.
- Assigns Azure Policies.
- Updates AzurePolicyRefence.json file using life data.

### GitHub Configuration

- Set global platform variables.
- Create GitHub Environments.
- Configures GitHub labels for Issue organizing.

### [Destroy Platform](../deployment-logic/#destroy)

- Manually triggered by running `platform-flow-Destory` GitHub Actions workflow.
- Clean'ups deployment history.
- Prepares subscriptions for platform destory.
- Azure Deployment Stacks removes all platform management resources.
- Cleanup GitHub variables.
  
### [Big Bang](../deployment-logic/#big-bang)

- Manually triggered by running `platform-flow-Big-Bbang` GitHub Actions workflow
- Configures platform functionality from scratch to the latest working version.
- Integrates landing zones to the platform by re-runing `create-landing-zone` pipelines.
  
## Landing zone workflows

### [Request New Cloud Application](../landing-zone/#register-the-application)

- The workflow is triggered by closing `New Cloud Application Request` issue.
- Generates environment variables
- Configures getting-started GitHub repo
- Configures Entra ID reader group
- Configures Azure Invoice Section
- Configures application specific GitHub variables

### [Request New Landing Zone](../landing-zone/#request-new-landing-zone)

- The initial setup is triggered by closing `New Landing Zone Request` issue. 
- Fetch data from the GitHub issue.
- Configures landing zone parameter file.
- Configures landing zone specific GitHub Actions workflow.
- opens a Pull Request to sync changes back to GitHub repo.

### Landing Zone Specific Workflow

- Triggered when a Pull Request is closed.
- Generate landing zone variables.
- Create azure subscription.
- Configures landing zone identity.
- Configures Virtual Network.
- Configures Diagnostic Settings.
- Configures cost, security and operational notifications.
- Configures Azure Policy Exemptions.
- Configures Azure Tags.
- Writes Azure deployment outputs to GitHub Variables.
  
### [Create Policy Exemption](../azure-policy/#policy-exemptions)

- Manually triggered by running `Create Policy Exemption` GitHub Actions workflow
- Fetch management group name and environment where the subscription belongs.
- Maps GitHub workflow inputs to Azure Policy resource id.
- Calculates exemption expiration time.
- Create a temporary Azure Policy Exemption.