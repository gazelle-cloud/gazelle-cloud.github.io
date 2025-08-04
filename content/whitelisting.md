---
title: Why Whitelisting Matters
linkTitle: Whitelisting
breadcrumbs: false
weight: 50
cascade:
  type: docs  
toc: true
---
Gazelle enforces a **whitelisting model** to control which Azure resources can be deployed across the platform. This model is central to how the platform maintains secure, consistent, and predictable environments—without requiring deep platform knowledge from application teams.

By default, all non-approved services are blocked. Teams can only deploy resources that have been explicitly vetted and whitelisted by the platform.

---

## What Whitelisting Enables

### 1. Secure by Default
- Only services that meet Gazelle’s security baseline—like disabling local auth and enforcing private access—are allowed.
- Azure Policy uses `Deny` effects to block non-compliant resources at deployment time, eliminating misconfigurations before they go live.

### 2. Operational Predictability
- Every approved resource is known to work within the platform’s boundaries—including diagnostic logging, RBAC integration, and lifecycle automation.
- This avoids surprises from unsupported service behaviors or limitations.

### 3. Fast Startup for Teams
- Each landing zone includes prebuilt Bicep modules and deployment workflows for all whitelisted services.
- Teams don’t need to assemble their own infrastructure or figure out configuration details—they can start from proven patterns.

### 4. Policy-Driven Governance
- Policies are grouped by scope (e.g., identity, network, observability), and only configured for known-good resources.
- This reduces the need for reactive fixes and makes it easy to automate compliance across environments.

### 5. Lean, Focused Platform
- By not supporting everything Azure offers, Gazelle minimizes surface area, complexity, and cost.
- Resource choices are intentional—backed by policy, automation, and real-world support.

---

## Operational Reality

Whitelisting is enforced at the management group level using the `allowedResources` policy definition. Application teams work within these bounds by default. When a new service is needed, engineers follow a structured review and deployment process to evaluate and approve it—ensuring that each addition aligns with platform standards and doesn’t introduce risk.

This isn’t a theoretical control. It’s exercised every day:

- Deny policies block insecure resources from being deployed.
- Teams validate new resources in test environments before production.
- Platform logs and alerts monitor all usage through Log Analytics.

---

## Trade-Offs and Flexibility

Whitelisting does add friction for teams exploring new Azure services—but that friction is by design. It’s how the platform ensures that all deployed services are observable, secure, and supportable at scale.

When flexibility is needed, teams can request exemptions or propose additions through GitHub. The workflow ensures traceability and review, while preserving platform integrity.

---

**In short:** Whitelisting is what keeps Gazelle safe, scalable, and supportable. It reduces risk, accelerates onboarding, and aligns infrastructure with operational expectations—without compromising autonomy.
