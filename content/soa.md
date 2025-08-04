---
linkTitle: SOA in Gazelle  
title: Service-Oriented Principles in Gazelle’s Modular Platform Architecture  
breadcrumbs: false  
weight: 20  
cascade:  
  type: docs  
toc: true  
---

## SOA Principles: Separation of Concerns and Loose Coupling

Service-Oriented Architecture (SOA) breaks down monolithic systems into smaller, self-contained services. Each service encapsulates a single business function, exposing only a well-defined interface. This separation of concerns ensures that:

- **Autonomy**: Services evolve on their own lifecycle—developed, deployed, and scaled independently.  
- **Loose coupling**: Interactions occur through formal contracts (APIs or message schemas), not direct links.  
- **Composability**: New services can be introduced or swapped without disrupting existing ones.  

These principles yield architectures that are easier to maintain, extend, and reason about.

## Gazelle’s Building Blocks as Independent Services

Gazelle mirrors classic SOA design through its **building block** model. Each block is a self-contained unit responsible for one platform concern:

| Building Block     | Responsibility                                                                             |
|--------------------|--------------------------------------------------------------------------------------------|
| **Tenant Level**   | Management group hierarchy and billing setup                                               |
| **Monitor**        | Log Analytics, alerts, and action groups for observability                                 |
| **Access Control** | Custom role definitions and RBAC assignments at management group level                     |
| **Automation**     | Scheduled operational jobs (cleanup, remediation) via Azure Container App Jobs             |
| **Policy**         | Custom Azure Policy definitions and assignments for security and operational guardrails   |

Every building block:

- Lives in its own GitHub repository directory with focused Bicep modules  
- Ships through an independent GitHub Actions pipeline—handling provisioning, updates, and teardown in isolation  
- Maintains its own state and lifecycle, reducing cross-module dependencies  

This modularity ensures that the **Access Control** pipeline can update IAM roles without touching the **Monitor** or **Automation** pipelines, and vice versa.

## Contract-Based Interaction via Outputs

Instead of sharing hidden state, Gazelle’s modules communicate strictly through **explicit outputs**:

- After deploying resources (e.g., a Log Analytics workspace), the **Monitor** block writes the workspace’s resource ID to a GitHub Repository Variable  
- Downstream blocks (such as **Policy** or **Automation**) consume those variables as inputs, treating them as immutable contracts  

By adhering to this pattern, Gazelle enforces loose coupling:

- **Encapsulation**: Internal implementation details stay private to each block  
- **Stability**: As long as outputs remain consistent, modules can change internally without breaking consumers  
- **Clarity**: Interfaces between modules are documented through output names and schemas  

## Benefits of a Modular, SOA-Inspired Approach

1. **Isolated Testing & Validation**  
   Each block can be deployed in a test environment independently. Engineers validate changes without risking other platform components.

2. **Reduced Blast Radius**  
   Independent lifecycles mean a faulty update in one block won’t cascade. A bug in **Automation** won’t prevent **Access Control** from functioning.

3. **Faster Iteration**  
   Teams iterate on single concerns at their own pace. Adding a new remediation job in **Automation** doesn’t require redeploying the entire platform.

4. **Clear Ownership**  
   Well-defined responsibilities per block improve maintainability and governance. Engineers know exactly where to look for policy changes, role assignments, or monitoring configurations.

## Conclusion

Gazelle’s architecture embraces SOA fundamentals—separation of concerns, loose coupling, and contract-based interactions—to deliver a modular, scalable Azure landing-zone platform. By treating each building block as an autonomous service, Gazelle achieves:

- **Reproducibility**: Full “Big Bang” rebuilds succeed every time.  
- **Autonomy**: Application teams self-service within guardrails.  
- **Resilience**: Changes and failures are contained within individual modules.  

This SOA-inspired design not only aligns with platform engineering best practices but also fosters a culture of ownership and agility, enabling teams to move fast while maintaining a reliable, code-defined foundation.
