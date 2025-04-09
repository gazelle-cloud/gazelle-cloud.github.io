---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
A landing zone is a fresh Azure subscription, provisioned with a Gazelle blueprint. The blueprint is centrally managed and applied to application landing zones to provide initial infrastructure, security baseline configuration, cost control, getting started deployment pipelines and autonomy to manage your application landing zones. Each application team operates independently, owning their subscription lifecycle. Teams has authority to override centrally applied guardrails when needed. provided they understand the risk and take responsibility. This model respects the reality of diverse workloads while keeping the core intact.


## Identity

Identity is foundational—and Gazelle treats it that way. Each landing zone is born with a clean, isolated identity model designed to maximize security and reduce operational overhead.

- **Landing Zone Identity**: Each new landing zone comes with a dedicated managed identity, which holds Owner access at the subscription level. This identity is configured to deploy Azure services from the Getting Started repository using federated credentials. That means no secrets, no certificates—just secure, seamless authentication through Entra ID.

- **No Local Auth**: Azure Policies are enforced to block all local authentication methods—access keys, connection strings, certificates. Entra ID becomes the single source of truth for access management. This enables fine-grained RBAC for users, groups, and applications, and aligns with zero-trust principles by default.

- **Custom Roles for Just Enough Access**: Occasionally, a manual task will come up—something small that doesn’t break Infrastructure-as-Code, but still needs a human touch. In these cases, teams can create custom role definitions by extending the Reader role with specific actions. It’s a pragmatic compromise that keeps control without resorting to blanket permissions

## Network

blah blahc blach

- **isolated by default**: each landing zone comes with a virtual network that is isolated by default. 
- **public network access is not allowed**: direct public network access is disabled by Azure policy. To access resources in Azure, use PaaS resource local firewall to restricted public network access.
- **secure traffic**: azure policies configures to disable unsecure network communications, like unencrypted http traffic or legacy TLS configuration. 
- **/24** the default address space for a landing zone virtual network is /24, meaning that you have 255 unique IP address allocated to your landing zone. If it's not enough, the value can be edited during the create landing zone process

## Cost

- **lz**: cost assosiated per landing zone
- **alerts**: alerts configured to notify application engineers when the costs approach the budget limits.
- **anomaly alerts** cost anomaly alerts configured to notify landing zone engineers


## Security

- **Azure Policy**: policies are enforced using a `Deny` policy effect. Meaning, that the policy mechanism will deny deployment, if something is not configured to meet a security baseline. The error message provides a full details, so engineers can take an actions. Policies are grouped by the security requirement, like 'disable local authentication' or 'disable direct network access'. Application engineers can request a policy exemption, in case application requires extra flexibility.
- **Defender for Cloud**: a free version of defender for cloud is used by default with preconfigured alerts to notify application engineers in case of security alert. Non-applicable security recommendation in this tenant are centrally supressed from defender for cloud recommendations, to reduce the noise and focus on a real misconfiguration

## Monitoring

- **booh**: diagnostic settings is enforced via Azure Policy to storage diagnostics data to a landing zone central Log Analytics workspace. Data is stored for 90 days.  This enables for engineers to have all the access to necessary data for troubleshooting. The diagnostic costs is associated directly with a landing zone. 

## Resource Organization

- **landing zone resources**: a resource group `landing zone resources` is created for centrally managed landing zones resources
- **one application - one environment - one landingzone**

## Self Service

- **GitHub**: GitHub is tightly integrated to Gazelle tenant management and 'self-service' capability is one of the integrated service. It provides a friendly user experience and tools to automated deployments.   
- **create landing zone**: create a new landing zone by following a issue template. Provide a basic parameters, and that is it. After few minutes you will get a landing zone ready develop your solution in a fresh baked landing zone. You will receive en email from a newly created alerts. The email indirectly notifies that the landing zone is ready to develop your own product. 

- **Edit**: There is an assosiated parameter file that contains landing zone parameters, like budget configuration or policy exemption. Edit values to your application needs, create a Pull Request and the job is done, GitHub Actions applies new values. It is not possible to edit virtual network address space range, and application name.  