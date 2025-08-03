---
title: Access Control
breadcrumbs: true
weight: 30
toc: true
sidebar:
  open: true
---
Access to platform services is managed at the management group level using **custom roles** and **role assignments**, following Infrastructure-as-Code principles. This ensures repeatable access control across environments.

## Access Control as Code

- **Access Control**: Implemented as an abstraction layer on top of Azure custom roles and role assignments. Custom roles and assignments are bundled and deployed as a single unit via Deployment Stacks—enabling full lifecycle management of access, entirely as code.

- **Just Enough Access**: Roles are based on team-specific operational responsibilities—such as Landing Zone Engineer or Billing Admin. Access is scoped to provide just enough permission to operate safely, without breaking Infrastructure-as-Code principles. 

- **Custom Role Definition**: All custom roles are defined in a `customRoles.json` file. This ensures that the set of allowed actions—what a role can do—remains consistent across environments. Each environment (e.g., test, production) has its own parameter file that specifies which group receives which role, allowing environment-specific assignments without redefining the role itself.

- **Test `Landing Zone Engineer` Role**: platform engineers have full access in the test environment, which makes it difficult to validate `Landing Zone Engineer` in the test environment. To address this, Entra ID group (Landing Zone Engineers – Test) is created for role testing. This group is assigned the same role used in production, enabling validation of permissions in an isolated environment—before changes are rolled out to actual users.