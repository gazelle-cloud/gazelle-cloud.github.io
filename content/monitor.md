---
linkTitle: Monitor
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 50
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# Monitor

## Central Control with Local Ownership

Each landing zone comes with its dedicated Log Analytics workspcae, used to collect diagnostic settings. The rules, what diagnostic settings must be collected is configured by the platform team as a custom Azure Policy Definition at the top level management group, but the data and cost assocaited with it owned by the application team. This approach ensures that platform-required logs are captured from day one, while maintaining clear accountability.

## Service Health Alerts

Azure Service Health alerts keep landing zone engineers informed about service issues, planned maintenance and health health advisories. These alerts are personalized per subscription and are automatically created as part of the “Create Landing Zone” GitHub workflow. They are deployed to the `landing-zone-resource` resource group.