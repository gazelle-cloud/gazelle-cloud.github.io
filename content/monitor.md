---
title: "Azure Landing Zones - monitoring resource configuration"
linkTitle: Monitor
description: "Azure landing zones: exploring monitoring"
weight: 50
breadcrumbs: false
cascade:
  type: docs
toc: true
---
# Monitor

## Central Control with Local Ownership

Each landing zone comes with its dedicated Log Analytics workspace, used to collect diagnostic settings. The rules for which diagnostic settings must be collected are configured by the platform team as a custom Azure Policy Definition at the top-level management group, but the data and cost associated with it are owned by the application team. This approach ensures that platform-required logs are captured from day one and that cost responsibility remains with the application team.

## Service Health Alerts

Azure Service Health alerts keep landing zone engineers informed about service issues, planned maintenance, and health advisories. These alerts are personalized per subscription and are automatically created as part of the “Create Landing Zone” GitHub workflow. They are deployed to the `landing-zone-resources` resource group.
