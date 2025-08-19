---
description: "Run Azure landing zones with Bicep and GitHub. Free, open source and designed for team autonomy"
title: Hextra Theme
layout: hextra-home
---
<div style="margin: auto; text-align: center;">
<div class="hx:mt-6 hx:mb-6">
{{< hextra/hero-headline >}}
 Run Azure Landing Zones&nbsp;<br class="hx:sm:block hx:hidden" />All from GitHub 
{{< /hextra/hero-headline >}}
</div>

  <div style="height: 2rem;"></div>
<div class="hx:mb-12">
{{< hextra/hero-subtitle >}}
  CAF gives you principles&nbsp;<br class="hx:sm:block hx:hidden" />Consultants give you invoices&nbsp;<br class="hx:sm:block hx:hidden" />I give you a working platform
{{< /hextra/hero-subtitle >}}
</div>
  <div style="height: 2 rem;"></div>

</div>
 <div style="height: 3rem;"></div>

<div class="hx:mt-6"></div>

{{< hextra/feature-grid >}}
  {{< hextra/feature-card
    title="Landing Zone Autonomy"
    link="/Docs/landing-zone/"
    subtitle="Each landing zone arrives pre-built with the essentials — budgets, networking, identity, monitoring, and baseline policies. From there, teams configure resources their way: code, ClickOps, or both — the guardrails always apply."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Platform as Code"
    link="/Docs/Platform-as-Code/"
    subtitle="The platform itself — guardrails, access control, landing zone management — is entirely defined in code. Code shines when the rules are clear, so I hardcoded the platform’s opinions into it. This enables consistency and scalability."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
    title="Isolated Applications"
    link="/Docs/Design-Principles/"
    subtitle="Every workload runs in its own secure space — no shared networks, no public endpoints, no accidental dependencies. Isolation keeps the blast radius small and unlocks real autonomy."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
    {{< hextra/feature-card
    title="Self-Service"
    subtitle="Landing zones are requested through GitHub Issues and managed via Pull Requests. Teams tweak budgets, request policy exemptions, and update budgets on their own — without waiting for a central ops team."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
    {{< hextra/feature-card
    title="Cost Efficiency"
    link="/Docs/Design-Principles/cost-efficiency/"
    subtitle="You only pay for what you use. When the platform is running full speed, the cost scales with usage. When it’s idle, it should cost nothing. Services with flat fees—such as Virtual WAN—are intentionally avoided, as they incur cost even when idle. Instead, the platform uses Azure’s free or consumption-based services, which scale with usage and help maintain predictable, efficient costs."
    style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
  {{< hextra/feature-card
  title="Free & Open Source"
  link="/Docs/"
  subtitle="No black boxes, no license fees. The entire platform is free and open source, so you can inspect the code, run it yourself, and adapt it to your needs."
  style="background: radial-gradient(ellipse at 50% 80%,rgba(190, 187, 243, 0.15),hsla(0,0%,100%,0));"
  >}}
{{< /hextra/feature-grid >}}