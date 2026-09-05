---
layout: ../layouts/TextPage.astro
title: Azure platform
description: Four foundations the platform is built to, and why the platform layer owns no Azure subscription at all.
toc: true
---

## Foundations

The goal is to build a lighweight platform

**No fixed cost**  

>Every platform component is free; if it can't be, it must be consumption-based — never a flat cost.  

**No platform ops**  

>The platform grows more self-sufficient, landing zones take on more ownership, and the platform team becomes less and less necessary.  

**No unapproved resources**  

>The allowed list starts empty. A resource type joins the platform only after its security controls, telemetry, and integration patterns are in place — once it is, app teams can use it freely within the boundaries Azure Policy guarantees.  

**No human touch**  

>BigBang initializes the platform. After that, code is the only path to production — proof it can always be rebuilt from scratch.  

## Test environment

Platform contains a test environment identical to production. It is where experiments, learning and new functionality are validated against the live Azure setup. It also proves that the platform can be rebuilt from scratch, as the environment is destroyed every night and recreated from nothing.

## Subscription Bank

## Subscription-free platform

Gazelle's platform layer owns no Azure subscription. There is no so-called
"management" subscription. Every platform capability is delivered one of two ways:
assigned at the management group, or built directly into each landing zone.

### Cost-free platform

A management subscription, even a cheap one, is still a recurring cost sitting on
the platform layer itself. That directly violates the zero-platform-cost design
goal: once you introduce any billed management subscription, you have created a
cost center that exists independent of actual workloads. It stops being "the
platform is free, only your workloads cost money" and becomes "the platform has a
base fee, plus your workloads."

### You build it, you run it

A management subscription implies something is being managed on your behalf, which
means a team or a service behind it. That reintroduces the classic
central-platform-team dependency that gazelle are explicitly
trying to escape. The moment there is a subscription "for management," someone has
to own it, and that someone becomes a bottleneck or a support queue instead of the
workload team owning their own end-to-end applications.

### Redundant management layer

If you are building on Azure PaaS — Container Apps, Key Vault, managed databases —
Microsoft is already managing the underlying compute, patching, scaling, and
availability. Stand up a separate management subscription and the platform team ends
up managing already-managed things.

## Oases - isolated landing zones

Each landing zone comes with its own infrastrucutre needed to build in Azure. 
