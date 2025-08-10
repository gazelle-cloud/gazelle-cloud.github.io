---
linkTitle: Whitelisting
breadcrumbs: true
weight: 2
cascade:
  type: docs
toc: true
---

I wanted a platform that prevents mistakes instead of cleaning them up. That’s why Gazelle runs on a whitelisting: everything is denied by default, and only explicitly approved resource types are permitted in the tenant.

This flips the operating model. Instead of chasing misconfigurations across landing zones, I encode intent once — and let policy do the enforcement everywhere. If you try to deploy something that isn’t on the allow-list, the deployment fails fast with a clear message. That’s not an error; it’s the design.

Let me break down how this feels for app teams — and why it scales.




