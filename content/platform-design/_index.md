---
title: Platform Design
weight: 20

---

This page outlines the pillars that form the foundation of Gazelle’s tenant setup. From resource organization to cost, and compliance, these principles define how landing zones are structured and managed to meet the needs of modern cloud platform.

Design Principles 
Self-Service 
Self-service is critical for reducing dependency on centralized platform teams and empowering application teams to manage their own landing zones. Using predefined GitHub issues and automated workflows, Gazelle allows teams to create landing zones, edit budgets, exempt policies, or deactivate subscription independently. This approach enhances efficiency by putting essential tasks directly into the hands of the teams.

Consumption-Based Billing 
Managing platform costs effectively starts with avoiding fixed-cost services whenever possible. Gazelle focuses on selecting Azure services that charge based on actual consumption, aligning costs with actual usage to maintain efficiency. By prioritizing pay-as-you-go resources over those with predefined pricing, the platform ensures that costs remain directly tied to operational needs.

BigBang 
Unforeseen failures shouldn’t lead to downtime or complex recovery processes. The BigBang principle ensures that platform services can always be redeployed from scratch, providing a reliable fallback mechanism. By treating the platform as fully disposable and repeatable, BigBang simplifies recovery and guarantees operational continuity.