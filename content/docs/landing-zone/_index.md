---
breadcrumbs: false
weight: 30
toc: true
---
# Landing Zone

A landing zone is a blueprint applied to an empty Azure subscription, establishing the initial set of services, and configurations required to build in the cloud. In Gazelle, landing zones provide a cost and security baseline, getting started deployment pipelines, and the autonomy for teams to build applications, without getting entangled in centralized platform processes.

Gazelle landing zones are designed for teams that want to move fast in the cloud, while staying aligned with cost control, and security baseline.

## Requesting a Landing Zone
Landing zones are tied to an Azure invoice section, ensuring that costs are tracked at the application level. Each application has its own invoice section, and teams can request multiple subscriptions (e.g., dev, test, prod) under the same application umbrella.

Submit a request by filling out the GitHub Issues template provided in the platform repository.

Within minutes, the application engineer receives an email confirmation with cost alerts configured and a subscription ready for use.


## What’s Included in the Landing Zone
Each landing zone is provisioned with a consistent set of foundational components:

- **Getting Started Pipeline**: A ready-to-use deployment pipeline to bootstrap application workloads.  
- **Identity**: Role assignments and identity controls aligned with platform standards.  
- **Isolation**: Subscription-level isolation for network and resource boundaries.  
- **Diagnostic Settings**: Centralized diagnostics for monitoring and insights.  
- **Azure Policies**: Enforced policy definitions to ensure compliance and security.  
- **Defender for Cloud**: Security baseline settings activated out of the box.  
- **Cost Management**: Cost tracking configured per application via invoice sections.
- **Network Configuration**: Standardized networking templates and controls.
- **Self-Service**: Tools for developers to manage their own environments within defined guardrails.
- **Centrally Managed Resource Group**: For deploying and managing shared platform services.
- **Health Alerts**: Preconfigured alerts for key operational metrics.
- **Full Autonomy**: Teams retain complete control to build and operate their applications within the landing zone.


- **Isolation**: Networking is built with isolation as the default. There is no out-of-the-box connectivity to other landing zones, on-premises networks. Public access is blocked using Azure Policy, ensuring that all traffic is controlled. Platform-as-a-Service (PaaS) resources—like storage accounts or databases—must restrict traffic using service endpoints, and configure local firewalls accordingly. If network communication is needed, it must be set up explicitly via virtual network peering—always under the control of the owning team.

- **HTTPS Only**: Only secure traffic is allowed. Azure Policy blocks the use of HTTP. All traffic must use HTTPS and follow modern TLS configurations to ensure encrypted, secure communication.

- **/24**: Virtual network address space is configurable. By default, each landing zone receives a /24 CIDR block, providing up to 255 IP addresses. A unique range is assigned during zone creation to prevent IP conflicts and make peering straightforward. Application teams are free to define their own subnets to match the needs of their workloads. 
  
- **one-one-one**: Landing zones follow a strict one app, one environment model. Each zone maps directly to a specific application and environment—for example, MyApp-test. This structure enforces clear ownership, maintains separation of duties, and ensures that changes in one environment (like test) don’t impact others (like prod).

- **rg**: Each landing zone includes a dedicated `landing-zone-resources` resource group for centrally managed services like virtual networks or Log Analytics workspaces. These resources are protected by [Azure Deployment Stacks](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deployment-stacks?tabs=azure-powershell#protect-managed-resources), which allow safe customization (e.g., adding subnets) while blocking destructive operations like deletes. This balances team flexibility with operational safeguards.

- **Landing zone Identity**: Each landing zones has its own dedicated identity, used by deployment automation or to access resources cross landing zones. Identity is seamlessly integrated with the getting-started pipelines, passwordless, and no extra configuration needed. Just provisioning resources straight from code to Azure.

### Billing
Each application has its own [invoice section](https://learn.microsoft.com/en-us/azure/cost-management-billing/manage/mca-section-invoice) under a Microsoft Customer Agreement, enabling direct cost tracking across all of its environments. This gives app teams a clear, consolidated view of their total spend. Budgets and alerts are configured at two levels:
 - At the invoice section level, to monitor total application cost across all environments.
 - At the individual landing zone level, to track spend per environment (e.g., test, prod).

This layered approach gives teams both the high-level picture and the ability to zoom in. When forecasted costs approach budget thresholds, alerts are sent to the application owner.


### Resource Organization
- **not a landing zone**: platform management subscription is created during the establishing the platform and the subscription is not treated as a landing zone. However, the same management principles applied. This is to support BigBang deployments

- **Single Region**: The platform is limited to single-region deployments to reduce complexity and cost. The target region is centrally managed as an environment variable in GitHub.  

