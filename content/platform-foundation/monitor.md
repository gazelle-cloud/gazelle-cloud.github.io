---
linkTitle: Monitor
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 50
toc: true
---
# Monitor

## Central Control with Local Ownership

Diagnostic data collection in the Gazelle tenant follows a simple principle: rules are managed centrally, but data and cost remain local.

A custom Azure Policy definition named diagnostic-settings is deployed at the management group level. It defines which diagnostic settings must be enabled for each whitelisted resource type. Because the policy operates at this level, any update to the rule set propagates immediately across all landing zones, ensuring consistency and minimal operational overhead.

Each landing zone includes its own dedicated Log Analytics workspace for that subscription. The Azure Policy assignments that apply the diagnostic settings are created automatically as part of the “Create Landing Zone” GitHub workflow, guaranteeing that all platform-required logs are captured from day one.

Meanwhile, the workspace, data, and associated costs are fully owned by the application team, maintaining clear accountability and cost transparency

Technical details:
- The Policy Set Definition ID is stored as a GitHub variable named `POLICY_CONFIG_DIAGNOSTICSETTINGS_RESOURCE_ID`. As a result, policy assignments at the landing zone level are decoupled from hardcoded resource IDs, improving flexibility and maintainability.


## Service Health Alerts

Azure Service Health alerts keep teams informed about issues and advisories across four key areas:
- Service issues
- Planned maintenance
- Security advisories
- Health advisories

These alerts are personalized per subscription and are automatically created as part of the “Create Landing Zone” GitHub workflow. They are deployed to the `landing-zone-resource` resource group and configured so that application engineers receive notifications relevant to their environments.