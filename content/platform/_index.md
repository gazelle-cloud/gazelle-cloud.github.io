---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
# platform

## Identity

- **Platform Identity**:  Platform operates using Entra Id app registration `Azure-platform`. The identity has access to create new landing zones, deploy entire Gazelle platform and configure Microsoft Graph permissions.
- **Fully Automated**: human has no access to deploy or manually configure platform settings. Entire azure platform is fully automated and managed by GitHub Actions.
- **Custom Roles**: Where manual operations is required, a custom Azure roles are build to give just enough access. The role is build based on a Reader role, and extending permissions by providing needed actions. Only actions that do not conflict with Infrastructure-as-Code deployment pipelines are added.