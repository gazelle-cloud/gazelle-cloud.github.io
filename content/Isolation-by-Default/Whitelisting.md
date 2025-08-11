---
linkTitle: Whitelisting
description: "Azure Policy as the Whitelist Engine — the single way to ensure resources meet configuration requirements before they reach the cloud."
breadcrumbs: true
weight: 10
cascade:
  type: docs
toc: false
---

# Azure Policy as the Whitelist Engine

I wanted a platform that stops mistakes before they happen. Not one that quietly lets them through and then sends me hunting for the cleanup script. Whitelisting is how Gazelle enforces that philosophy.

In Gazelle, whitelisting is driven by Azure Policy: only approved resource types can be deployed — everything else is denied until it’s whitelisted. Whitelisting happens at the management group level, so once a new resource type is approved, it’s instantly available to every landing zone under that scope — for example, `platform` or `isolation`.

Requesting a whitelist is straightforward: create a GitHub Issue. The process walks through the same questions Gazelle baseline policies enforce:

- Does it support or require local authentication methods?
- Can public network access be restricted?
- Are diagnostic settings supported?
- Is cross-tenant data replication involved?

Approval isn’t just adding the resource to the allow-list. As part of the process, all guardrails that apply — such as “deny public network access” or “config diagnostic settings” — must be extended to include the new resource type. That way, the resource isn’t just allowed; it’s automatically aligned with the platform’s security and operational baseline from day one.

Once approved and implemented in code, the updated allow-list and guardrails are deployed at the child management group level. At the same time, I create a simple “hello world” Bicep module for the resource type, so any team can start quickly and build on top of it.