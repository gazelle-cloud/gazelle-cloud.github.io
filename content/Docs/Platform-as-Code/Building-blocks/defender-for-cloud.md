---
linkTitle: Defender for Cloud
breadcrumbs: true
weight: 20
cascade:
  type: docs
toc: true
---

## Alerts

Low-severity alerts route straight to the platform engineers’ inbox. That way, there’s always a clear owner for every event, no matter how small.

## N/A Recommendations

Out of the box, Defender for Cloud flags a lot of recommendations that don’t match how Gazelle is built. Instead of drowning in noise, I make those exemptions explicit. They live in code `defenderForCloudExemptions.json`, so they’re visible, reviewable, and versioned like everything else. They’re not “turned off and forgotten” — they’re active design choices, revisited as the platform evolves.

### Audit Custom RBAC Roles
The platform is intentionally built around custom roles. Each role is scoped to a real operational responsibility, giving just enough access without breaking Infrastructure-as-Code. Flagging them as risks misses the point — they are the baseline.

### Paid Defender Plans

Cost discipline is baked into the platform. Fixed-price Defender tiers don’t fit the lean, usage-based model. The security baseline isn’t ignored — it’s enforced through Azure Policy — without locking management subscription into extra cost.