---
title: Getting Started
breadcrumbs: false
toc: true
weight: 10
---

This guide will walk you through replicating the latest release of the Gazelle platform setup in your Azure tenant, providing you with a solid foundation for your Azure platform. Feel free to tweak the setup as needed to match your specific requirements.

By completing this guide and successfully running the deployment pipelines, you will achieve an Azure tenant setup that aligns with the principles and configurations outlined in the [Managing Azure Platform](/managing-platform) and [Azure Platform Design](/platform-design) pages.

The current platform costs are close to zero, reflecting its efficient design. However, cost alerts are configured to notify at 1 EUR for the production environment and 4 EUR for test environments per month, ensuring that spending remains well within budget.

**Note**: This environment is a **playground** setup intended solely for experimentation and testing purposes. It is not recommended for production use.

## Prerequisites

Before starting, ensure you meet these requirements:

- Azure tenant with 'User Access Administrator' at the Root level
- GitHub organization with GitHub Team plan
- Two Azure subscriptions
- Microsoft Customer Agreement billing account

## Step-by-step

- **Fork the repo**
  - link to repo
  - set to private

### Entra Id

**Create Entra Id group**

 - Create Entra Id group for platform engineers.
 - Copy group object id and set it as GitHub repository variable:
```
AZURE_PLATFORM_ADMIN_GROUP_ID = object_id
```

**Create App registrations**

- Create two app registrations, one for testing and one for production. You can name them as you prefer; suggested names are 'AzurePlatform-test' for the testing environment and 'AzurePlatform-prod' for the production environment
- Copy their client IDs and set them as GitHub repository variables:  
     ```
     INIT_AZURE_PLATFORM_CLIENT_ID_TEST = client_id_test
     INIT_AZURE_PLATFORM_CLIENT_ID_PROD = client_id_prod
     ```
**Config federated credentials**

- Select 'Federated credentials' under  'Certificated and secrets'.
- Select 'GitHub Actions' as the federated credential scenario. 
- Provide the required GitHub organization details, choose 'environment' as the entity type, and set the value to test or prod based on the application.   

### Azure

**Create Azure Management Groups**
- Create two top-level management groups, one for testing and one for production. You can name them as you prefer, but ensure the names include the suffix '-test' for the testing and '-prod' for the production group.

**Assign RBAC permissions**
 - Assign the 'Hierarchy Settings Administrator' role to the 'AzurePlatform-prod' service principal at the 'Tenant Root Group' level.
 - Assign the following RBAC permissions to both the 'AzurePlatform-test' and 'AzurePlatform-prod' service principals at the 'test' management group level:
   - 'Azure Deployment Stack Owner'
   - 'User Access Administrator'
   - 'Contributor'
 - Assign the following RBAC permissions to 'AzurePlatform-prod' service principals at the 'prod' management group level:
   - 'Azure Deployment Stack Owner'
   - 'User Access Administrator'
   - 'Contributor'
 - Assign 'Billing Profile Contributor' role to the 'AzurePlatform-prod' service principal at the billing profile scope. 

### GitHub

**Setup GitHub App**
- **to be continued... have to find a solution how to share the app settings**
- generate a 'private key'
- copy the private key as GitHub repository secret:
  ```
  AZUREPLATFORM_KEY
  ```

**Configuration repository variables**
```
INIT_MANAGEMENTGROUP_HIERARCHY_NAME = 'management group name without a suffix'
AZURE_DEFAULT_LOCATION = francecentral
AZURE_TENANT_ID = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx
INIT_MANAGEMENT_SUBSCRIPTION_ID_TEST = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
INIT_MANAGEMENT_SUBSCRIPTION_ID_PROD = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
BILLING_ACCOUNT_NAME = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx_xxxx-xx-xx
BILLING_PROFILE_NAME = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
APP_GITHUB_AZUREPLATFORM_ID = xxxxxxxxxxxxxxxxxxxx
AZURE_CLI_VERSION = latest
RUNNER_IMAGE_VERSION = ubuntu-latest
```
**Create an GitHub Issues label**
- create a new label called 'approved'
  
## Run the pipeline
- trigger the [platform-flow-BigBang](/github-workflows/#bigbang) GitHub Action 



## Misc

This guide is designed to set up the initial configuration, with no further manual actions required on the platform. Although triggering the [Destroy the Platform](/github-workflows/#destroy-azure-platform) pipeline will remove the environment, it will not touch the initial configuration.
