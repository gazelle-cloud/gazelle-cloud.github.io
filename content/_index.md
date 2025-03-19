---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
{{< hextra/hero-headline >}}
  Your Platform
{{< /hextra/hero-headline >}}
{{< hextra/hero-headline >}}
  Their Innovation
{{< /hextra/hero-headline >}}
{{< hextra/hero-headline >}}
 Zero Bottlenecks
{{< /hextra/hero-headline >}}


## What is Gazelle?

Gazelle is my Azure-based engineering playground where I apply engineering principles to develop Azure landing zones. The goal is simple: make it easy for application engineers to build in the cloud at their own pace—without getting stuck in bottlenecks.

![Azure-platform-modular-Deployments](/2.png)


## Development flow

The deployment flow for the platform and landing zones is designed to be predictable, scalable, and easy to maintain. It follows a few key principles to ensure consistency, flexibility, and reliability across environments.

- **Small, Task-Oriented Modules**:  templates break down into small, focused components. This keeps the codebase easy to read, understand, and extend over time.

- **End-To-End flow**: Resources are grouped into logical units based on platform capabilities, and deployed as independent end-to-end bundles. This ensures features can be deployed, and managed autonomously, without impacting other areas of the platform.
  
- **Test Environment Mirrors Production**: A dedicated test environment mirrors production as closely as possible. This facilitates safe experimentation, and increases confidence that changes will behave as expected in production. 

- **Streamline Deployment Pipelines**: standardized deployment flows for all platform resources. Inputs, outputs, and deployments follow a consistent pattern, enabling rapid onboarding of new services. GitHub Actions automate the flow, letting engineers focus solely on delivering new capabilities.

- **BigBang Deployment**: deploys a fully operational Gazelle platform from scratch, supporting both disaster recovery scenarios and environment refreshes. It's frequently used to reset development environments, ensuring alignment with production configurations.

- **You-Get-What-You-See**: the code base is the source of truth, Azure resources are not only deployed as defined in the templates, but also removed from the Azure environment if no longer defined in the Bicep templates. This feature significantly reduce manual cleanup tasks. 


## Landing zone

A Landing Zone is essentially a blueprint that gets applied to a new, empty Azure subscription. It lays down the guardrails, and operational foundations that define how applications are developed and run in the cloud.

Landing Zones help accelerate cloud adoption by giving application teams ready-to-use infrastructure, deployment pipelines, and built-in guardrails. This way, teams can focus on delivering business value instead of worrying about setup and compliance.

Each Landing Zone comes with a set of predefined services and configuration patterns designed to support cost control, security baseline, and workload isolation. At the same time, it maintains the flexibility developers need to innovate without unnecessary constraints.

- **Self Service**: with full automation powered by GitHub issue templates and workflows, application teams can create, update, or delete landing zones, eliminating the need for centralized support.

- **Cost Management**: Fine-grained cost tracking at the application and environment level. Budgets and alerts are configured to provide proactive cost control, helping teams avoid unexpected expenses and ensuring clear financial accountability.

- **Security Baseline**: Azure Policies enforce a security baseline, ensuring compliance with organizational requirements. Where required, policy exemptions can be granted to support specific application needs—balancing security controls with development flexibility.

- **Standardize Deployment Pipeline**: Landing zone resources are deployed via automated pipelines, following the same standardized deployment patterns as the rest of the platform (defined in the Deployment Flow). This reduces cognitive overhead for application teams by providing a consistent, repeatable deployment experience, allowing them to focus purely on configuring their application resources.

- **Networking**: The landing zone provisioning process automatically allocates a unique IP address space within the tenant. This simplifies the creation of VNet peerings between landing zones when network communication is required and ensures IP address management is conflict-free

- **Identity**: Each landing zone includes a dedicated identity, preconfigured to enable GitHub Actions workflows for automated provisioning of Azure resources.

- **Segregation**: Gazelle enforces a one application–one environment–one landing zone model. This ensures:
  - Workload isolation for enhanced security and stability
  - Clear cost attribution at the application and environment level
  - Separation of concerns, reducing the risk of unintended interactions between workloads


## Platform

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


Gazelle is an evolving project, and as we refine its components, new capabilities and optimizations will be introduced. This site will continue to serve as a reference for cloud engineers and architects looking to leverage the platform for streamlined cloud adoption.

## Get Started

Ready to build your own Azure platform?

- **Explore the Code**: The entire Gazelle codebase and configurations are open source and available on GitHub.
- **Share Your Story**: Join GitHub Discussions to share what you’ve built. I'w love to hear your ideas and insights!