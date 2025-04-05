---
title: Platform
weight: 10
---

This platform is designed with a single purpose: to create and manage landing zones so application engineers can focus on building and innovating, without having to worry about the underlying cloud setup.

The goal is to make the platform invisible for application teams. That means they get everything they need to develop and deploy in the cloud—without delays, bottlenecks, or unnecessary complexity. At the same time, ensure that the platform keeps costs aligned with actual usage, so you only pay for what you use. It's efficient by design.

Behind the scenes, the platform provides control over key IT areas such as identity, networking, security, automation, and monitoring. So while it stays out of the way for engineers, it still delivers the visibility and security that organization need.

- **Identity and Access Management**: aim for passwordless authentication methods, not only for users but also for service identities. Federated credentials and managed identities are used, and local authentication methods like authentication keys and tokens are disabled. This enforces the use of Role-Based Access Control (RBAC) for granular access management.

- **Networking**: All workloads are cloud only, therefore there is no network connectivity to on-prem. Netwroks are fully isolated and PaaS resource firewall used to restrict the network access. The default network range for landing zone is set to /24 and unique address space for each landing zone is allocated, allowing to create vnet peerings in case network connectivity is required between landing zones. Firewalls and Application Gateways can be configured at the landing zone scope if application requires public network inspection.

- **Automation**: Azure Container App jobs execute PowerShell scripts to automate manual, repeatable tasks, streamlining operations and reducing manual overhead

- **Security**: Azure Policies are configured to enforce a base security baseline—for example, disabling public network access and local authentication mechanisms. Microsoft Defender for Cloud is enabled to notify application engineers of any security alerts.

- **Cost Management**: Microsoft Customer Agreement is used to create all subscriptions, budget and alerts configured at the application level and individual subscription.Pay-As-You-Go vs. fixed pricing to align costs with actual platform consumption. Platform services are selected based on actual consumption ensuring cost tied with operational needs.

- **Shared services**: To keep the platform lean and avoid bottlenecks, shared services are minimized to the essentials.

- **Monitor**: Azure Log Analytics Workspace is used to store diagnostic settings, and this configuration is enforced via Azure Policies. Standard Azure Monitor Workbooks provide insights into platform resource utilization and configurations.




### Playground
Gazelle offers a playground environment to explore and experiment with Azure landing zone management. Designed for hands-on learning, it provides a safe and controlled space where engineers can freely test new capabilities, refine their skills, and understand the nuances of managing Azure landing zones.

### Everything-as-Code
At its core, Gazelle embraces the Everything-as-Code philosophy, ensuring consistency, repeatability, and scalability through automation. All provisioning and configuration tasks are done as code, allowing engineers to maintain high standards of quality and portability. The codebase is designed to be easily replicated across GitHub repositories and deployed to Azure tenants. It offers a solid foundation to dive into the mechanisms of Azure landing zone management. 

### Focus on Real-World Challenges

It addresses the daily challenges faced by cloud engineers, such as ensuring cost transparency, configuring network restrictions for all resources, and making it easy to adapt the code as requirements evolve. By bridging the gap between experimentation and real-world landing zone setups, it provides foundations for building resilient and efficient cloud infrastructures.