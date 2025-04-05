---
breadcrumbs: false
cascade:
  type: docs  
toc: false
---

# What is Gazelle?

This is a personal playground for diving into the Azure Landing Zone concept — with everything fully automated. The goal? Build a solution where the whole is greater than the sum of its parts. All the code is on GitHub, open for anyone to explore, use, or build on. The platform is shaped by a these principles:

- **Cost efficiency**: Pay for what you use—nothing more, nothing less. I’ve chosen only Azure services that follow a pay-as-you-go model, avoiding any fixed-cost services that could result in unwanted costs during idle periods. This ensures that if the platform is handling thousands of operations, the cost reflects that. But when it’s sitting idle, it costs nothing. As a trade-off, Azure services with fixed pricing—like Virtual WAN—are not considered for implementation in this setup.

- **Frictionless flow**: Engineers should be able to spin up and tear down their own landing zones without any bottlenecks. To achieve this, I’ve minimized platform-wide shared services to the bare minimum and enable self-service. This enables frictionless, where teams have the freedom to manage the full lifecycle of their landing zones independently, without needing intervention from a centralized unit.

- **Embrace Change**: The platform should make change easy to apply. To do this, I’ve grouped platform capabilities into logical, autonomous units that can be developed and deployed independently, without affecting platform-wide services. This makes it easy to apply quick tweaks or even major updates without turning them into large, disruptive projects.
