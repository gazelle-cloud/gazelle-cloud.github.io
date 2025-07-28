---
title: Hextra Theme
layout: hextra-home
---

##  Platform Design Principles

- **Lightweight Platform**: This platform keeps shared services to a minimum to avoid overhead and unnecessary friction. Instead of using centrally managed components, each landing zone includes the core services it needs—so teams can configure things based on what works best for them. This design trades cost for speed and autonomy.
- **Self Service**: Teams shouldn’t have to wait on others to get things done. This platform lets app teams spin up and manage their own landing zones through GitHub Issues. They can tweak budgets, exclude certain resources from security baselines, and handle other environment-specific needs—all without relying on a centralized team.
- **Cost Efficiency**: You only pay for what you use. When the platform is running full speed, the cost scales with usage. When it’s idle, it should cost nothing. Services with flat fees—such as Virtual WAN—are intentionally avoided, as they incur cost even when idle. Instead, the platform uses Azure’s consumption-based services, which scale with usage and help maintain predictable, efficient costs.