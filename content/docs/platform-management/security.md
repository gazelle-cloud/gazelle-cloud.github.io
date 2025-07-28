---
title: Security
breadcrumbs: true
weight: 60
toc: true
sidebar:
  open: true
---
- **Free**: Microsoft Defender for Cloud is configured at the free tier across all landing zones to monitor security posture.  
- **Alerts**: Platform security alerts are routed to platform engineer email, to take ownership of the event.
- **Noise Reduction**: Defender for Cloud shows some recommendations that don’t make sense for how Gazelle is built. These can be ignored to reduce noise by editing the `defenderForCloudExemptions.json` file.