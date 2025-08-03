---
title: instructions for chat GPT to write the content
linkTitle: instructions
breadcrumbs: false
cascade:
  type: docs  
toc: true
---



# Writing Style Guide for Personal Platform Documentation

## Format & Structure
- Use a structured, docs-like layout with **clear headings** and **short sections**.
- Start with the technical explanation, then add design rationale or clarifications if needed.
- Use bullet points for lists of behaviors, constraints, or steps.
- Keep paragraphs short for easy scanning. Full sentences are fine if they aid clarity.

## Tone
- Professional, but approachable—think "engineering blog post for peers."
- No jokes, gimmicks, or “clever” one-liners (e.g., avoid *"That’s not a bug—it’s a core feature"*).
- Flow naturally with connective phrases where needed, but keep wording tight.
- Assume the reader is technical and familiar with Azure, GitHub Actions, and platform engineering. No need to oversimplify.

## Content Style
- Be explicit about **what the platform does**, **how it works**, and **the trade-offs**.
- State constraints directly (e.g., “Deployment Stacks don’t support X”).
- Integrate proof points naturally—concise, embedded in the flow (e.g., *"This capability is exercised daily in production by rebuilding environments to validate changes, reset configurations, and recover from failures"*).
- Call out defaults and note what can be changed.

## Decision Reasoning
- Explain *why* decisions were made—cost, speed, autonomy, security, maintainability.
- Highlight operational reality when relevant (*"This is part of the normal workflow, not just an edge case"*).
- Avoid long narratives—reasoning should be 1–3 sentences, not paragraphs.

## What’s Allowed
- First-person plural (“I,”) when it helps explain process or reasoning.
- Light connective phrasing to keep text readable (*"This makes it easier to..."*).
- Direct, factual proof of use (*"It’s used in daily operations..."*).

## What to Avoid
- Marketing language (*"robust," "seamless," "enterprise-ready"*).
- Clever or cheap-sounding phrases (*"That’s not a bug—it’s a feature"*).
- Overlong examples when one concise sentence will do.
- Storytelling or metaphors—stick to factual, technical explanation.