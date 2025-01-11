---
title: Resource Organization
breadcrumbs: false
toc: true
weight: 10
---
### Management Group Hierarchy

Management groups are used to organize subscriptions, enforce security baselines, and manage access permissions at scale. To reduce the risk of policy overlap, a flat management group hierarchy is implemented. The hierarchy is structured as follows:

- **Platform**: manages platform-specific resources.
- **Online**: Contains all application landing zones.
- **Playground**: A dedicated experimentation space where security policies are not enforced, allowing unrestricted resource deployment.

### Singular Region Deployments

To minimize cost and complexity, single-region deployments are implemented. This approach focuses on deploying Azure resources to a specific region, defined as a GitHub variable. During deployment pipelines, the region value is dynamically retrieved and applied, streamlining the process. To ensure all resources remain within the selected region, Azure Policies are enforced to maintain consistency.

### One Application, One Environment, One Landing Zone

To establish clear boundaries for cost management, governance, and isolation, the "one application, one environment, one landing zone" principle provides a structured approach. This ensures that each application operates independently, with its own dedicated environment and resources. Teams can effortlessly spin up as many subscriptions as necessary to support their development needs.

- **Cost Management**: assigning each application its own landing zone ensures that resource costs are mapped to the specific application and environment, enabling accurate tracking and financial accountability.

- **Isolation**: each application and its environment is completely isolated from a networking and identity perspective. This separation enhances security and minimizes operational risks by preventing unexpected conflicts between applications or environments.
