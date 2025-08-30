---
linkTitle: Getting Started
description: "Azure Landing Zone: getting started – self-service for your first landing zone. Register, deploy, and scale from dev to prod"
breadcrumbs: true
weight: 10
cascade:
  type: docs
toc: true
---
# Create Your First Azure Landing Zone

Creating your first Azure Landing Zone is a simple two-step process: register your cloud app in Gazelle, then create the landing zone itself. Registration anchors cost and gives you a repo to build from; the landing zone adds the subscription, guardrails, and monitoring that make it real. From there, you have a governed environment ready to grow from dev to prod.

## Register Your App
![new app](/new-cloud-app.png)
Create a New Issue in the `AzurePlatform` GitHub repo using the `New Cloud App` template. All you provide is an app name — the automation does the rest for you:  

- A new invoice section is created in Azure Billing. Every cost for this app — across all its environments — rolls up here.
- A new GitHub repository is cloned from the starter template. It comes pre-loaded with minimal configuration to deploy into Azure, so you don’t begin from scratch. 

The invoice section ID is saved back into the new repo as a GitHub repository variable. That ID is the anchor — every landing zone you create for this app will map its costs to the same invoice section automatically. Naming follows the same rule: there’s a strict 1:1 mapping between app name and landing zone names. If your app is called `HeyAzure`, then your zones will be `HeyAzure-dev`, `HeyAzure-prod`, and so on. Cost tracking, environment names, and repositories stay consistent. 

This is a fire-and-forget action. The automation lays down the initial configuration, but after that it’s yours to shape. You decide how to extend the repo, invoice sections alerts, and how to structure deployments. The platform just gets you to a clean starting line.

## Create a Landing Zone

Create a New Issue in the `AzurePlatform` GitHub repo using the `New Landing Zone` template. You provide just a few parameters — app name, environment, landing zone budget, engineer email and a few others — the automation does the rest for you:

First, a landing zone parameter file is generated in the `AzurePlatform/landingzones` folder. It captures everything that ties the environment together. This file is the single source of truth for your landing zone, and you can adjust it at any time through Pull Requests.

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
> `subscriptionId` is used only in the Bring-Your-Own-Subscription scenario  
> virtual Network CIDR range can be modified during initial deployment only

Next, a dedicated GitHub Action workflow is created in the `.github/workflows` folder. It defines the triggers and the blueprint applied to your landing zone. That workflow:

- Creates a new Azure subscription
- Applies guardrails (policies, budget)
- Configures initial resources (Log Analytics, Managed Identity, etc.)
- Maps the application GitHub repo with the landing zone environment

Landing zone pipelines can be re-run at any time. This is especially useful when new features are added to the blueprint — re-deploy existing landing zones, and the changes roll out everywhere automatically.

## Approvals

Both flows — registering a new app and creating a landing zone — require an approval label before the workflow runs (`approved-cloudApp`,` approved-landingzone`).

Landing zones are created in the core Azure platform repo, and I want to ensure they follow the intended structure. The label is a lightweight checkpoint — a quick review before automation takes over.

Every landing zone is reviewed, approved, and traceable — while the workflow stays fast and transparent.

## Environment is ready

You’ll know your landing zone is ready when you receive an email from Azure Monitor. That’s the signal: budgets are in place, guardrails are active, monitoring is wired. From there, it’s your turn:

- In your repo, create a new issue.
- Check out a new branch.
- Edit the main.bicep file with the resources you need.
- Deploy to Azure from the branch.
- Open a pull request — and merge into production.

In a few steps, you’ve gone from zero to a governed, isolated, production-ready environment. The guardrails stay automatic; the freedom inside them is yours.