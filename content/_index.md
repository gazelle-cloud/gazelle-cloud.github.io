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


Gazelle is a suite of Azure and GitHub services to realize my thoughts and ideas on how Azure landing zones could be managed. The space is designed to be as close as possible to a real world implementations, however it's used for educational purposes. It provides fully automated deployments, strict access control, network isolation, low cost and self-services capabilities to manage landing zones.   

![Azure-platform-modular-Deployments](/2.png)


## key features
- **Big Bang** 
- **Self Service**
- **Test Environment**
- **Streamlined Deployments**

## design principles

- **Security**
  - Defender For Cloud is configured to notify landing zone engineers on new security alerts
  - Azure Policies enforced to meet security baseline
    - Deny direct public network access
    - Disable local authentication methods
    - Ensure that data is encrypted at rest and in traffic

- **Cost**
  - Pay-As-You-Go versus fixed price to ensure that cost reflects actual platform consumptions
  - `Invoice-section` is created per application, enabling a full cost transparency and granulated cost control

- **Monitor**
  - Azure policies enforced to collect diagnostic settings to landing zone specific Log Analytics workspace 
  - Alerts configured to notify landing zone engineers on cost anomalies, budget alerts and Azure health status changes

- **Deployment**
  - All platform resources deployed via GitHub Actions, no direct human interaction is allowed for deployment and configuration
  - Deployments are managed by Azure Deployment Stacks, to ensure that resources effectively deleted when no longer defined in codebase
  - Following End-To-End deployment logic, meaning that a specific platform capability is deployed and configured using a dedicated GitHub Action that is designed for singular purpose. 
  - Bicep templates authored for a task-

- **Network**
  - Each landing zone has a dedicated virtual network, that is completely isolated by default
  - virtual network peering can be configured in case of communication between landing zones
  - A default CIDR range for landing zones is `/24`
  - IPAM finds new, unused address space in environment, enabling Vnet peering if needed 
  
- **Identity**
  - Azure policies configured to `Deny` local authentication methods, allowing Entra Id and RBAC roles as a single option to authenticate and authorize to Azure resources
  - Each landing zone has a dedicated User-Assigned-Managed-Identity with `Owner`
  - Landing zone identity is used as a service connection for GitHub Actions. Federated Authentication is configured to match respository/environment
  - If a platform capability (such as Azure Policy) requires and identity, a dedicated User-Assigned Managed Identity is created. 

- **Automation**
  - Container App Jobs configured to run powershell scripts on a schedule basis
  - Automation

- **Resource Organization**
  - 



Gazelle reflects the essence of lightweight Azure landing zone management through automation, modern software engineering principles, and frictionless End-To-End flow.

- **Tailored Solutions**: small, task-focused Bicep modules paired with streamlined deployment logic create a platform that's adaptable and easy to scale with evolving needs.
- **Lean footprint**: centralized services are minimized to essentials, reducing bottlenecks and granting application teams the autonomy they need.
- **Self-service**: with full automation powered by GitHub issue templates and workflows, application teams can  create, update, or delete landing zones, eliminating the need for centralized support
- **Fast Deployments**: with small, independent services at its core, the platform supports deployments in minutes, enabling quick feedback loops for iterative development.
- **Cost Efficiency**: Azure services are selected based on actual consumption, ensuring costs tied with operational needs.
- **Fully Automated**: platform deployment and configuration are fully automated, eliminating human intervention for consistent, reproducible setups.
- **Testing Flow**: changes are validated in an isolated, production-like environment before release, ensuring a stable, clean live setup.

## Get Started

Ready to build your own lightweight Azure platform?

- **Explore the Code**: The entire Gazelle codebase and configurations are open source and available on GitHub.
- **Share Your Story**: Join GitHub Discussions to share what you’ve built. We’d love to hear your ideas and insights!