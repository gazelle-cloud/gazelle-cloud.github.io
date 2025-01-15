---
title: Resource Organization
breadcrumbs: false
toc: true
weight: 10
---
### Management Group Hierarchy

A management group is a top-level container in Azure used to logically group subscriptions, assign security baselines, and manage access control at scale. In a Gazelle tenant, there are two identical management group hierarchy configurations: one for the test environment and another for production.

The test environment operates independently, with its own identity, policies, and management subscriptions. Deployment pipelines are configured to release new features and platform updates to the test environment first, ensuring proper validation before moving to production. This environment is dedicated to development and testing purposes.

To minimize the risk of policy overlap, a flat management group hierarchy is implemented. The hierarchy is structured as follows:

- **Platform**: contains all Gazelle tenant management and automation subscriptions.
- **Online**: contains all application landing zones regardless of the environment. 
- **Playground**: a dedicated experimentation space where security policies are not enforced, allowing unrestricted resource deployment for testing and exploration.

### Singular Region Deployments

Singular region deployments are a platform capability built on top of GitHub Actions and Azure Policy. The concept is to define the location for Azure resources only once, using a GitHub variable. During deployment pipelines, the region value is dynamically retrieved and applied to the deployment and Azure resources. To ensure all resources remain within the selected region, Azure Policies are enforced to maintain consistency. This approach guarantees consistency across all tenant landing zones.


### One Application, One Environment, One Landing Zone

One Application, One Environment, One Landing Zone is a concept designed to provide application isolation, cost transparency, and governance. This ensures that each application operates independently, with its own dedicated environment and resources. Teams can effortlessly create as many subscriptions as necessary to support their development needs.

- **Isolation**: each application and its environment is completely isolated from a networking, identity and Azure policy perspective. This separation enhances security and minimizes operational risks by preventing unexpected conflicts between applications or environments.

- **Cost Management**: applications often require multiple environments, such as development, testing, and production, each with its own dedicated landing zone. This approach allows for effortless tracking of costs not only at the application level but also at the level of individual application environments.


### Tags

During the creation of a landing zone, Azure Policies are configured to apply the required tags at both the subscription level and to each newly created resource. Bicep modules are designed to make editing required tags as simple as modifying the landing zone's main.bicep file. This ensures effective and consistent management of Azure tags at scale, enabling resources to be easily identified by their tags. Additionally, it allows automation scripts to access metadata, such as the application owner, for use cases like sending notifications.

```bicep
var resourceTags = {
  BusinessCriticality: params.BusinessCriticality
}

var subscriptionTags = {
  ApplicationOwner: params.ownerEmail
  tag-key: 'tag-value' 
}
```