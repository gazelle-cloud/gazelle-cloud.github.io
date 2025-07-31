---
title: Automation
breadcrumbs: true
weight: 40
toc: true
sidebar:
  open: true
---
Platform automation is powered by Azure Container App Jobs. The service is optimized for running scheduled automation flows with minimal infrastructure overhead and offers free 180,000 vCPU-seconds. 

![automation](/automation.png)

## Automation identity

All automation jobs use the same user-assigned managed identity. To follow the principle of least privilege, a custom Azure role named `platform-automation` is created. This role includes only the permissions needed for the jobs to run and is assigned at the top-level management group. The identity also has Microsoft Graph API `Directory.Read.All` permissions in Entra ID. Every job uses this identity to authenticate.

{{< callout type="info" >}}
Entra ID Graph API permissions are assigned using a classic deployment, because Deployment Stacks do not support deleting Entra ID objects that are no longer defined in the templates.
{{< /callout >}}  

   
## Job Execution
 
  - **Triggering**: All jobs use the same cron-based schedule.
  - **lightweight processing**: Each job starts with a resource allocation of 0.5 vCPU and 1 GB memory.
  - **Naming Convention**: Jobs follow a consistent naming pattern: `cron-`.
  - **Network Access**: The Container Apps Environment is configured to block all public network access and does not have virtual network integration. As a result, automation jobs are limited to control-plane operations only.
  - **Access Control**: The automation identity is automatically assigned to every job.
  - **Logging**: Execution logs are sent to the platform Log Analytics workspace for monitoring.

## Packaging & Parameters

  - **Script Bundling**: All scripts are bundled into a single container image and published to the GitHub Container Registry.
  - **Script Mapping**: Each job must have the same name as the PowerShell script it executes.
  - **Parameters**: Job-specific inputs are passed as environment variables, defined in a parameter file for each script.

## Automation Jobs
The platform includes scheduled automation jobs that handle routine maintenance tasks—reducing manual effort and keeping the environment clean.

- **Cleanup Roles**: Scans all subscriptions for orphaned role assignments—cases where an Entra ID object (user, group, or service principal) has been deleted, but the role assignment still exists. This helps maintain clean and accurate access control across the platform.
The job runs at the subscription scope and requires Microsoft Graph API `Directory.Read.All` permission to look up directory objects.
- **Remediate Policies**: Identifies resources that are non-compliant with policies and automatically triggers remediation actions—such as configuring required tags or fixing diagnostic settings. This ensures consistent enforcement of platform standards across landing zones without manual effort.


## Add New Job
To add a new automation job, follow these steps:
- **Operational Flow**: Start by reviewing the platform’s [operational flow guide](/docs/platform-management/#operational-flow) to understand the setup process and standards.
- **Create PowerShell Script**: Write a PowerShell script to perform the automation task, and save it under `automation/scripts/<your-job>.ps1`
  {{< callout type="info" >}}
The script name must match the job name exactly.
{{< /callout >}}  
- **Job Parameters**: Define any required input variables by editing the `main.bicepparam` file located in `automation/parameters`. Use the following schema as a reference:  
```bicep
  param PowerShellJobs = {
  'cleanup-Roles': {
    variables: []
  }
  'remediate-Policies': {
    variables: [
      {
        name: 'topLevelManagementGroupName'
        value: topLevelManagementGroupName
      }
    ]
  }
}
```  
- **Update Permissions**: If the job requires additional Azure permissions, update the customRoles.json file to include the necessary actions. This ensures that the automation identity has appropriate access without over-provisioning.

 


