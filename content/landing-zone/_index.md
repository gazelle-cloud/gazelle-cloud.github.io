---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
A landing zone is a fresh Azure subscription, provisioned with a Gazelle blueprint. It comes preloaded with everything needed to get started: baseline infrastructure, security policies, cost governance, deployment pipelines, and more. But more importantly—it provides autonomy.

Application teams can fully manage their own landing zones without waiting on central teams. Each team operates independently, owning their subscription lifecycle while adhering to shared guardrails.

Inspired by systems thinking, the platform strikes a balance between central control and local ownership. Core disciplines—identity, networking, security—are centrally applied across all landing zones. These are the standards that maintain consistency and minimize risks.

But autonomy doesn’t mean isolation. Application teams are empowered to override these standards when needed—provided they understand the risks and take responsibility. This model respects the reality of diverse workloads while keeping the core intact.

# Identity
Identity is foundational—and Gazelle treats it that way. Each landing zone is born with a clean, isolated identity model designed to maximize security and reduce operational overhead.

## Landing Zone Identity
Each new landing zone comes with a dedicated managed identity, which holds Owner access at the subscription level. This identity is configured to deploy Azure services from the Getting Started repository using federated credentials. That means no secrets, no certificates—just secure, seamless authentication through Entra ID.

## No Local Auth
Azure Policies are enforced to block all local authentication methods—access keys, connection strings, certificates. Entra ID becomes the single source of truth for access management. This enables fine-grained RBAC for users, groups, and applications, and aligns with zero-trust principles by default.

## Custom Roles for Just Enough Access
Occasionally, a manual task will come up—something small that doesn’t break Infrastructure-as-Code, but still needs a human touch. In these cases, teams can create custom role definitions by extending the Reader role with specific actions. It’s a pragmatic compromise that keeps control without resorting to blanket permissions