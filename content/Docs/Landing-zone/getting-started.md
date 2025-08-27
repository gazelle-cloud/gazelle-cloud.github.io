---
linkTitle: Getting Started
description: ""
breadcrumbs: true
weight: 10
cascade:
  type: docs
toc: true
---
# Getting Started with a New App

Every new workload starts the same way: with registration. Apps come first, landing zones follow.

## Register Your App
![new app](/new-cloud-app.png)
Create a New Issue in the `AzurePlatform` GitHub repo using the `New Cloud App` template. All you provide is an app name — the automation does the rest for you:

- A new invoice section is created in Azure Billing. Every cost for this app — across all its environments — rolls up here.
- A new GitHub repository is cloned from the starter template. It comes pre-loaded with minimal configuration to deploy into Azure, so you don’t begin from scratch. 

This is a fire-and-forget action. The automation lays down the initial configuration, but after that it’s yours to shape. You decide how to extend the repo, what IaC framework to use, and how to structure deployments. The platform just gets you to a  starting point.

The invoice section ID is also saved back into the new repo as an environment variable. That ID becomes the key — every landing zone you create for this app maps back to the same invoice section automatically.

There’s also a strict 1:1 mapping between app name and landing zone names. If your app is called HeyAzure, then every landing zone you spin up will carry that prefix (HeyAzure-dev, HeyAzure-prod). That keeps billing, environments, and repositories aligned without surprises.  

To trigger the GitHub Action, the issue must be labeled: `approved-cloudApp` 

## Create a Landing Zone

to be continued...

```json
{
  "appName": "HeyAzure",
  "environment": "test",
  "billingScope": "6XFW-NIJJ-PJA-PGB",
  "managementGroupName": "isolation-test",
  "budget": "100",
  "CIDR": "24",
  "subscriptionId": "",
  "githubRepoName": "HeyAzure",
  "engineerEmail": "mantas@outlook.dk"
}

```
