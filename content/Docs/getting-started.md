---
linkTitle: Getting Started
description: "A step-by-step guide to implementing Azure Landing Zones in your tenant — free and open source"
breadcrumbs: true
weight: 5
cascade:
  type: docs
toc: true
---
# Getting Started
Gazelle is a [platform-as-code](/docs/platform-as-code/) framework. To run it you bootstrap the platform in your own GitHub organization, wired to your Azure tenant and Entra ID. This guide assumes you are an Azure engineer preparing to stand up Gazelle for your organization.

## Prerequisite

- An Entra ID tenant with global admin rights
- An Azure tenant backed by a Microsoft Customer Agreement account
- A GitHub Team plan organization where you’ll host your Gazelle fork

## Entra ID

- Create two app registrations — one for test, one for prod.
  - Suggested names: `Azure-LandingZone-test` and `Azure-LandingZone-prod`.
- Configure federated credentials for each app:
  - Federated credential scenario: `GitHub`
  - Entity type: `Environment`
  > Case sensitive — make sure your environment names match exactly.
- [Grant API permissions:](/docs/platform-as-code/building-blocks/platform-automation/#identity)
  - `Directory.ReadWrite.All`
  - `AppRoleAssignment.ReadWrite.All`
- Create four Entra ID groups (suggested names):
  - Azure-Platform-Engineer-Test
  - Azure-Platform-Engineer-Prod
  - Azure-Platform-Owner-Test
  - Azure-Platform-Owner-Prod



## Azure

- [Create two management groups](/docs/platform-as-code/building-blocks/management-groups/) under the `tenant root` Example: `org-test` and `org-prod`.
- Assign roles to your Entra ID applications:
  - Prod app: `Owner` at the `tenant root group`.
  - Test app: `Owner` at the top-level `org-test`.
- Create two [initial Azure subscriptions](/docs/platform-as-code/building-blocks/initial-landing-zone/#bring-your-own-subscription) — one for platform management test, one for prod.
- Assign `Contributor` role to both apps at the billing profile level.



## GitHub

- [Fork the Gazelle repo](https://github.com/gazelle-cloud/gazelle-platform) into your organization.
- Create GitHub app
  - Generate a private key and save it as an org secret named `APP_GITHUB_AZUREPLATFORM_KEY`.
  - configure repository permissions:
    - Actions: read & write
    - Administration: read & write
    - Content: read & write
    - Environments: read & write
    - Issues: read & write
    - Packages: read & write
    - Secrets: read & write
    - Variables: read & write
    - Workflows: read & write
  - Configure organization permissions:
    - Administration: read
    - Custom properties: read & write
    - Secrets: read & write
    - Variables: read & write
- Fill in your `githubVariables.json` with values from earlier steps:
```json
{
  "organizationVariables": {
    "AZURE_DEFAULT_LOCATION": "francecentral", // or your preferred region
    "AZURE_TENANT_ID": "00000000-0000-0000-0000-000000000001",
    "APP_GITHUB_AZUREPLATFORM_ID": "xxxxxxxxxxxxxxxx" // // GitHub App ID
  },
  "repositoryVariables": {
    "RUNNER_IMAGE_VERSION": "ubuntu-latest",
    "AZURE_CLI_VERSION": "latest",
    "Azure_PowerShell_Version": "latest",
    "BILLING_ACCOUNT_ID": "00000000-0000-0000-0000-000000000002:00000000-0000-0000-0000-000000000003_2000-01-01",
    "BILLING_PROFILE_NAME": "AAAA-BBBB-CCC-DDD",
    "AZURE_PLATFORM_ENGINEER_EMAIL": "platform.engineer@example.com"
  },
  "environmentVariables": {
    "AZURE_PLATFORM_CLIENT_ID": {
      "test": "00000000-0000-0000-0000-000000000004", // app registration client id
      "prod": "00000000-0000-0000-0000-000000000005"
    },
    "AZURE_PLATFORM_PRINCIPAL_ID": {
      "test": "00000000-0000-0000-0000-000000000006", // enterprise application object id
      "prod": "00000000-0000-0000-0000-000000000007"
    },
    "PLATFORM_SUBSCRIPTION_ID": {
      "test": "00000000-0000-0000-0000-000000000008",
      "prod": "00000000-0000-0000-0000-000000000009"
    },
    "TOP_LEVEL_MANAGEMENT_GROUP_NAME": {
      "test": "org-test",  // matches mgmt group name created earlier
      "prod": "org-prod"
    },
    "AZURE_PLATFORM_ENGINEER_GROUP_ID": {
      "test": "00000000-0000-0000-0000-000000000010",
      "prod": "00000000-0000-0000-0000-000000000011"
    },
    "AZURE_PLATFORM_OWNER_GROUP_ID": {
      "test": "00000000-0000-0000-0000-000000000012",
      "prod": "00000000-0000-0000-0000-000000000013"
    }
  }
}
```

## BigBang

Once your initial configuration is complete, you’re ready for the first launch by triggering the GitHub Actions workflow [`platform - flow - BigBang`](/docs/platform-as-code/#big-bang). It bootstraps your platform by provisioning and configuring the Azure resources in your tenant.
- Creates management group hierarchy 
- Wires access control
- Sets up the initial subscriptions for platform management
 -Loads baseline policies
 
If all configuration values were set correctly, the run completes in about 15 minutes.

After BigBang succeeds, your test environment is a fully functioning Gazelle platform. From here, you take over — adjusting, refining, and evolving the platform to fit your needs. Gazelle gives you a working baseline; the real power comes from making it yours.

## As-Is

Gazelle is provided `as is`. It gives you a working baseline, but it is your responsibility to adapt, secure, and operate it for your organization.