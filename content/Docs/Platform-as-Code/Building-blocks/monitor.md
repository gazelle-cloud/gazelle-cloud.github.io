---
linkTitle: Monitor
breadcrumbs: true
weight: 40
cascade:
  type: docs
toc: true
---

## Log Analytics

The platform management subscription comes with its own Log Analytics workspace. That workspace collects the diagnostic signals that matter for keeping the platform itself healthy — activity logs, automation traces. It gives me a single, consistent view of what’s happening at the platform layer, while each landing zone still keeps its own workspace for application data. That separation is intentional: the platform watches itself, the teams watch their apps.

## Advisory Alerts

The platform wires in Azure Advisor alerts. These are less about immediate failures and more about early warnings — service health advisories, planned maintenance, incidents that might ripple into the platform. I scope them only to the platform management subscription, so I’m not drowning in noise from workloads. They exist to keep me one step ahead, not to overwhelm me.

## Action Groups

Monitoring only works if someone actually hears the signal. That’s where Action Groups come in. Every alert in the platform ties into the same group, which acts as the bridge between Azure and the engineers who run it. When something goes wrong, the alert doesn’t vanish into a dashboard — it lands straight in the inboxes of the people responsible. A clean, predictable line from Azure to engineer.
