---
title: Platform Design
breadcrumbs: false
toc: true
weight: 20
---
This page outlines the pillars that form the foundation of Gazelle's tenant setup. From resource organization to cost, and compliance, these principles define how landing zones are structured and managed to meet the needs of modern cloud platform.

## Design Principles

### Self-Service

Self-service is critical for reducing dependency on centralized platform teams and empowering application teams to manage their own landing zones. Using predefined GitHub issues and automated workflows, Gazelle allows teams to create landing zones, edit budgets, exempt policies, or deactivate subscription independently. This approach enhances efficiency by putting essential tasks directly into the hands of the teams.

### Consumption-Based Billing

Managing platform costs effectively starts with avoiding fixed-cost services whenever possible. Gazelle focuses on selecting Azure services that charge based on actual consumption, aligning costs with actual usage to maintain efficiency. By prioritizing pay-as-you-go resources over those with predefined pricing, the platform ensures that costs remain directly tied to operational needs.

### BigBang

Unforeseen failures shouldn’t lead to downtime or complex recovery processes. The BigBang principle ensures that platform services can always be redeployed from scratch, providing a reliable fallback mechanism. By treating the platform as fully disposable and repeatable, BigBang simplifies recovery and guarantees operational continuity.

## Key-Objectives

### Identity

Identity and access management at the landing zone scope it delegated to application teams, allowing them to handle control for their applications. However, local authentication methods are prohibited allowing only Role Based Access Control to have full control of who has access to what. 

### Resource Organization

Clear boundaries for cost, management, and scaling are critical for maintaining a well-organized platform. In Gazelle, subscriptions act as these boundaries, supporting the principle of one application, one environment, one landing zone. This structure keeps the platform simple and efficient while allowing applications to span multiple subscriptions if needed.

### Compliance

Ensuring compliance across Azure resources requires a proactive approach. Gazelle uses Azure Policies to automatically remediate non-compliant resources, even if they originate from Infrastructure-as-Code templates. When exceptions are needed, policy exemptions can be configured through self-service, maintaining a balance between flexibility and compliance standards.

### Network

Each landing zone has a fully isolated virtual network, with no cross-connectivity to other cloud application by default. Public network access is blocked using Azure Policy, while resource-specific local firewalls are used to enable access where needed. When network communication is necessary, virtual network peering can be configured to provide secure and controlled connectivity cross landing zones. For scenarios requiring advanced traffic inspection, deploying an Azure Firewall or Application Gateway is recommended to maintain security.

### Security

### Monitor

Gazelle uses Azure Monitor to centralize logs from all landing zones, sending them to a Log Analytics workspace where they are retained for 180 days.

### Billing

Gazelle manages costs within a tenant by creating all subscriptions under the Microsoft Customer Account type. Each application is assigned a dedicated invoice section, offering clear cost breakdowns at the application level. Application owners maintain full visibility and control over their spending, with configured cost alerts set at the landing zone scope to prevent unexpected overruns.

