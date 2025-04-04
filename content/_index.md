---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
<!-- 
{{< hextra/hero-headline >}}
  Your platform
{{< /hextra/hero-headline >}}
{{< hextra/hero-headline >}}
  Their innovation
{{< /hextra/hero-headline >}}
{{< hextra/hero-headline >}}
 Zero Bottlenecks
{{< /hextra/hero-headline >}} -->

# What is Gazelle?

Gazelle is my Azure development tenant, designed to explore the nuances of managing Azure landing zones. It offers a cost-effective and scalable platform for provisioning, updating, and tearing down landing zones on demand through self-service.

## Platform Design Principles

- **End-to-End Flow** : Platform services deployed independently, enabling continuous improvements without disrupting the broader system.

- **Big Bang**: The platform can be rebuilt from scratch at any time—supporting disaster recovery and environment resets

- **Cost Friendly**: Pay for what you use—no more, no less. A platform that processes thousands of operations should scale accordingly. But when it sits idle, it should cost close to nothing.

- **Fail Safely**: A dedicated test environment mirrors production, allowing teams to experiment freely and deploy to production with confidence.

- **Minimal Shared Services**: Keep platform-wide services to a bare minimum—reducing cost, complexity and bottlenecks.


## A Landing Zone

A Landing Zone is a foundational blueprint for a new Azure subscription, defining governance, and operational standards for cloud applications. By providing ready-to-use infrastructure, deployment pipelines, and compliance controls, Landing Zones streamline cloud adoption—allowing teams to focus on innovation rather than platform setup and governance.

- **Cost Management**: Fine-grained cost tracking at the application and environment level ensures financial accountability. Budgets and alerts provide proactive cost control, preventing unexpected expenses.
 
- **Self Service**: Fully automated flow enables teams to create, update, or delete landing zones independently—eliminating reliance on central support.

- **Security baseline**:  Azure Policies enforce a security baseline, ensuring compliance with organizational standards. Policy exemptions can be granted where flexibility is required.

- **Networking**: Each landing zone operates in an isolated network environment, with PaaS-native firewalls restricting access to approved traffic.

- **Identity**: Every landing zone includes a dedicated identity with `Owner` permissions and pre-configured GitHub Actions for Azure service deployments.

- **Deployment pipeline**: Getting started deployment pipeline aligned with platform capabilities and recommendations.


Gazelle is a continuously evolving platform, designed to meet the dynamic challenges of Azure landing zone management. The platform’s entire codebase and configurations are open-source and available on GitHub, enabling users to explore, adapt, and integrate its features into their own setups. 

