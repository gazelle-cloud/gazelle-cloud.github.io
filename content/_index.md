---
breadcrumbs: false
cascade:
  type: docs  
toc: false
---

# Gazelle  
**Self-service Azure landing zones as code — fully automated via GitHub.**  

Gazelle is a set of tools and services for managing Azure landing zones entirely as code, using GitHub Issues and Actions.  
It’s a self-service capability where application teams can create, update, and tear down landing zones without bottlenecks — all while staying compliant with platform policies.

## How It Works

1. **Request a Landing Zone**  
   Open a GitHub Issue template with the required details.  
   Within **5 minutes**, GitHub Actions provision a ready-to-use Azure landing zone.

2. **Update via Pull Request**  
   Need to adjust budgets or create a policy exemption?  
   Edit the landing zone’s parameter file and submit a PR. Automation handles the rest.

3. **Burn Down When Done**  
   When an environment is no longer needed, trigger another GitHub Action to tear it down — clean, fast, and automated.

All operations — from setup to teardown — are managed **as code** in GitHub.

## Platform Capabilities

- **Cost per Application**: Each app gets its own invoice section for complete visibility.  
- **Policy-Driven Compliance** – Security & operational standards enforced automatically via Azure Policy.  
- **Fully Automated** – Zero manual Azure access; everything runs through GitHub pipelines.  
- **Test Environment** – Mirror test environment for validating changes before production.  
- **Cost-Friendly** – Pay only for what you use; no flat fees.


## Limitations

- **Single Region** – All resources deploy in one Azure region, defined in GitHub variables.  
- **Whitelisted Resources** – Only approved Azure services can be deployed.  
- **Subscription Isolation** – Each landing zone runs in its own Azure subscription.


## Design Principles

- **Everything-as-Code** – No manual changes; GitHub is the single source of truth.  
- **Decentralized by Design** – No shared components; each environment is fully independent.  
- **Autonomy with Guardrails** – Teams operate independently within enforced platform rules.