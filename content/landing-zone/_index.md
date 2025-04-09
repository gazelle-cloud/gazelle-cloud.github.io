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

### 1. **Getting Started Fast**

- **Self-Service on Demand**: Application teams can spin up or tear down their landing zones without delays. A simple issue template and basic parameters are all it takes to get your zone running.
- **Autonomous Yet Governed**: While you have full control over your landing zone, the centrally applied blueprint makes sure the critical parts remain in line with best practices.

### 2. **Identity and Access Management**

- **Clean by Design**: Every landing zone starts with its own managed identity. This identity has Owner access at the subscription level and uses federated credentials via Entra ID—no secrets or certificates needed.
- **Locking Down Local Auth**: All local authentication methods are blocked by Azure Policies. This means your access is safe and managed solely through Entra ID, keeping everything tight and secure.
- **Custom Roles When Needed**: If a specific task calls for a human touch, you can create custom roles that extend the built-in Reader role to grant just enough permissions. It’s secure and pragmatic.

### 3. **Networking Made Simple**

- **Isolated Networks by Default**: Each landing zone includes its own virtual network, typically configured with a /24 address space for up to 255 IPs. This ensures your environment is isolated from others.
- **Controlled Exposure**: Public network access is disabled by policy. When you need to reach external resources, our local firewall rules ensure that any access is carefully managed.
- **Secure Traffic Only**: Azure policies automatically block unencrypted traffic and outdated protocols, so you only work with secure, modern network communications.

### 4. **Cost and Resource Management**

- **Only Pay for What You Use**: Our model leverages Azure’s pay-as-you-go services—costs reflect actual resource use, not fixed prices.
- **Real-Time Alerts**: Customized alerts notify you when spending approaches your predefined limits, and anomaly alerts help you spot unusual cost patterns immediately.
- **Organized and Accountable**: Resources within your landing zone are neatly grouped (e.g., using a dedicated resource group for landing zone resources), ensuring clarity and ease of management.

### 5. **Robust Security in Every Step**

- **Built-In Security Policies**: Every landing zone enforces strict Azure Policies using a `Deny` effect. This means if a configuration doesn’t meet security standards, the deployment won’t go through.
- **Cloud Defender at the Ready**: A free version of Defender for Cloud is used by default to monitor security health. Non-critical recommendations are filtered out to reduce noise—so you can focus on what matters.
- **Flexibility with Oversight**: If your application needs a little extra flexibility, you can request a policy exemption. Just be sure you understand the risks and take responsibility for the change.

---

## In a Nutshell

In the Gazelle tenant, a landing zone is your streamlined, secure, and cost-effective Azure subscription. It’s designed to give you the autonomy to innovate while keeping foundational aspects—like identity, networking, and security—robustly managed in the background. Whether you’re just getting started or scaling your operations, our landing zones are built to grow with you, offering a clear, logical, and efficient path to success.

Ready to get started? Your new landing zone is just a few clicks away.
