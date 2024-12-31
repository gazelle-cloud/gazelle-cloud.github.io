---
title: Azure Platform Design
breadcrumbs: false
toc: true
weight: 20
---
This page outlines the pillars that form the foundation of Gazelle's tenant setup. From resource organization to cost, and compliance, these principles define how landing zones are structured and managed to meet the needs of modern cloud applications.

## Design Principles

### Self-Service

Gazelle empowers application teams with a self-service model, allowing them to manage their landing zones autonomously. Through predefined GitHub issues and automated workflows, teams can perform operations such as creating new landing zones, editing budgets, exempting policies, or deactivating landing zones no longer in use. This reduces reliance on centralized platform teams, and improves the overall developer experience by simplifying interactions with Azure’s ecosystem.

### Second-Based Billing

The platform aligns with Azure’s second-based billing model to avoid the fixed pricing model. Instead, Gazelle focuses on charging only for the actual, second-based consumption. This approach encourages the adoption of serverless architectures, where costs adjust dynamically based on real usage, rather than idle or under utilized resources.

### BigBang

The BigBang GitHub workflow ensures that all platform services can be redeployed from scratch at any time, serving as a robust fallback mechanism for unexpected failures. By treating the platform as fully disposable and entirely repeatable, BigBang simplifies recovery processes and minimizes downtime.

## Key-Objectives

### Identity

Identity and access management at the landing zone scope it delegated to application teams, allowing them to handle control for their applications. However, local authentication methods are prohibited allowing only Role Based Access Control to have full control of who has access to what. 

### Resource Organization

While application engineers have the freedom to group resources into resource groups, the subscription serves as a boundary for cost, management, scale and development. Following the principle of one application, one environment, one landing zone ensures clarity and efficiency. Applications can span as many subscriptions as needed, providing the necessary scalability and control.

### Compliance

To keep all Azure resources compliant, Azure policies are configured to automatically remediate any non-compliant resources, even if Infrastructure-as-Code templates specify otherwise. This proactive approach helps safeguard applications from any potential misconfigurations. If specific application require exceptions, policy exemptions can be configured via Self-Service, offering flexibility without compromising overall compliance and development experience.

### Network

Each landing zone has a fully isolated virtual network, with no cross-connectivity to other cloud application by default. Public network access is blocked using Azure Policy, while resource-specific local firewalls are used to enable access where needed. When network communication is necessary, virtual network peering can be configured to provide secure and controlled connectivity cross landing zones. For scenarios requiring advanced traffic inspection, deploying an Azure Firewall or Application Gateway is recommended to maintain security.

### Security

### Monitor

Gazelle leverages Azure Monitor to collect logs across all landing zones. By enforcing diagnostic settings through Azure Policy, it ensures that logs are gathered into a central Log Analytics workspace and kept there for 180 days.

### Billing

Gazelle manages costs within a tenant by creating all subscriptions under the Microsoft Customer Account type. Each application is assigned a dedicated invoice section, offering clear cost breakdowns at the application level. Application owners maintain full visibility and control over their spending, with configured cost alerts set at the landing zone scope to prevent unexpected overruns.

