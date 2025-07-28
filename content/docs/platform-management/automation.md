---
title: Automation
breadcrumbs: true
weight: 40
toc: true
sidebar:
  open: true
---
Platform automation is powered by Azure Container App Jobs. The service is optimized for running scheduled automation flows with minimal infrastructure overhead. 

### Identity

A single user-assigned managed identity is reused across all automation jobs. This identity is granted `Contributor` permissions at the top-level management group and Microsoft Graph API permissions to read `Users` and `Groups` in Entra ID. All jobs authenticate using this identity.
{{< callout type="info" >}}
Entra ID Graph API permissions are assigned using a classic deployment, because Deployment Stacks do not support deleting Entra ID objects that are no longer defined in the templates.

{{< /callout >}}  

Instead of creating separate identities and assigning precise roles per job, a unified identity simplifies management and reduces overhead. While this approach technically grants each job broader permissions than it strictly needs, access is tightly controlled in other ways:
 - **Centralized Source Control**: All automation jobs are sourced from a single repository.
 - **Restricted Access to repo**: Only a limited set of trusted engineers can review Pull Request.
 - **Review Pull Requests**: All changes to automation scripts are reviewed before merge, ensuring misuse of the automation identity is caught during code review.
   
### Job Execution
 
  - **Triggering**: All jobs use cron-based scheduling only, and the values are parameterized.
  - **Naming Convention**: Jobs follow a consistent naming pattern: `cron-`.
  - **Network Access**: The Container Apps Environment is configured to block all public network access and does not have virtual network integration. As a result, automation jobs are limited to control-plane operations only.
  - **Access Control**: The automation identity is automatically assigned to every job, enabling full access to Azure.
  - **Logging**: Execution logs are sent to the platform Log Analytics workspace for monitoring.

### Packaging & Parameters

  - **Script Bundling**: All scripts are bundled into a single container image and published to the GitHub Container Registry.
  - **Script Mapping**: Each job must have the same name as the PowerShell script it executes.
  - **Parameters**: Job-specific inputs are passed as environment variables, defined in a parameter file for each script.
  
### How To Add New Automation Job