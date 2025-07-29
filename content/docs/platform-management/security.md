---
title: Security
breadcrumbs: true
weight: 60
toc: true
sidebar:
  open: true
---

## Alerts

Platform security alerts with a low severity are routed to platform engineer email, to take ownership of the event. 

## Noise Reduction

Defender for Cloud flags recommendations that don’t align with how the Gazelle platform is designed. To reduce noise and focus attention on meaningful signals, some recommendations are intentionally excluded:

- **Audit Custom RBAC Roles**: The platform is intentionally built around custom roles. These roles are tightly scoped to match specific operational responsibilities and provide just enough access—without breaking Infrastructure-as-Code principles.

- **Enable Defender for Cloud Paid Plans**: While security is a priority, the platform is built for cost-efficiency. Fixed-price Defender plans don’t align with Gazelle’s lean, usage-based model.

These exemptions are managed in the `defenderForCloudExemptions.json` file and reviewed periodically to ensure they reflect intentional design decisions—not blind suppression.