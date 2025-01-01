---
title: GitHub Workflows
breadcrumbs: false
toc: true
weight: 40
---
## Overview

GitHub Actions serve as the backbone of Gazelle’s deployment automation, enabling consistent operations across diverse environments. They are designed with maintainability in mind and support scalability in both breadth and depth. To achieve this flexibility, workflows are divided into two distinct parts: template workflows and deployment workflows.

- **Template Workflows**: Define what needs to be deployed. They contain the core deployment and configuration logic and handle the entire deployment process from start to finish.

- **Deployment Workflows**: Define when and where templates are applied. They manage triggering conditions, target environments, and deployment-specific parameters, serving as the engine that executes the deployment logic defined in the templates.

This division ensures the Azure platform is consistently maintained across environments, easily adaptable to changes, and scalable as the platform grows.


### Landing Zone Workflows

Landing zone workflows follow a 1-to-many relationship: a single template workflow serves as the foundation for all landing zone deployment workflows. 
- During the landing zone setup process, deployment workflow is generated. 
- Pipelines are triggered automatically whenever the landing zone parameters file is edited.

### Platform Workflows

Platform workflows are grouped by Azure platform capabilities, as outlined in the [Modular Deployment](/managing-platform/#modular-deployments) section. This approach follows a 1-to-1 mapping principle, where each Azure platform service is associated with a single template and its own dedicated deployment workflow.
- GitHub Actions are triggered automatically whenever any file associated with a workflow is changed.

### BigBang

BigBang is a suite of workflows designed to set up a selected Azure platform environment from scratch to full operational state. It serves as a recovery tool for addressing unexpected failures or cloning an entire platform setup into a different Azure tenant.

### Destroy Azure Platform

The 'Destroy Azure Platform' pipeline is designed to clean up the platform environment while leaving application landing zones untouched. It removes all resources associated with platform landing zones, deployment histories, management groups, and GitHub environment variables. 

Once the platform environment has been cleaned up, it can easily be recreated to a fresh copy by triggering the 'BigBang' pipeline.