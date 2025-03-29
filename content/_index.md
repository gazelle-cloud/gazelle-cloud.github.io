---
breadcrumbs: false
cascade:
  type: docs  
toc: true
---

{{< hextra/hero-headline >}}
  Zero Waste
{{< /hextra/hero-headline >}}
{{< hextra/hero-headline >}}
 Zero Bottlenecks
{{< /hextra/hero-headline >}}


## What do you?

first of all, you get an Azure subscription. The idea is that you get an Azure subscription with predefined guardrails and core Azure infrastructure that is ready to build your application using Microsoft Azure services.

## Cost

you get a full control of cost of your application

## identity

there is a User-Assigned identity that has owner permissions at the subscription scope with configured authentication to your GitHub repository. 


## What is Gazelle?

Gazelle is my personal Azure tenant, where I realizing my thoughts and ideas on how to keep low cost and security in place while enabling application teams to innovate in azure at their own pace.  

![Azure-platform-modular-Deployments](/2.png)


- **cost** Pay for what you use—no more, no less. A platform that processes thousands of operations should scale accordingly. But when it sits idle, it should cost close to nothing. Efficiency isn’t just about handling peak load; it’s about optimizing for all states.
- **security**
- **self service** it provides predefined github Actions that contains identity, inputs/outputs management, deployment logic and resource life cycle management in Azure. However the engineers task is to author bicep modules to solve the business problems


## functional view

- **inexpensive adaptability**: Change is inevitable. The real question is: How much does it cost? A well-designed system ensures that the cost of change is proportional to its impact. A small tweak should require minimal effort; a major redesign will naturally demand more. The system should embrace change, not resist it.

- **Cost friendly**: Pay for what you use—no more, no less. A platform that processes thousands of operations should scale accordingly. But when it sits idle, it should cost close to nothing. Efficiency isn’t just about handling peak load; it’s about optimizing for all states.

- **enable engineers**: engineers should have the autonomy to deploy and manage Azure resources while operating within guardrails that enforce security and cost efficiency. A well-structured platform provides self-service capabilities for managing application landing zones, ensuring agility without compromising control.

## guardrails

- **cost** the philosophy that each application has a full control over their budget. 
  - cost and billing center
  - budget alerts
- **security baseline**  secure at any point at any time
  - Policy: policies are enforced to prevent  unwanted misconfiguration, policy exemptions can be created by editing landing zone parameter file. 
  - security center: a free version of defender for cloud with exempted security recommendations that conflicts with Gazelle security baseline to reduce noise in high standard security reports. 
- **isolation**: 
  - virtual network: 
  - environment: 

## enabling

- **self service**
- **deployment pipeline**
- **lifecycle management**

## operational

- **asdf**
- **asdf**
- **asdf**