---
title: Identity
breadcrumbs: false
toc: true
weight: 50
---

### Platform Identity

Platform identity is used by GitHub Actions to provision and configure the entire Azure platform setup within a tenant, including creating new landing zones. It is manually created and assigned during the initial platform configuration phase. The identity is granted `Owner` permissions at the top-level management group and `Billing Profile Contributor` permissions at the billing profile scope. To maintain isolation, two separate identities are created—one for each environment—ensuring that the production environment remains completely isolated from other operations.

This identity is created as an Entra ID app registration, with federated credentials configured to authenticate from a specific GitHub repository. The security of this setup is relies on the safeguards applied to both the GitHub repository and Entra ID itself.


### Optimized Access Control for Daily Tasks

When managing access control at the management group level, I focus on assigning permissions based on team responsibilities to ensure clarity and alignment with operational needs. To achieve this, custom Azure roles are created to provide just enough access for manual administrative tasks without violating Infrastructure-as-Code principles. These roles are built using the built-in `Reader` role as foundation, with specific `Actions` added to meet the unique requirements for each role.

Bicep templates provide a streamlined approach to updating roles by simply modifying a parameter file. This parameter file acts as the single source of truth, ensuring that any changes—whether adding, modifying, or removing roles or actions—are automatically applied to the live Azure setup.

Each environment is managed using its own Bicep parameter file. This separation enables granular permission assignments tailored to specific environments. For instance, you can grant engineers broader permissions in a development environment while maintaining stricter controls in production.

The example below illustrates how the Landing Zone Admin role is defined in the production environment, with specific permissions applied at the top-level management group scope.


```bicep
param roles = [
  {
    roleName: 'Landing Zone Admin'
    scope: topLevelManagementGroupName
    principalId: gazelleAdminGroupId
    actions: [
      '*/read'
    ]
  }
]
```
