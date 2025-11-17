---
linkTitle: Network
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 30
breadcrumbs: false
cascade:
  type: docs
toc: true
---


## Fully Isolated

Gazelle adopts a fully isolated networking model by default. Each landing zone is deployed with its own Azure Virtual Network (VNet), with no connectivity to other landing zones or on-premises environments. This design enforces complete network isolation by default and reduces cost and operational overhead for the platform team.

## Full Autonomy

Application teams have full autonomy to extend and configure their virtual networks to meet workload-specific needs — from basic operations such as creating subnets and configuring Network Security Groups, to advanced setups such as deploying Azure Firewall, Application Gateway, or establishing VNet peerings.

However, because each VNet is centrally provisioned by the platform, certain destructive operations — such as deleting a virtual network — are protected by Azure Deployment Stacks, preventing unintended or accidental changes.

## Deny Public vNet

Direct or unrestricted public network access is not permitted within this architecture and is automatically denied by Azure Policy for all approved Azure resource providers. For communication between VNets and Azure PaaS services, teams must use PaaS-native firewall rules to restrict access appropriately.

If public network access is required for legitimate business or application purposes, teams can request a policy exemption through the self-service flow.

## IPAM

To maintain flexibility for future connectivity, each virtual network is assigned a unique, non-overlapping address space (default /24). This approach ensures that VNet peerings can be established later without IP conflicts, supporting Azure-native communication between landing zones when required.

Address space allocation is fully automated using the bom bam boom PowerShell script, which dynamically determines the next available address block. During new landing zone creation, the script queries Azure Resource Graph in real time to identify and assign the next free CIDR range. Address space saved in applications github repo as environment variable. 