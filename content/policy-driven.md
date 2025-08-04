---
linkTitle: Task-Oriented Modules
title: Task-Oriented Bicep Modules- Scaling Simplicity
breadcrumbs: false
weight: 35
cascade:
  type: docs  
toc: true
---

## Overview

Gazelle is built around a simple architectural rule: **each Bicep module solves one task only**. No abstractions. No shared libraries. Just clean, intentional code that reflects a single responsibility.

This design allows the platform to scale operationally without increasing complexity. Engineers don't need to understand the codebase. They just edit parameter files. Everything else—deployment logic, change safety, environment validation—is handled by GitHub Actions.

---

## Why Single-Responsibility Modules

Each module in Gazelle is designed to solve one and only one problem. That’s it. No generalization. No multiplexed logic. The result is:

- **Human readability**: You can understand what a module does without digging through layers of abstraction.
- **Safe modification**: Changing one module doesn’t introduce side effects in others.
- **Fast iteration**: Daily changes happen in parameter files, not the codebase.
- **Straightforward review**: Code reviews focus on intent and outcome, not technical nuance.

This principle applies everywhere—from platform services like access control and automation, to app-team operations like landing zone provisioning or policy exceptions.

---

## Parameter-Driven Operations

Every supported operation—assigning a new role, deploying a new diagnostic setting, whitelisting a service, or provisioning a new landing zone—is **parameter-driven**.

- **Parameter files** are the only interface most engineers touch.
- **No code edits** are required to deploy new capabilities or update existing ones.
- **Environment-specific customization** is handled by GitHub Variables and scoped parameter files.

This means day-to-day tasks can be safely performed by platform users with minimal context, while core logic remains stable and well-tested.

---

## Deployment Pattern

All modules—whether for policy, access control, monitoring, or automation—use a **standardized deployment pipeline**:

- GitHub Actions trigger based on parameter file changes.
- Deployments use Azure Deployment Stacks for full lifecycle management.
- Outputs (like resource IDs) are stored in GitHub Variables for cross-pipeline use.

Once you've seen one deployment, you've seen them all. This consistency drastically reduces onboarding time and operational drift.

---

## Practical Examples

Each platform capability adheres to the task-oriented model:

### Access Control
- One module defines custom roles.
- One module handles assignments.
- Parameter file specifies who gets what role in which environment:contentReference[oaicite:0]{index=0}.

### Policy
- One policy = one compliance check.
- Each assignment is managed independently.
- Whitelisting a new service involves editing up to four parameter files. No logic changes required:contentReference[oaicite:1]{index=1}.

### Monitoring
- Module deploys Log Analytics and alerting configurations.
- Parameter file drives resource names, retention, and email routing:contentReference[oaicite:2]{index=2}.

### Automation
- One job = one script = one task.
- Inputs passed via environment variables.
- Parameter file maps job to its inputs, nothing more:contentReference[oaicite:3]{index=3}.

---

## Design Trade-Offs

We intentionally avoid generalization. These modules are **not** reusable templates meant to support many use cases. Instead:

- They’re tightly scoped to their task.
- Code duplication is tolerated to preserve clarity.
- Modules are refactored **only** when the task changes—not when a new team wants to do something similar.

This might seem less “DRY” in traditional terms, but it results in fewer bugs, safer changes, and better onboarding for new contributors.

---

## Scaling with Confidence

Because modules are designed around single tasks, scaling horizontally is trivial:

- Add a new capability? Just drop in a new module + parameter file.
- New team wants access? Modify the right assignment file.
- New policy scope? Update its parameterization.

The codebase stays flat. The deployments stay predictable. The risk stays low.

---

## Summary

Task-oriented Bicep modules are at the core of Gazelle’s approach to scalable platform engineering. They keep the platform predictable, composable, and easy to operate—without sacrificing flexibility. By making every task its own unit of logic and configuration, Gazelle turns platform management into something that's not just automated—but operable by everyone.

