---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---
{{< hextra/hero-headline >}}
  Build landing zones
{{< /hextra/hero-headline >}}
{{< hextra/hero-headline >}}
  in Azure with GitHub
{{< /hextra/hero-headline >}}
 
Gazelle is a suite of Azure and GitHub services designed to streamline landing zone deployment and management with flexibility and scalability. It adapts to diverse tenant requirements, enabling the creation of tailored Azure platform.

Gazelle serves as a sandbox for designing and deploying Azure landing zones using GitHub, offering a practical environment to experiment and innovate. By replicating real-world challenges faced by platform teams, it bridges the gap between theory and practice. This focus not only supports the design and construction of platforms but also delegate application teams with self-service capabilities to create and manage their own landing zones.

The core of Gazelle is its [deployment logic](/managing-azure-platform), which includes:

- **Isolated, Production-Like Test Environment**: Ensures that all updates are tested before introduced into production. 
- **Service-Oriented deployments**: Divides platform functionality into manageable, purpose-driven workflows.  
- **Optimize workflow processes**: Handles inputs/outputs mechanisms, authentication, and Azure configuration.  
- **Automated Deployments**: Eliminates direct human interaction from all platform development tasks.

The entire Gazelle codebase, along with the current configuration of the Gazelle tenant, is available in a public GitHub repository. Follow the [Quick Start Guide](/getting-started) for the initial configuration, and let the automated workflows handle the rest.