---
linkTitle: Outputs  
title: Managing Outputs in Gazelle’s Modular Pipelines  
breadcrumbs: false  
weight: 21  
cascade:  
  type: docs  
toc: true  
---
# Handling Outputs in Gazelle

## What Are Outputs?

In Gazelle, **outputs** are values emitted by Bicep templates that act as precise interfaces between platform components. Rather than exposing internal details, outputs surface only the essential information other units need—like workspace or resource IDs. This promotes modularity, separation of concerns, and safer evolution of infrastructure components.

---

## Why Outputs Matter

### 🔁 Decoupled Pipelines
Outputs let one pipeline publish critical data—like a Log Analytics workspace ID—so that downstream pipelines can consume it without introducing hard dependencies. For example, the Monitor pipeline might expose a workspace ID that the Policy or Automation pipeline later consumes, without knowing how that ID was generated.

### 🧭 Consistent Configuration
Passing outputs into **GitHub Variables** ensures that shared parameters such as region names, resource IDs, or environment identifiers remain consistent across all workflows. This helps standardize behavior across environments and eliminate hardcoding.

### 🔐 Interface Contracts
Defining outputs as structured key/value objects creates a clear contract between Bicep modules and CI/CD pipelines. Each output acts like a mini-API for infrastructure—formalizing what data is available to consumers and allowing internal module changes without breaking external workflows.

---

## How Outputs Work

### 1. Define Outputs in Bicep

Each pipeline's main deployable Bicep file declares a structured `object` output that contains all required values for downstream workflows:

```bicep
output GitHubEnvironmentVariables object = {
  log_analytics_resource_id: logAnalytics.outputs.logAnalyticsResourceId
}
```

This object groups and names output values clearly, making them easy to trace and reuse.

## 2. Capture Outputs in GitHub

During deployment, GitHub Actions automatically captures these outputs and saves them into GitHub Variables. Depending on the scope, these outputs are stored in one of three supported targets:

- **GitHubRepositoryVariables**: Persist across all workflows in a repo
- **GitHubEnvironmentVariables**: Scoped to a specific GitHub environment (e.g., `test`, `prod`)
- **GitHubActionsVariables**: Temporary; available only during the current workflow run

These variables can then be accessed by any downstream job in the same or separate workflows.

## 3. Consume in Downstream Workflows

Later jobs or pipelines retrieve these values through the GitHub Actions context and pass them as parameters into other Bicep modules or scripts. This ensures that dependencies are explicit and managed via GitHub—not hard-coded or shared informally.

---

## Design Benefits

Gazelle’s use of outputs enforces key software principles:

- **Single Responsibility**: Each module exposes only what’s needed—no more, no less.
- **Minimal Coupling**: Pipelines don’t rely on implementation details, making it easier to evolve parts of the platform independently.
- **Traceable Interfaces**: With outputs treated as first-class objects, it's easy to audit and validate what data is shared and why.
- **Reproducibility**: Outputs help enforce Gazelle's "Big Bang" principle, ensuring that all deployments are consistent and repeatable—even when rebuilding the entire platform from scratch.

---

## Summary

In Gazelle, outputs are more than just a convenience—they are foundational to how the platform manages dependencies, enforces contracts, and promotes modularity. By treating outputs as structured, versioned interfaces and storing them in GitHub Variables, Gazelle delivers scalable, maintainable, and secure cloud infrastructure—entirely as code.
