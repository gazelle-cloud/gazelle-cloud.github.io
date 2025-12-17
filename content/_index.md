---
title: "Lightweight Azure Landing Zones platform tailored for self-service and team autonomy"
linkTitle: Azure Landing Zones
description: "Azure Landing Zones: a guide to implementing Landing Zones as self-service, promoting team autonomy and using GitHub as a management plane."
breadcrumbs: false
weight: 1
cascade:
  type: docs
toc: true
---

Gazelle is a lightweight Azure landing zone platform designed to maximize team autonomy and minimize platform overhead. It achieves this by keeping shared services to an absolute minimum, avoiding central bottlenecks and operational friction. Each landing zone is self-contained — including networking, monitoring, and identity — enabling teams to move at their own pace while maintaining consistent operational and security baselines.

Built on the principles of the Microsoft Cloud Adoption Framework, Gazelle turns theory into practice. While CAF offers hundreds of design considerations, Gazelle provides a clear, opinionated implementation — a working example of how to build a secure, consistent, and cost-efficient Azure platform managed entirely as code.

## Free to Run

Gazelle runs entirely on free Azure services, avoiding components with fixed fees such as Virtual WAN. The platform itself has near-zero cost — all spending occurs within application workloads. While total Azure usage may increase, this trade-off favors speed, flexibility, and team ownership over centralized optimization.

## Team Autonomy

Each landing zone is isolated and self-contained, including all Azure resources and cost management. This independence removes cross-team dependencies and lets application teams fine-tune their infrastructure directly through self-service.

## Self-Service

Landing zone lifecycle operations — creation, budget updates, policy exemptions — are managed by application teams through GitHub in a self-service model. All changes flow through pull requests, providing transparency and control. With that flexibility comes responsibility: teams own their changes, costs, and risks.

## Everything-as-Code

The platform is fully automated — no manual steps. All resources are defined and deployed as code using modular, purpose-built Bicep modules for each platform capability. The entire environment can be destroyed and rebuilt at any time. To validate this, the Gazelle test environment is automatically redeployed from scratch every Sunday night.

## Why Gazelle

Gazelle is not a replacement for the Microsoft Cloud Adoption Framework — it’s a practical companion. Instead of theoretical checklists, it offers concrete, working answers to CAF’s design areas: identity, network, security, billing, resource organization, governance and deployment automation. The goal is to provide a free foundation to manage Azure Landing Zones as a Self Service. All the code is freely available on the GitHub repository.   
