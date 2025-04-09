---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
# Landing Zone in the Gazelle Tenant

Welcome to the landing zone—your personal, self-service Azure subscription tailored for your applications. In the Gazelle tenant, we believe in a simple, transparent approach. Here’s how our landing zones operate, explained in a friendly yet professional way.

---

## What’s a Landing Zone?

A landing zone in our tenant isn’t just a plain Azure subscription—it’s a ready-to-go environment built with a centrally managed blueprint. This blueprint ensures that every landing zone comes with the tools you need right from the start:

- **Essential Infrastructure**: Preconfigured resources make it easy to deploy your application quickly.
- **Security Baselines**: Built-in policies protect your environment from day one.
- **Cost Controls**: Keep spending in check with real-time alerts and budget configurations.
- **Deployment Pipelines**: Get started with prearranged pipelines that connect with GitHub for a smooth deployment process.

---

## How It Works

###  Getting Started

- **Request**: 
- **Billing**: application
- **Repo**:
- **Self-Service**: Application teams can spin up or tear down their landing zones without delays. A simple issue template and basic parameters are all it takes to get your zone running.
- **Autonomy**:

### Identity and Access Management

- **Clean by Design**: Every landing zone starts with its own managed identity. This identity has Owner access at the subscription level and uses federated credentials via Entra ID—no secrets or certificates needed.
- **Locking Down Local Auth**: All local authentication methods are blocked by Azure Policies. This means your access is safe and managed solely through Entra ID, keeping everything tight and secure.
- **Custom Roles When Needed**: If a specific task calls for a human touch, you can create custom roles that extend the built-in Reader role to grant just enough permissions. It’s secure and pragmatic.

### Networking 

- **/24**: the default /24 address space for up to 255 IPs. Address space can be adjusted during landing zone request form. 
- **Isolated by Default**: Each landing zone includes its own Azure Virtual Network. There is no network connection between other landing zones nor connectivity to on-premises networks. Landing zones are fully isolates by default.
- **No Public Access**: Public network access is disabled by Azure policy. Use Azure resources local firewall to restrict network access. Policy exemption can be created by editing landing zone parameters file.  
- **Secure Traffic Only**: All the network traffic should be encrypted, HTTP traffic configuration is not allowed by Azure policy. You work only with secure network communications.

### Cost 

- **Cost anomaly**: anomaly alerts configured to help you spot unusual cost patterns immediately.
- **Budget alerts**: azure budget alerts configured to notify application engineers when the consumption reaches 100%. 
- **subscription level**: cost alerts and budgets are configured at the subscription level scope to keep the track of the cost per application per environment. 

### Resource Organization
- **Single region deployments**: this abstraction layer eliminates to think about deployment region, Deployment pipelines configured to fetch the default region for you.  
- **One App - One Environment - One Landing Zone**: To keep applications and their environments isolated from network, identity, deployment and operational perspectives a landing zone can host a single application and one environment only.
- **Landing Zone Resources** a resource group called `Landing-zone-resources` is created for centrally managed resources. Resources are protected by `Deployment Stack` from unwanted changes. 

### Security

- **Defender for Cloud**: A free version of Defender for Cloud is used by default to monitor security health. Non-applicable recommendations are filtered out to reduce noise, so you can focus on what matters.
- **Alerts**: security alerts configured to send to application engineers to take an action. 

### Azure Policy

- **Exemption**: If your application needs an extra flexibility, you can request a policy exemption. Just be sure you understand the risks and take responsibility for the change.
- **Deny**: Every landing zone enforces Azure Policies using a `Deny` effect. This means if a configuration doesn’t meet security standards, the deployment won’t go through.
- **COnfig**: for landing zone function correctly, Azure Policy applies additional properties to Azure resources, like tags or diagnostic configuration. 
- **Allowed Resources**: following a whitelisting approach to ensure that all configuration meet security and operational baseline. 
---

In the Gazelle tenant, a landing zone is your streamlined, secure, and cost-effective Azure subscription. It’s designed to give you the autonomy to innovate while keeping foundational aspects—like identity, networking, and security—robustly managed in the background. Whether you’re just getting started or scaling your operations, our landing zones are built to grow with you, offering a clear, logical, and efficient path to success.