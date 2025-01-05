---
title: GitHub Actions
breadcrumbs: false
toc: true
weight: 40
---
## Workflows

GitHub Actions are the engine behind Gazelle’s deployment automation, ensuring seamless operations across environments. Built for simplicity and scalability, these workflows are structured into two key parts: template workflows and deployment workflows

- **Template Workflows**: focus on what needs to be deployed. They include the core deployment logic, handling everything from start to finish. 

- **Deployment Workflows**: define when and where templates are applied. They manage triggers, target environments, and deployment-specific parameters, executing the logic set by templates.

This clear separation keeps the platform lightweight, easy to maintain, and ready to scale as needs evolve.

### Landing Zone Workflows
![landing zone GitHub workflows](/landingzone-GitHub-workflows.png)

Landing zone workflows follow a 1-to-many relationship: a single template workflow serves as the foundation for all landing zone deployment workflows. 
- During the landing zone setup process, deployment workflow is generated. 
- Pipelines are triggered automatically whenever the landing zone parameters file is edited.

### Platform Workflows
![Azure-platform-GitHub-workflows](/Azure-platform-GitHub-workflows.png)

Platform workflows are grouped by Azure platform capabilities, as outlined in the [Modular Deployment](/managing-platform/#modular-deployments) section. This approach follows a 1-to-1 mapping principle, where each Azure platform service is associated with a single template and its own dedicated deployment workflow.
- GitHub Actions are triggered automatically whenever any file associated with a workflow is changed.

### BigBang

BigBang is a suite of workflows that quickly sets up an Azure platform environment from scratch to full operation. It serves as a recovery tool for unexpected failures or make it easy to clone an entire platform setup into a different Azure tenant.

### Destroy Azure Platform

The 'Destroy Azure Platform' pipeline provides a way to clean up the platform environment without affecting application landing zones. It removes resources tied to platform landing zones, deployment histories, management groups, and GitHub environment variables. After cleanup, the platform can be effortlessly restored to a fresh state by running the 'BigBang'.