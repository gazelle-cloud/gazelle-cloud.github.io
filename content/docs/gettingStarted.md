---
title: Getting Started
breadcrumbs: false
weight: 10
toc: true
---
- Entra
  - create two applications, one for test, another for - prod
  - assign application API permissions for `test` and `prod` applications
    - AppRoleAssignment.ReadWrite.All
    - Directory.ReadWrite.All
  - configure federated credentials
    - choose GitHub as federated credential scenario
    - provide organization name
    - provide repo name
    - Select `environment type` as `environment`
    - provide value `test`

- Azure
  - Management group hierarchy
    - create top level management group, one for `test` and `prod`
    - Assign `Owner` permissions for `test` application at the the test environment top level management group.
  - Billing
    - Create a billing profile for platform subscriptions
    - assign `contributor` role for `prod` application
    - create initial platform subscriptions for test and prod environments (place under the correct mgmt hierarchy)
    - set alerts for 

- GitHub
  - create repo env variable: `APP_GITHUB_AZUREPLATFORM_ID`
  
- Post
  - manually assign `Owner` RBAC role at the test top level management group hierarchy for platform administrators
  - manually assign `Azure Deployment Stack Owner` RBAC role at the tenant root level for platform administrators