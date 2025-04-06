---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---

# What is Gazelle?

Gazelle is the name of my Azure based platform for managing landing zones. Instead of a one-size-fits-all model, I’m focused on crafting a tailored solution aligned with specific goals. In this case, it’s a production-like environment designed to explore the nuances of Azure management as code — all while keeping costs close to zero. The platform is shaped by these principles:

## Cost Efficiency

Pay for what you use. If a platform is handling thousands of operations, it should reflect in the cost. But when it’s sitting idle, it should cost nothing. This principle drives the platform's choice of Azure services with a pay-as-you-go model, where you’re billed only for the exact resources you consume. Fixed-price services, like Virtual WAN, are excluded to ensure the cost is tied to real-time usage.

## Self Service

Engineers should be able to spin up and tear down their own landing zones without any bottlenecks. This is achieved by minimizing platform-wise shared services and enabling a smooth self-service experience. The platform is designed so landing zone engineers have full autonomy to create and manage their environments, including adjusting budgets, excluding resources from security baselines, and more — all without relying on others.

## Embrace Change

Change should always be easy to apply, and a quick tweak should never turn into a project. Gazelle embraces change through its modular design, breaking down the platform into small, task-focused components that can be easily modified, updated, or extended. This allows features to be deployed as independent bundles, ensuring that changes in one area don’t disrupt others. Additionally, a dedicated test environment mirrors production, allowing for safe experimentation and ensuring changes in production behave as expected.

All the code is available on GitHub — explore it and feel free to adapt the ideas to fit your own environment.
