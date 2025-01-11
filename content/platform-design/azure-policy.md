---
title: Azure Policy
breadcrumbs: false
toc: true
weight: 40
---


Azure Policy is a service for enforcing compliance standards within a cloud environment. It ensures resources are configured to meet specific requirements, such as disabling public network access or centralizing audit logs in a Log Analytics workspace. Azure Policies is set to automatically fix non-compliant resources as they are created, even if they come from Infrastructure-as-Code templates.

To simplify management, policies are organized based on compliance objectives

- **Disabling public network access**: prevents exposure of resources to the public internet.
- **Disabling local authentication methods**: Ensures stronger security by requiring modern or centralized authentication methods.
- **Traffic encryption**: Enforces secure communication by requiring encryption standards.
- **Collecting diagnostic logs**: Aggregates resource activity logs for monitoring and auditing.
- **Allowed locations**: Limits resource deployment to specific geographic regions.
- **Allowed resources**: Ensures only approved resource types are deployed.

These policies help prevent application teams from misconfiguring resources. If an exception to a policy is required, application teams can submit a pull request with a clarification to create an exemption for a specific resource group. This approach ensures that the exemption request is reviewed and approved in a structured manner, maintaining a balance between compliance and operational flexibility.
