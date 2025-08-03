---
title: Landing zone
breadcrumbs: true
toc: true
weight: 40
sidebar:
  open: true
---

A landing zone is a blueprint applied to an empty Azure subscription, setting up the core services and configurations needed to build in the cloud.

In Gazelle, landing zones are isolated, secure, and cost-transparent. Each is deployed into its own Azure subscription, locked down by policy, and provisioned through standardized GitHub pipelines. Teams manage their own budgets, request policy exceptions, and spin up environments as needed. Every application includes a GitHub repo with ready-to-use Bicep modules and deployment workflows aligned to platform standards.

## Cost Ownership

- **Cost per App**: All landing zones for an application share the same invoice section. Teams see dev, test, and prod costs in one place.
- **Ownership**: Budget alerts are routed directly to application owner as usage approaches defined limits.

## Constraints

- **Single Region**: Azure resources are deployed in a single Azure region. This simplifies networking, reduce potential cost surprises, and operational complexity of managing multi-region workloads. The region is centrally managed via GitHub variables.
- **Whitelisted services**: Only approved Azure services can be deployed. Policies block non-whitelisted resources to ensure security and operational consistency.
- **Deny Until Secure**: Security baselines enforced using Azure Policy with a `Deny` effect. Resources that don't meet platform standards—such as allowing public network access or using local authentication—are blocked at deployment time. This deny-first approach gives teams immediate feedback and ensures insecure configuration never make it to public cloud.
- **Subscription Isolation**: Each landing zone is lives in its own Azure subscription. It hosts a single application and environment—nothing shared, nothing reused. This setup keeps environments fully separated, ensuring that one environment misconfiguration cannot affect others.
- **Network Isolation**: Landing zones have no network connectivity to other landing zones or on-premises systems. If communication between zones is needed, it can be enabled using virtual network peering. 

## Autonomy

- **Self-Service**: Teams request new landing zones via GitHub Issues. Provisioning and configuration run automatically through GitHub Actions.

- **Responsibility**: Teams manage their own budgets, request policy exemptions, and handle configuration updates—without relying on a centralized platform team. This keeps governance in place while giving teams the control they need to move quickly. With that flexibility comes ownership: the responsibility to maintain what they build and to understand the impact of their choices.

- **No Shared Services**: Landing zones are self-contained and have no dependencies on shared platform components. Each environment is provisioned with everything it needs to operate independently—ensuring strong isolation, clear ownership, and minimal coupling across teams.


## Starter Repo

- **Bicep Modules**: Includes minimal, ready-to-use Bicep modules for all whitelisted Azure resources—so teams can start quickly without starting from scratch.
- **GitHub Actions**: Deployment pipelines follow the same structure, standards, and automation principles as the core platform—modular, reproducible, and managed entirely as code. 
