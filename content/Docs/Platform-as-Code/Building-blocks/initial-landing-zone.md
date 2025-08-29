---
linkTitle: Initial Landing Zone
breadcrumbs: true
weight: 50
cascade:
  type: docs
toc: true
---

## Egg-Chicken Challenge

I hit a chicken-and-egg problem: I can’t build the platform without a subscription, and I can’t build a landing zone without the platform. The fix is the initial landing zone — a bootstrap subscription. It isn’t a full landing zone, and it doesn’t try to be. It lays down the minimum configuration so the platform can stand on its own from day zero.

## Bring Your Own Subscription

At setup, I bring two empty Azure subscriptions — one for test, one for prod. They drop under the platform management group and are renamed management-test and management-prod. 

Each subscription hosts the foundational Azure services that let the platform run: the policy identity. Because of that, the management subscription itself is governed by the same Azure Policies as every other landing zone — no special treatment.

The way it’s provisioned is different, though. Instead of being created like a typical landing zone, it’s delivered as a building block. The Bicep modules are the same, but the orchestration follows the platform flow, not the self-service flow. That distinction keeps the bootstrap lean and reproducible while still applying the same guardrails as every other zone.


## Initial Landing zone

Once those subscriptions exist, the initial landing applies the rest:

- Log Analytics workspace
- Managed identity
- Alerts and action groups
- Defender for Cloud configuration

It behaves like a landing zone in what it delivers, but it runs like any other building block in the platform. That way, the very first subscriptions never drift, and the platform starts governed from day one.