---
linkTitle: Platform Automation
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 60
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# Automating Platform Operations

The engine behind automating Azure landing zone operational tasks is built to provide a truly serverless experience. The heavy lifting — compute, identity, networking, monitoring and runtime infrastructure — is fully managed by the Azure Container Apps, so engineers never have to think about cluster management or runtime plumbing.

Deployment pipelines are designed so that onboarding a new automation job is as simple as editing a few lines in a user-friendly parameter file. This lets platform engineers focus entirely on the automation logic and desired outcomes, instead of runtime configuration or deployment setup.


## Container App Jobs

The automation is built on Azure Container Apps Jobs, running in a fully managed, consumption-based environment. Each automation workflow executes as a single, short-lived container on a scheduled trigger, using compute only during actual execution — typically staying within Azure’s free billing tier.

The environment exposes no ingress, operates without VNet integration, and has no private endpoints. As a result, jobs cannot be reached from external networks and cannot interact with Azure resources that are accessible only via private networks.

Each job runs in a predictable flow: start the container, execute the script, publish logs, and terminate. Scaling and parallelism are intentionally simple — one container per job, a 300-second timeout, and no multi-replica fan-out. These conventions keep automation workloads predictable, and easy to maintain while keeping automation complexity low.


## Automation Identity

A unified user-assigned managed identity is used for all automation jobs. This approach simplifies the onboarding of new automation workflows and provides a clear overview of role assignments in the Azure Portal under the Access Control (IAM) blade, since all automation jobs are centralized under a single identity (id-automation-test).

The automation-identity is granted the `Directory.Read.All` Microsoft Graph permission, providing visibility into Entra ID and the `Contributor` RBAC role at the top-level management group, giving it privileged access across all Azure resources. While this design ensures flexibility and simplicity, it demands discipline when reviewing code — even a small misconfiguration in a PowerShell script could cause serious impact.

For that reason, every codebase change must be reviewed and tested in a production-like environment before being deployed to production, ensuring that automation remains both safe and reliable.

## Docker image

PowerShell sscripts are packaged as a Docker image built on top of Microsoft’s official Azure PowerShell base. This provides a maintained environment with PowerShell, including Az modules. All automation scripts are bundled directly into the image, making it a single, self-contained artifact.

The finalized image is published as a package in GitHub Container Registry and is pulled over the public internet by the Container Apps environment during job execution. Because the image contains only non-sensitive automation logic, hosting it in GitHub Container Registry is a cost-efficient and operationally simple solution for managing container images.

## Automation Jobs 

### Add new Job
Adding a new automation job is straightforward. You drop a PowerShell script into the `platform-management/automation/scripts` folder and update the parameter file with a job entry using the same name as the script. After committing the change, the pipeline automatically provisions all required Azure resources, and the Container Apps Job executes the script at runtime.

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
  'another-job': {
    variables: []
  }
}

```
### Cleanup Roles 
Scans all subscriptions for orphaned role assignments, where an Entra ID object (user, group, or service principal) has been deleted but the role assignment remains. This keeps access control clean and ensures no orphaned assignments linger. The job runs at the subscription scope and uses `Directory.Read.All` via Microsoft Graph to check directory objects.

### Remediate Policies 
Detects resources that are out of compliance and automatically applies the fix, like enforcing required tags or wiring up diagnostic settings. This ensures platform guardrails are always applied, without waiting for someone to notice and correct it by hand.