---
linkTitle: Floating Platform
description: "Composable landing zones platform built on Azure Deployment Stacks and GitHub Actions — reproducible, adaptable, and ready for breaking changes"
breadcrumbs: true
weight: 30
cascade:
  type: docs
toc: true
---
# Floating Platform

When you build a platform, you face a choice: will it sink or float?  

Gregor Hohpe framed it perfectly. A sinking platform gets dragged down by yesterday’s choices — old abstractions, rigid designs, long-term compatibility. Every new feature is weighed against past decisions, until the platform becomes an anchor instead of an engine.  

A floating platform, in contrast, adapts. It takes on new technologies without apology, and it isn’t afraid to reinvent itself when the environment shifts. That’s what keeps it alive.

## Breaking Changes are Welcome

When Azure introduced Deployment Stacks shifted the focus from getting resources into Azure to managing their lifecycle. Suddenly, the platform deployments weren’t about “somehow get resources to Azure” anymore; it was about managing the entire lifecycle of those deployments. Create, update, destroy — all predictable.

That shift was a breaking change. Instead of patching old scripts, I reinvented the deployment model. This was the birth of building block deployments: each block owns its full lifecycle, able to appear, evolve, or disappear without breaking the rest.

## Mechanisms to Enable Floating

### Building Blocks

Once the [building block model](/docs/platform-as-code/#building-blocks) was in place, everything else followed. Blocks are autonomous: each one ships with its own Bicep modules and pipelines, and they don’t depend on one another.

- Add a block → a new capability appears in Azure.
- Remove it → it vanishes cleanly.
- Update it → the change stays local, the rest of the platform is untouched.

This independence is what makes floating possible. When the baseline shifts — a new Azure policy model, or a security hardening pattern — only the relevant block floats forward. The rest keep working as-is.

### Test environment

Every new idea lands in a full replica test environment first. Same management groups, same policies, same automation. If it works there, it will work in prod.  

This gives me the freedom to try bold changes — like rethinking access control or new landing zone feature — without risking the main platform. If the experiment fails, the test environment is [redeployed from scratch](/docs/platform-as-code/#big-bang). If it works, it floats into production.  

### Development Flow   

Each change in Gazelle flows through a cycle that makes the platform stable and reproducible.  Whether it’s modifying Azure policy, or redesigning the entire deployment engine, the workflow is the same:  

```
Issue → Branch → Test → Validate → Pull Request
```  

An issue starts the conversation, a branch carries the change into a test environment, validation proves it works, and only then does the pull request merge it into the platform. This cycle turns floating into a discipline — every experiment, every breaking change, every design shift is visible, reviewed, and proven before it touches production.

## Designed to Float
Cloud is motion. Azure evolves weekly, GitHub monthly, and my own understanding just as fast. A sinking platform resists change until it breaks. A floating platform embraces the change. For Gazelle, that means:  
- Embracing breaking changes as opportunities.  
- Structuring building blocks to be replaced without drama.  
- Using test environment as safe space for bold ideas.  
- Running every change through a pull request.  

The result is a platform that floats and delivers the best of what Azure and GitHub have to offer.