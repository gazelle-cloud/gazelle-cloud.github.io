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

Interestringely, the project is all about managing azure landing zones, however - access to portal.azure.com is not needed, as all platform deployment and confiugration is fully managed via GitHub workflows.

## Naming

- lz-flow
- platform
- template 

## Platform management workflows

### Management Groups

- Deployes Azure Management Group hierarchy

### Access Control 

 - Configures function based roles at the Management Groups
  
### Platform Automation

- Configures identity and access for automation jobs
- Push docker image to GitHub Package Registry
- Configures Azure infrastructure for Container Apps
- Provides "Bring-Your-PwSh-Script" experience
  
### Azure Policy

- Configures identity and access for Azure Policy
- Deploys custom policy definitions
- Assigns Azure Policies
- Creates a Pull Request to update Azure Policy references 

### GitHub Configuration

- set global platform variables
- create GitHub Environments
- configures github labels for issue tracking

### Destroy Platform

 - clean'ups deployment history.
 - prepares subscriptions for platform destory.
 - Azure Deployment Stacks removes all platform management resources.
 - cleanup GitHub variables.
  
### Big Bang

- Configures platform functionality from scratch to the latest working version.
- Integrates landing zones to the platform by re-runing `create-landing-zone` pipelines.
  
## Landing zone workflows

### Create Landing Zone

- generate landing zone variables
- create azure subscription
- configures landing zone identity
- configures Virtual Network
- configures Diagnostic Settings
- configures cost, security and operational notifications
- configures Azure Policy Exemptions
- configures Azure Tags
- Writes Azure deployment outputs to GitHub Variables
  
### Create Policy Exemption

- fetch management group name and environment where the subscription belongs
- maps GitHub workflow inputs to Azure Policy resource id
- Calculates exemption expiration time
- create a temporary Azure Policy Exemption