---
linkTitle: Network
description: "Azure Landing Zones: Azure Policy — end-to-end flow, from policy identity to exemption"
weight: 30
breadcrumbs: false
cascade:
  type: docs
toc: true
---
## Isolated by Default

Platform adopts an isolated networking model by default. Each landing zone is deployed with its own Azure Virtual Network, with no connectivity to other landing zones or on-premises environments. This design enforces complete network isolation by default and reduces cost and operational overhead for the platform team.

## Autonomy

Application teams have full autonomy to extend and configure their virtual networks to meet workload-specific needs — from basic operations such as creating subnets and configuring Network Security Groups, to advanced setups such as deploying Azure Firewall or Application Gateway.

However, because each VNet is centrally provisioned by the platform, certain operations — such as deleting a virtual network — are protected by Azure Deployment Stacks, preventing unintended or accidental changes.

## Deny Public vNet

Direct or unrestricted public network access is not permitted within this design and is automatically denied by Azure Policy for all whitelisted Azure resources. For communication between VNets and Azure PaaS services, teams must use PaaS-native firewall rules to restrict access appropriately.

If public network access is required for legitimate purposes, a policy exemption can be created through the self-service flow.

## IPAM

To maintain flexibility for future connectivity, each virtual network is assigned a unique, non-overlapping address space (default `/24`). This approach ensures that VNet peerings can be established later without IP conflicts, supporting Azure-native communication between landing zones when required.

Address space allocation is automated using the `ipmgmt` PowerShell script, which dynamically determines the next available address block. During new landing zone creation, the script queries Azure Resource Graph in real time to identify and assign the next free CIDR range. The assigned address space is stored in the application's GitHub repository as an environment variable.
