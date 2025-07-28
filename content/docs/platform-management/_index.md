---
title: Platform Management
breadcrumbs: true
toc: true
sidebar:
  open: true
---
Platform management is grounded in automation and transparency. Every change introducing a new capability, updating a policy, or applying a fix flows through GitHub as the single source of truth, where human has no direct access to Azure services. 

![management](/mgmt.png)

Gazelle defines a structured approach to managing Azure landing zones using Bicep, Azure Deployment Stacks, and GitHub Actions. The management process is standardized to ensure that every platform capability follows a consistent pattern, reducing variability and simplifying maintenance.

- **End-to-End Flow**: Every platform capability ships through its own pipeline—handling everything it needs to run, from provisioning to teardown.  
- **Small, Task-Oriented Modules**: The platform codebase is made of small, focused modules—each solving one problem, and solving it well.
- **Test Environment**: The test environment runs the same pipelines, the same services, just in a safe space to validate updates.  
- **Standardized Deployments**: Every deployment follows the same pattern. Once you’ve seen one, you’ll know how the rest work.  
- **BigBang**: The entire platform can be teardown and rebuilt at any time—automatically, reliably, without surprises.

## End-to-End Flow

Gazelle organizes deployments into functional units, each focused on a specific platform area. Each unit groups related capabilities and is deployed through its own pipeline, provisioning all required Azure services and configurations.

Dependencies between functional units are handled using GitHub Variables. Values such as resource IDs are stored as GitHub Variables, enabling pipelines to share data across deployments without being directly dependent on one another.


| Functional Unit	       | Purpose |
|--------------|---------|
| **Tenant Level**    | Establishes the Azure Management Group hierarchy and billing account configuration. |
| **Monitor**   | Deploys diagnostic settings, alerts, and monitoring infrastructure—ensuring visibility across all landing zones. |
| **Identity**  | Manages custom role definitions and assignments at the management group level to standardize permissions across the platform. |
| **Automation** | Implements operational automations like policy remediation, resource clean-up tasks, and other routines that keep the platform healthy. |
| **Policy**    | Deploys the policy identity, along with all custom Azure Policy definitions and assignments for enforcing security and compliance standards. |



## Small, Task-Oriented Modules  

Each functional unit is composed of task-oriented Bicep modules, each designed with a clear and specific purpose. The focus is on solving a single problem within the functional unit, rather than on broad reusability across different contexts. This means that a module is tailored to perform one task effectively—for example, deploying monitoring configurations or setting identity permissions—without attempting to generalize beyond that scope.

This approach follows the single-responsibility principle within the boundaries of each functional unit. As a result, the modules remain simple to understand, maintain, and evolve. When changes are required—such as modifying a policy assignment or updating monitoring settings—engineers can work directly with the relevant module, confident that updates will not affect unrelated parts of the platform.

## Test Environment

A dedicated test environment is maintained to replicate the production configuration of the platform. This includes the management group hierarchy, policy settings, identity and access controls, and all other platform configurations. The test environment is used to validate changes under conditions identical to production.

All updates are applied to the test environment first. Main branch protections enforce the flow — direct changes to production are not allowed. This consistency between environments ensures that only validated updates are promoted to production.

## Standardized Deployments

All platform deployments in Gazelle follow a standardized deployment pattern. Once you’ve seen one, you’ll know how the rest work. This consistency allows engineers to focus on building platform capabilities, rather than dealing with the mechanics of shipping.
![landing-zone-platform](/done.png)

### GitHub Workflows
- **GitHub-Hosted Runners**: Deployments are executed on GitHub-hosted agents.  
- **Streamlined Workflows**: Standardized GitHub Actions workflows manage deployment triggers and environment setup, ensuring each deployment starts with the correct context and configuration.  
- **Authentication and Access**: GitHub Actions authenticate to Azure and Entra ID using federated credentials. The workflow identity is granted the necessary Azure RBAC permissions, access to Entra ID Graph API, and permission to read and update GitHub repository variables.  
- **Input Handling**:  Deployment inputs are provided via Bicep parameter files. In addition, platform-wide parameters (such as region or environment settings) can be fetched dynamically from GitHub variables.  
- **Output Management**: Outputs from the main Bicep deployment can be written back to GitHub variables. This enables passing information, such as a Log Analytics resource ID, between functional units or subsequent deployment steps.  

### Deployment Stacks
- **Stacks Over Classic Deployments**: Deployment stacks are the preferred deployment option because they provide built-in lifecycle management capabilities. However, classic deployments are also supported for scenarios where different lifecycle management is required.
- **Deployment Scope**: All platform deployments run at the top-level management group. Each landing zone sits in its own child management group, keeping landing zone and platform resources separate. 
- **Delete All**: Deployment stacks are configured by default to delete all resources not defined in the templates. This behavior aligns with Infrastructure as Code principles, where the codebase represents the single source of truth.
  
### Outputs
Outputs from the main deployable Bicep file can be passed to GitHub Variables, enabling other pipelines to pass data between deployments. This mechanism allows functional units to remain decoupled while still sharing resource IDs or configuration values.  

Outputs should be defined in the Bicep template as an object of key-value pairs. 
```
output GitHubEnvironmentVariables object = {
  log_analytics_resource_id: logAnalytics.outputs.logAnalyticsResourceId
}

```
Supported output targets:
 
- **Repository Variables**: ``GitHubRepositoryVariables``
- **Environment Variables**: ``GitHubEnvironmentVariables``
- **Actions Variables**: ``GitHubActionsVariables``

## BigBang
The entire platform must always remain in a reproducible state, capable of being deployed from scratch in a single flow. Every change to the platform—whether adding, updating, or removing functionality—must support this principle. To validate it, the following GitHub Actions workflows are provided:

- **Destroy The Platform**: Deletes the entire Azure platform setup, useful for resetting test environments or verifying that the platform can be fully re-provisioned without drift. 
- **Big Bang Deployment**: Deploys the entire platform from scratch using a collection GitHub workflows, ensuring that a clean, fully functional environment can always be recreated.
