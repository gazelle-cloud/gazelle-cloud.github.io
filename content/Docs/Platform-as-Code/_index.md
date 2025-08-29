---
linkTitle: Platform-as-Code
description: "How I apply infrastructure-as-code principles to build composable Azure landing zones with Bicep and GitHub"
breadcrumbs: false
weight: 20
cascade:
  type: docs  
toc: true
sidebar:
  open: true
---

Some things have to be the same everywhere — Azure policies, access control, landing zone configuration. If those foundations drift, the platform loses credibility. The only way to guarantee consistency is to manage landing zones as code, enforcing every rule the same way, every time. With code as the single source of truth, autonomy stays possible without ever compromising trust.

## No Human Touch

To make that consistency real, I eliminated direct human access to production. Nobody logs into the platform to make changes by hand. All updates flow through code, reviewed and deployed via automated pipelines. This keeps production stable, predictable, and fully reproducible.

## Building Blocks

I wanted the platform to be modular. That means breaking everything down into building blocks: complete, independent GitHub Actions workflows, each delivering a single capability end-to-end. Think access control, policy, monitoring—each is its own block, responsible for everything it needs to do its job in Azure.

A building block owns its lifecycle. Add a block, and the capability appears in Azure—services, config, connections, everything. Remove it, and it’s gone, with nothing left behind. 

| Building Block   | Description |
|------------------|-------------|
| [**Management Groups**](/docs/platform-as-code/building-blocks/management-groups/) | Sets up the Azure Management Group hierarchy. |
| [**Access Control**](/docs/platform-as-code/building-blocks/access-control/) | Manages access control at the management group. |
| [**Automation**](/docs/platform-as-code/building-blocks/platform-automation/)   | Handles operational tasks to keep things healthy and clean. |
| [**Policy**](/docs/platform-as-code/building-blocks/azure-policy/)       | Deploys policy identities, custom policy definitions, and assigns. |
| [**Initial Landing Zone**](/docs/platform-as-code/building-blocks/initial-landing-zone/)       | Bootstraps the initial subscription, so the platform can stand up from day zero |

Building blocks are designed to be independent—redeploy or update one without touching the rest. Outputs are passed between blocks using GitHub variables—without hardcoding resource ID.

## Bicep Modules

Inside each building block, Bicep modules do the heavy lifting. Each one is task-focused, wrapping a single Azure service or capability — like defining a policy or assigning a role. Platform management logic lives inside the module, aimed at solving one challenge at a time. It makes design decisions explicit and expresses how the capability scales through nothing more than a parameter file. Because everything stays human-readable and self-contained, the code is easier to follow, safer to evolve, and changes never spill over into parts of the system they don’t belong.

## GitHub 

GitHub is the management plane for Gazelle. Every platform operation — from creating a landing zone to updating a policy — starts as an issue and makes its way to a pull request. This keeps every change visible, reviewed, and traceable — nothing happens in the dark.

All deployments run via GitHub Actions, using federated Entra ID credentials scoped to `org/repo/environment`. It has `Owner` permissions at the top level management group. The service connection also has a token with write [permissions for GitHub operations](/docs/getting-started/#github), like write variables.

Rather than hardcoding resource IDs in Bicep files, each deployment publishes its outputs — such as resource IDs — to GitHub variables. Downstream pipelines consume those variables as inputs, keeping deployments modular, decoupled, and easy to chain together.

## Test Environments

Every change gets proven in a fully isolated, production-like replica. Same management group structure, same policies, same access control — just in a separate subscription. Nothing is “similar” or “close enough.” It’s the same thing, end to end.

The flow is simple: open an Issue, check out a branch (name it whatever you want), push your changes — and that branch deploys straight into the test environment. You validate the results there, by hand. The main branch is protected: the only path to production is through a Pull Request. That way, the exact same code that passed in test is what lands in prod. No drift, no guessing.

This symmetry is by design. If it works in test, it works in prod — exactly the same way. The environment context is baked into the GitHub workflows using environment variables, so environment-specific values are fetched on the fly. No hardcoding, no duplication, no “oops, forgot to update prod.”

Need to reset? Follow a [BigBang](#big-bang)

## GitHub Flow

All platform changes follow short-lived branches, using a GitHub Flow:

```
Issue → Branch → Push → Test Environment → Validate → Pull Request

```
You start by opening an Issue to describe the change. From there, create a branch, make your updates, and push them to GitHub to deploy to a test environment. Once deployed, you manually validate the results. If everything checks out, you open a Pull Request to merge back into main. The process is quick, lightweight, and keeps the platform fully aligned with the source code at all times.

## Code as the Source of Truth

Azure Deployment Stacks handle both create and destroy, with DeleteAll set by default. If it’s not in the code, it doesn’t exist—period. For things Azure can’t clean up (like Entra ID objects), I fall back to classic deployments, accepting the manual cleanup tradeoff.  

## Deployment Scope

All core capabilities—identity, policy, RBAC—deploy via Deployment Stacks at the top-level management group. Deployment Stacks are named after the capability they deliver, so it’s always clear what’s running.  
Platform resources land in a dedicated management subscription, grouped by `Building bock` for clarity.

## Big Bang

The platform must always remain in a reproducible state — capable of being deployed and configured from scratch, end-to-end, using a single GitHub workflow. Every change to the platform, whether introducing a new capability or updating an existing one, is held to that principle. If you can’t destroy and rebuild cleanly, the change isn’t ready.

To validate this, two workflows are provided:

### Destroy

The workflow wipes the entire Azure platform setup. By default, it deletes all deployment stacks with `deleteAll` enabled, clearing out the platform management subscription, management group configuration, deployment history, and child management groups. Subscriptions from those child groups are moved back under the top-level management group.

What’s left is only the initial tenant configuration, exactly as described on the Getting Started page. The workflow also purges GitHub environment variables tied to the test/prod mirrors, so the next run starts with a clean slate end-to-end. Repository-level variables remain untouched, since they hold global tenant-wide values that production relies on (for example, the region).

### Big Bang
A GitHub workflow that chains together every platform building block. It deploys the entire platform from scratch — management groups, policies, automation, monitoring, access control, everything. The result is a clean, fully functioning environment that can be recreated at any time, predictable and identical to the baseline defined in code.

Together, `Destroy` and `Big Bang` guarantee that the platform can always be reset, rebuilt, and trusted. The ability to deploy from nothing is the final check of truth.