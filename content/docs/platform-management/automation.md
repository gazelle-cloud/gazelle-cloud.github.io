---
title: Automation
breadcrumbs: true
weight: 40
toc: true
sidebar:
  open: true
---
Platform automation is powered by Azure Container App Jobs. The service is optimized for running scheduled automation flows with minimal infrastructure overhead. 

### Automation identity

A single user-assigned managed identity is reused across all automation jobs. This identity is granted `Contributor` permissions at the top-level management group and Microsoft Graph API permissions to read `Users` and `Groups` in Entra ID. All jobs authenticate using this identity.
{{< callout type="info" >}}
Entra ID Graph API permissions are assigned using a classic deployment, because Deployment Stacks do not support deleting Entra ID objects that are no longer defined in the templates.

{{< /callout >}}  

Instead of creating separate identities and assigning precise roles per job, a unified identity is used across all automation. This simplifies management and reduces overhead—even if it technically grants broader permissions than each job strictly requires.

To mitigate risk, access is tightly controlled through centralized and secure source control: all automation jobs are maintained in a single GitHub repository, with access limited to a small group of trusted engineers. Every change is reviewed through pull requests, ensuring that automation scripts are vetted before execution.
   
### Job Execution
 
  - **Triggering**: All jobs use cron-based scheduling.
  - **Naming Convention**: Jobs follow a consistent naming pattern: `cron-`.
  - **Network Access**: The Container Apps Environment is configured to block all public network access and does not have virtual network integration. As a result, automation jobs are limited to control-plane operations only.
  - **Access Control**: The automation identity is automatically assigned to every job, enabling full access to Azure.
  - **Logging**: Execution logs are sent to the platform Log Analytics workspace for monitoring.

### Packaging & Parameters

  - **Script Bundling**: All scripts are bundled into a single container image and published to the GitHub Container Registry.
  - **Script Mapping**: Each job must have the same name as the PowerShell script it executes.
  - **Parameters**: Job-specific inputs are passed as environment variables, defined in a parameter file for each script.