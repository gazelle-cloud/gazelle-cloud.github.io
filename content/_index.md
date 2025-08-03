---
title: Hextra Theme
layout: hextra-home
---

{{< hextra/hero-badge >}}
  <div class="hx:w-2 hx:h-2 hx:rounded-full hx:bg-primary-400"></div>
  <span>Free, open source</span>
  {{< icon name="arrow-circle-right" attributes="height=14" >}}
{{< /hextra/hero-badge >}}


<div style="margin: auto; text-align: center;">
<div class="hx:mt-6 hx:mb-6">
{{< hextra/hero-headline >}}
  Run Azure landing zones&nbsp;<br class="hx:sm:block hx:hidden" />with GitHub Actions
{{< /hextra/hero-headline >}}
</div>

  <div style="height: 3rem;"></div>

<div class="hx:mb-12">
{{< hextra/hero-subtitle >}}
  Lean, Clean and build for Autonomy&nbsp;<br class="hx:sm:block hx:hidden" />Let’s break down what  <strong>lightweight</strong> means in practice:
{{< /hextra/hero-subtitle >}}
</div>
</div>

  <div style="height: 3rem;"></div>

<div class="hx:mt-6"></div>

{{< hextra/feature-grid >}}
  {{< hextra/feature-card
    title="Cost Efficiency"
    subtitle="You only pay for what you use. When the platform is running full speed, the cost scales with usage. When it’s idle, it should cost nothing. Services with flat fees—such as Virtual WAN—are intentionally avoided, as they incur cost even when idle. Instead, the platform uses Azure’s consumption-based services, which scale with usage and help maintain predictable, efficient costs."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Self-Service"
    subtitle="Teams shouldn’t have to wait on others to get things done. This platform lets app teams spin up and manage their own landing zones through GitHub Issues. They can tweak budgets, exclude certain resources from security baselines, and handle other environment-specific needs—all without relying on a centralized team."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Decentralized By Design"
    subtitle="This platform keeps shared services to a minimum to avoid overhead and unnecessary friction. Instead of using centrally managed components, each landing zone includes the core services it needs—so teams can configure things based on what works best for them. This design trades cost for speed and autonomy."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Speed"
    subtitle="Speed isn't just about how fast things are delivered—it's also about how quickly you can try out new ideas. This platform lets you deploy to the cloud in minutes, so whether you're building on something existing or testing a new concept, GitHub Actions takes care of everything from setup to updates and cleanup. This quick process means you get feedback faster and can learn and improve without delays."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Purpose-Built Modules"
    subtitle="Infrastructure-as-Code modules are designed to solve specific challenges, hardcode management logic, and enable parameter-driven workflows. Rather than aiming for one-size-fits-all solutions, each module is purpose-built to perform a clear task—such as assigning access control, adding an Azure policy, or provisioning a landing zone. Configuration is minimal, keeping the focus on the flow."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Everything-as-Code"
    subtitle="Every platform capability—identity, policy, monitoring, automation—is defined, deployed, and managed as code. There are no manual steps, no hidden state. GitHub is the single source of truth, and all changes flow through Issues and Pull Requests—just like any other codebase. If something can't be expressed as code, it doesn't belong in the platform."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
{{< /hextra/feature-grid >}}

<div style="margin: auto; text-align: center;">
<div class="hx:mb-12">
  <div style="height: 5rem;"></div>

{{< hextra/hero-subtitle >}}
  Getting technical
{{< /hextra/hero-subtitle >}}
</div>
</div>

{{< cards >}}
  {{< card link="/docs/platform-design" title="High level overview" image="/platform-overview.png" subtitle="A lightweight, modular Azure platform built for autonomy, speed, and cost friendly." >}}
  {{< card link="/docs/platform-management" title="Platform management" image="/platform-policy-deployment-flow.png" subtitle="Standardized, automated deployments—every platform change flows through GitHub and lands in Azure as code." >}}
  {{< card link="/docs/landing-zone" title="Landing zone" image="/platform-policy-deployment-flow.png" subtitle="Self-contained application environments with baked-in guardrails and self-service onboarding from GitHub." >}}
{{< /cards >}}


