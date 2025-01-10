---
title: Network
breadcrumbs: false
toc: true
weight: 70
---

Each landing zone has a fully isolated virtual network, with no cross-connectivity to other cloud application by default. Public network access is blocked using Azure Policy, while resource-specific local firewalls are used to enable access where needed. When network communication is necessary, virtual network peering can be configured to provide secure and controlled connectivity cross landing zones. For scenarios requiring advanced traffic inspection, deploying an Azure Firewall or Application Gateway is recommended to maintain security.