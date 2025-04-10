---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
## What is a landing zone?

A landing zone is a centrally managed blueprint applied to an empty Azure subscription, providing engineering teams with a pre-configured environment that includes essential tools and services for cloud development. It delivers ready to use core infrastructure, a security baseline, getting started deployment pipelines, and cost management controls.

Landing zones empower application teams to provision and manage their own environments independently, without relying on a central platform team.

###  Getting Started

- **Register Your Application**: Start by submitting a GitHub issue using the Register New Application issue. This creates a dedicated `invoice section` in Azure to track costs for all landing zones related to the app. Each application has its own `invoice section` for clear separation and reporting.
- **Create landing zones**: Use the New Landing Zone issue template to kick off provisioning. Once complete, you'll receive an email via Azure Alert. Indirect message that the landing zone is fresh out of the oven and ready.
- **Edit landing zone**: To adjust configurations such as budgets or request a policy exemption, edit the landing zone’s parameters file and open a pull request. GitHub Actions will handle the rest.
  
### Identity and Access Management

- **Landing Zone Identity**: Each landing zone has its own identity with Owner permissions at the subscription level. This identity is integrated with your application’s GitHub repository.
- **Locking Down Local Auth**: Azure Policy blocks local authentication (e.g., keys, tokens). All access is managed through Entra ID using Role-Based Access Control (RBAC).
  

### Networking 

- **Configurable Address Space**: The default virtual network address space is /24, supporting 255 IPs. This can be customized when requesting a landing zone.
- **Isolated by Default**: Each landing zone has its own virtual network, with no default connectivity to other landing zones or on-premises networks.
- **No Public Access**: Public network access is disabled via Azure Policy. For local Azure PaaS resources (e.g., storage accounts), firewalls must be configured to restrict network traffic.
- **Encrypted Traffic Only**: HTTP is disallowed. All traffic must use HTTPS, enforced by Azure Policy.

### Cost Management

- **Subscription-Level Billing**:Usage charges are linked directly to the associated application `invoice section`, enabling environment specific tracking (e.g., dev, test, prod).
- **Anomaly Alerts**: Cost anomaly alerts are configured to notify engineers when unexpected usage is detected.
- **Budget Threshold**: Azure Budget alerts notify teams when spending approaches predefined limits.

### Resource Organization
- **Single Region Deployments**: Deployment pipelines automatically fetch the default region, abstracting away regional overhead from engineers.
- **One App - One Environment - One Landing Zone**: Each landing zone is intended to host a single application and environment, ensuring clear separation.
- **Central Resource Group**: A resource group named `landing-zone-resources` is created for centrally managed services and is protected by a `Deployment Stack` to enforce consistent configuration.

### Security

- **Defender for Cloud (Free Tier)**: Microsoft Defender for Cloud is enabled to monitor the security posture. Non-relevant recommendations are filtered out to reduce noise and ensure teams focus on actionable insights.
- **Alerts**: Security alerts are configured to notify application teams directly so they can take action.
  
### Azure Policy

- **Policy Exemption**: If a use cases require exemption from the security baseline, exemptions can be created.
- **Deny by default**: Azure Policy apply a `Deny` effect for non-compliant resources. Meaning that resources will not be provisioned to Azure.
- **Config**: Azure Policy automatically apply configuration details—such as required tags or diagnostics settings to resources to ensure operational consistency.
- **Allowed Resources**: Only approved Azure resources are permitted, following a whitelisting approach to align with security and operational guidelines.