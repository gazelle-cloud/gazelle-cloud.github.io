<!-- GENERATED FROM knowledge-graph/vocabulary/, knowledge-graph/foundations/, knowledge-graph/constitutive/, knowledge-graph/regulative/ - DO NOT EDIT -->

# Knowledge Graph

## Vocabulary

### action-group

**Term:** Action Group

**Kind:** concept

**Area:** monitoring

A landing zone's alert destination, sourced from the platform member profile rather than a named person.

### agentic-workflow

**Term:** Agentic Workflow

**Kind:** concept

**Area:** automation

A workflow that calls Claude to review or draft repository content as part of a pipeline.

### app-registration

**Term:** App Registration

**Kind:** concept

**Area:** identity

The platform's own identity, used because the platform holds no subscription of its own to host a managed identity.

### application-repo

**Term:** Application Repo

**Kind:** concept

**Area:** resource-organization

An application's GitHub repository, the control and deployment plane for all of its landing zones.

### approve

**Term:** Approve

**Kind:** concept

Validating a resource type for security controls, telemetry, and role coverage, then adding it to the allowed list.

### automation-job

**Term:** Automation Job

**Kind:** concept

**Area:** automation

A container job running inside a landing zone's own subscription, performing recurring work through the ARM API.

### automation

**Term:** Automation

**Kind:** area

Recurring work the platform performs without a human.

### azure-service

**Term:** Azure Service

**Kind:** concept

**Area:** security

An Azure service under consideration for adoption by the platform.

### bigbang

**Term:** BigBang

**Kind:** concept

**Area:** deployment

The single initialization that brings the platform into existence; after it, code is the path to production.

### break-glass

**Term:** Break-glass

**Kind:** concept

**Area:** identity

The sanctioned path for a change automation cannot execute, used when a pull request has no route to the outcome.

### cost

**Term:** Cost

**Kind:** area

How spend is attributed, capped, and alerted.

### curate

**Term:** Curate

**Kind:** concept

Adding or refining an entry in the knowledge graph, or recording an observation that does not fit it.

### custom-definition

**Term:** Custom Definition

**Kind:** concept

**Area:** security

A policy definition the platform authors where Azure ships no built-in with the required effect.

### deploy

**Term:** Deploy

**Kind:** concept

Applying declared code to Azure through a capability's own pipeline.

### deployment-stack

**Term:** Deployment Stack

**Kind:** concept

**Area:** deployment

The unit of declarative ownership in Azure: resources it declares are its, and resources it stops declaring are deleted.

### deployment

**Term:** Deployment

**Kind:** area

How code reaches Azure.

### destroy

**Term:** Destroy

**Kind:** concept

Tearing down a landing zone's resources and returning its subscription to the Subscription Bank.

### diagnostic-settings

**Term:** Diagnostic Settings

**Kind:** concept

**Area:** monitoring

The platform-defined routing that sends a resource's logs and metrics to the landing zone workspace.

### end-to-end-deployment

**Term:** End-to-end deployment

**Kind:** concept

**Area:** deployment

A capability deploying through its own pipeline from repository to Azure, triggering no other capability's deployment.

### entra-id-group

**Term:** Entra ID Group

**Kind:** concept

**Area:** identity

The directory group created when an application joins the platform; job-function roles target it rather than individuals.

### exemption

**Term:** Exemption

**Kind:** concept

**Area:** security

A scoped, reasoned carve-out from a policy assignment, resolved through the platform's generated assignment reference.

### gazelle

**Term:** Gazelle

**Kind:** concept

**Area:** resource-organization

The platform itself: the rules, the code that enforces them, and the reasoning written down beside both.

### github-app

**Term:** GitHub App

**Kind:** concept

**Area:** identity

The shared GitHub identity the platform acts through to create application repositories, seed variables, and register runners.

### github-runners

**Term:** GitHub Runners

**Kind:** concept

**Area:** network

Private runners inside a landing zone's network, giving workflows a path to data-plane endpoints closed to the public internet.

### github-variable

**Term:** GitHub Variable

**Kind:** concept

**Area:** deployment

A configuration value the platform reads at deployment time, defined in the repository and recreated by BigBang.

### identity

**Term:** Identity

**Kind:** area

Who and what authenticates, and what they are permitted to act on.

### landing-zone

**Term:** Landing Zone

**Kind:** concept

**Area:** resource-organization

An isolated Azure environment handed to an application team, which operates it independently from that point.

### log-analytics-workspace

**Term:** Log Analytics Workspace

**Kind:** concept

**Area:** monitoring

A landing zone's own telemetry store, unshared so ingestion cost stays with the team that generates it.

### managed-identity

**Term:** Managed Identity

**Kind:** concept

**Area:** identity

The single identity a landing zone acts through, shared across its workflows, jobs, and service integrations.

### monitoring

**Term:** Monitoring

**Kind:** area

How the platform emits telemetry and routes what it observes.

### network

**Term:** Network

**Kind:** area

The landing zone's network boundary and the paths into it.

### oasis

**Term:** Oasis

**Kind:** concept

**Area:** resource-organization

Gazelle's management group tier and naming stem: oases-prod, oases-test, and the oases-{app}-{env} landing zones beneath them.

### platform-member

**Term:** Platform Member

**Kind:** concept

**Area:** resource-organization

An application registered with the platform, represented by one file under platform-members/.

### policy-assignment

**Term:** Policy Assignment

**Kind:** concept

**Area:** security

An Azure Policy applied at a scope, named for the effect it carries.

### promote

**Term:** Promote

**Kind:** concept

Moving a platform change from the test environment to production after it passed there.

### provision

**Term:** Provision

**Kind:** concept

Drawing a subscription from the Subscription Bank and handing an application team an isolated environment they operate themselves.

### redeploy

**Term:** Redeploy

**Kind:** concept

Running a landing zone's stack again so its Azure state matches the parameter file.

### register

**Term:** Register

**Kind:** concept

Creating an application's platform member profile, Entra ID group, billing scope, and repository.

### resource-group

**Term:** Resource Group

**Kind:** concept

**Area:** resource-organization

The single dedicated container for a landing zone's platform-managed resources, separate from application resources.

### resource-organization

**Term:** Resource Organization

**Kind:** area

How subscriptions, groups, and hierarchy are arranged.

### resource-type

**Term:** Resource Type

**Kind:** concept

**Area:** security

An ARM resource type, available to landing zones once it is present on the allowed list.

### security

**Term:** Security

**Kind:** area

The controls that constrain what can be built.

### self-service

**Term:** Self-service

**Kind:** concept

**Area:** security

An application team changing its own landing zone through a pull request, with no platform team action in between.

### subscription-bank

**Term:** Subscription Bank

**Kind:** concept

**Area:** resource-organization

A holding management group for empty subscriptions, drawn from when a landing zone is provisioned and returned to when one is sunset.

### subscription

**Term:** Subscription

**Kind:** concept

**Area:** resource-organization

The billing and isolation boundary a landing zone occupies.

### tag

**Term:** Tag

**Kind:** concept

**Area:** resource-organization

A key and value applied to a subscription or resource, sourced from the platform member profile.

### test-environment

**Term:** Test Environment

**Kind:** concept

**Area:** deployment

The platform's non-production hierarchy, holding every capability in the same shape production holds it.

### trusted-public-ip

**Term:** Trusted Public IP

**Kind:** concept

**Area:** network

The single platform-held source address permitted to reach landing zone data-plane endpoints from outside Azure.

### virtual-network

**Term:** VNet

**Kind:** concept

**Area:** network

A landing zone's isolated network boundary. The platform declares it, the application team owns its subnets.

### workflow

**Term:** Workflow

**Kind:** concept

**Area:** deployment

A GitHub Actions workflow, either a reusable template holding deployment logic or a thin trigger that supplies its inputs.

### you-get-what-you-see

**Term:** You get what you see

**Kind:** concept

**Area:** deployment

Declarative deployment: the Azure state matches the code, and what left the code has left Azure.

## Foundations

### no-fixed-cost

Every platform component is free; if it can't be, it must be consumption-based — never a flat cost.

**Violations:**

- Platform-provisioned service with a fixed monthly cost adopted.
- Applying no-fixed-cost constraints to application team.

### no-human-touch

BigBang initializes the platform. After that, code is the only path to production — proof it can always be rebuilt from scratch.

**Violations:**

- Configuration value set manually instead of sourced from the repo.
- Deployment that bypasses the branch-gated promotion flow.

### no-platform-ops

The platform grows more self-sufficient, landing zones take on more ownership, and the platform team becomes less and less necessary.

**Violations:**

- Platform team operating resources inside a landing zone on behalf of the application team.

### no-unapproved-resources

The allowed list starts empty. A resource type joins the platform only after its security controls, telemetry, and integration patterns are in place — once it is, app teams can use it freely within the boundaries Azure Policy guarantees.

**Violations:**

- Resource type added to the allowed list before Deny policies and diagnostic settings are wired.

## Constitutive

### application-teams-own-the-cost

**Subject:** subscription (entity)

A subscription counts as owned by an application when it bills to that application's invoice section.

**Why:** Without it, attribution falls back to tags, which is less precise and requires allocation logic to run.

**Anchor:** no-fixed-cost

**Links:**

- depends-on → landing-zone-platform-members — The invoice section is created when the application joins the platform, so billing has no scope before that.

**Violations:**

- Cost attributed through tags rather than invoice section isolation.
- Subscription billing to a shared invoice section.

**Files:**

- `githubVariables.json`
- `.github/workflows/template-new-platform-members.yml`
- `.github/workflows/template-landing-zones.yml`

### azure-native-services-only

**Subject:** azure-service (entity)

A service counts as adoptable when it is reachable through Azure Resource Manager.

**Why:** If a service isn't manageable through ARM, the platform cannot guarantee service integrity.

**Anchor:** no-unapproved-resources

**Violations:**

- Service adopted with no ARM resource representation, leaving it invisible to Policy, RBAC, and diagnostics.

**Files:**

- `platform-management/policy/parameters/oases/allowedResources.json`

### azure-policy-allowed-resources

**Subject:** resource-type (entity)

A resource type counts as permitted when it appears on the allowed list; the absence of a deny grants nothing.

**Why:** Without an exhaustive list, a type reaches production because nobody wrote a rule against it.

**Anchor:** no-unapproved-resources

**Links:**

- depends-on → azure-native-services-only — ARM reachability is the prerequisite for listing, so types outside ARM are ineligible.
- depends-on → azure-policy-hard-deny — A type is listable once deny policies cover its misconfigurations, which the list assumes.

**Violations:**

- Resource type deployed because no policy denied it rather than because the list permitted it.
- Entry added to the allowed resources file before its deny policies and diagnostic settings exist.

**Files:**

- `platform-management/policy/parameters/oases/allowedResources.json`
- `platform-management/policy/bicep/oases.bicep`

### azure-policy-hard-deny

**Subject:** policy-assignment (entity)

A security control counts as enforced when a policy assignment denies the violation at deployment time.

**Why:** Without deny policies, resources deploy in a non-compliant state, deviating from the security baseline.

**Anchor:** no-unapproved-resources

**Violations:**

- Control carried by an Audit effect and reported as enforced.
- Resource deployed with public network access, local authentication, or TLS below 1.2 because no assignment denied it.

**Files:**

- `platform-management/policy/parameters/oases/*.json`
- `platform-management/policy/bicep/oases.bicep`

### bigbang

**Subject:** bigbang (entity)

The platform counts as reproducible when BigBang can rebuild it from the repository alone.

**Why:** Without a rebuild path the platform's real state lives in Azure rather than in code, and nothing proves the two agree.

**Anchor:** no-human-touch

**Links:**

- depends-on → deployment-config-in-repo — BigBang recreates GitHub environments, so every value it needs is already committed to the repo.

**Violations:**

- Platform state that survives because nobody has torn it down.
- Initialization step performed by hand and not represented in the BigBang workflow.

**Files:**

- `.github/workflows/platform-BigBang.yml`

### deployment-branch-gated-promotion

**Subject:** promote (process)

A platform change counts as promoted when it has passed the test environment on its way to production.

**Why:** Without an enforced gate, a single push can change production infrastructure with no prior validation.

**Anchor:** no-human-touch

**Links:**

- depends-on → platform-test-environment — The gate has no target to validate against without the test environment.

**Violations:**

- Workflow deploying to prod from a non-main branch.
- Production change with no corresponding test deployment.

**Files:**

- `.github/workflows/platform-Azure-Policy.yml`
- `.github/workflows/platform-access-control.yml`
- `.github/workflows/platform-Management-Groups.yml`
- `.github/workflows/platform-automation.yml`

### deployment-config-in-repo

**Subject:** github-variable (entity)

A value counts as platform configuration when it is defined in the repository.

**Why:** BigBang destroys and recreates GitHub environments, so configuration held outside the repo cannot be reproduced.

**Anchor:** no-human-touch

**Violations:**

- GitHub variable created in the UI.
- Bicep parameter with a hardcoded tenant ID or location instead of readEnvironmentVariable().

**Files:**

- `githubVariables.json`

### deployment-declarative-lifecycle

**Subject:** deployment-stack (entity)

A resource counts as declared when the deployment stack's code defines it; what is not declared is deleted on the next deployment.

**Why:** Without this, resources removed from the stack's code persist in Azure and the code stops being the source of truth.

**Anchor:** no-human-touch

**Violations:**

- Deployment Stack configured with detachAll, leaving removed resources with no cleanup path.
- Resource created directly in Azure and left outside the stack.

**Files:**

- `.github/workflows/template-landing-zones.yml`
- `.github/workflows/template-access-control.yml`
- `.github/workflows/template-Azure-Policy.yml`
- `.github/workflows/template-Management-Groups.yml`

### job-function-scoped-roles

**Subject:** entra-id-group (entity)

Access counts as granted when a role scoped to a job function is assigned to the application's Entra ID group.

**Why:** Without job-function scoping, every new allowed resource type forces team re-onboarding.

**Anchor:** no-platform-ops

**Links:**

- depends-on → landing-zone-platform-members — Joining the platform creates the Entra ID group that roles target.

**Violations:**

- Custom role with wildcard write permissions.
- Role scoped to a resource type rather than a job function.

**Files:**

- `platform-management/access-control/parameters/accessControl.bicepparam`
- `platform-management/access-control/bicep/modules/customRoleDefinitions.bicep`

### landing-zone-lifecycle

**Subject:** subscription-bank (entity)

A subscription counts as available when it sits empty in the Subscription Bank, and it returns there when a landing zone is sunset.

**Why:** The Azure subscription limit counts cancelled subscriptions the same as active ones, so quota is not released by cancelling.

**Anchor:** no-platform-ops

**Links:**

- depends-on → application-teams-own-the-cost — A reused subscription moves to the application's invoice section before provisioning completes.

**Violations:**

- New subscription created while the bank held an available empty one.
- Sunset subscription cancelled rather than returned to the bank.

**Files:**

- `.github/workflows/template-landing-zones.yml`
- `.github/workflows/template-destroy-landing-zone.yml`
- `githubVariables.json`

### landing-zone-ownership

**Subject:** landing-zone (entity)

A resource counts as platform-managed when the landing zone template declares it.

**Why:** Without a declared boundary, application teams cannot act in their own subscription without checking with the platform first.

**Anchor:** no-platform-ops

**Links:**

- depends-on → deployment-declarative-lifecycle — The boundary relies on stack deletion to remove platform-declared resources once they leave the code.

**Violations:**

- Management lock on a platform-managed resource preventing Deployment Stack teardown.
- Platform team operating a resource the template does not declare.

**Files:**

- `landing-zones/bicep/main.bicep`
- `.github/workflows/template-landing-zones.yml`

### landing-zone-platform-members

**Subject:** platform-member (entity)

An application counts as a platform member when it has an Entra ID group, an invoice section, and a repository.

**Why:** Without a platform member profile, the platform has no application to provision landing zones for.

**Anchor:** no-platform-ops

**Links:**

- depends-on → landing-zone-repo — The identifiers created during registration are written as variables on the application repo.

**Violations:**

- Landing zone provisioned for an application with no member file.
- Landing zone bicepparam with a hardcoded owner or engineer email.

**Files:**

- `platform-members/template.json`
- `.github/workflows/requestNew-Platform-Members.yml`
- `.github/workflows/template-new-platform-members.yml`

### landing-zone-repo

**Subject:** application-repo (entity)

An application's repository counts as its control plane: every landing zone it owns is deployed and configured from there.

**Why:** Without a repo, the platform has no deployment mechanism and nowhere to write configuration for the application.

**Anchor:** no-platform-ops

**Violations:**

- Bring-your-own-repo for landing zone creation.
- Landing zone configuration held outside the application repo.

**Files:**

- `.github/workflows/template-new-platform-members.yml`

### platform-test-environment

**Subject:** test-environment (entity)

An environment counts as the test environment when every platform capability exists in it exactly as it does in production.

**Why:** If the copy differs from production, a change that passes there can still break production.

**Anchor:** no-human-touch

**Violations:**

- Application landing zone created in the platform's test environment.
- Capability present in production and absent from test.

**Files:**

- `.github/workflows/platform-Azure-Policy.yml`
- `.github/workflows/platform-access-control.yml`
- `.github/workflows/platform-Management-Groups.yml`
- `.github/workflows/platform-automation.yml`
- `.github/workflows/platform-BigBang.yml`

### self-service-policy-exemptions

**Subject:** exemption (entity)

An exemption counts as granted when a pull request against the landing zone's parameter file has merged.

**Why:** A deny policy without an exemption path gets worked around rather than enforced, as teams find other routes when blocked.

**Anchor:** no-unapproved-resources

**Violations:**

- Exemption applied in the portal rather than through a merged pull request.
- Exemption description that does not name the reason for the exemption.

**Files:**

- `landing-zones/bicep/modules/base/policyExemption.bicep`
- `landing-zones/bicep/modules/azurePolicy.bicep`
- `landing-zones/managementGroup-AppName-environment.bicepparam`

## Regulative

### add-automation-job

**Subject:** deploy (process)

A new automation job must run as the landing zone identity, against the ARM API, from a publicly pullable image.

**Why:** A job needing its own identity, a data-plane path, or an authenticated base image cannot run unattended in every landing zone.

**Anchor:** no-platform-ops

**Trigger:**

- add automation job
- recurring platform task
- automate remediation

**Workflow:** platform-automation

**Steps:**

1. Read the rules this process is governed by, to understand access, identity, and image constraints before writing any code.
2. Implement the job logic under landing-zones/automation/, using the ARM API alone with no data-plane or VNet-dependent calls.
3. Add a Dockerfile whose base image is pullable from a public registry without authentication.
4. Register the job in landing-zones/bicep/modules/landingzone-automation.bicep, following the existing job definition pattern.
5. Verify the job authenticates as the landing zone identity, with no separate identity or secret.
6. Present a complete draft of all changes before implementing.

**Links:**

- governed-by → landing-zone-automation
- governed-by → platform-exemptions-automation
- governed-by → landing-zone-identity

**Violations:**

- Automation job authenticating with its own secret instead of the landing zone identity.
- Job image hosted in a registry requiring authentication.

**Files:**

- `landing-zones/automation/`
- `landing-zones/bicep/modules/landingzone-automation.bicep`

### allow-resource-type

**Subject:** approve (process)

A resource type must clear deny coverage, diagnostic settings, and job-function role review before it joins the allowed list.

**Why:** A type listed ahead of its controls is available to every landing zone with nothing enforcing how it is configured.

**Anchor:** no-unapproved-resources

**Implements:**

- azure-policy-allowed-resources

**Trigger:**

- allow resource type
- approve resource type
- add resource to allowed list

**Workflow:** platform-Azure-Policy

**Steps:**

1. Read the rules this process is governed by.
2. Add the resource type to allowedResources.json.
3. Find the built-in diagnostic settings policy and add it to diagnosticSettings.bicepparam.
4. For each file in oases/, find built-in policies with the required effect and add matching entries.
5. For each gap where no built-in provides the required effect, author a custom definition and register it in policyDefinitions.bicepparam.
6. Check defenderForCloudExemptions.jsonc for paid-SKU recommendations specific to this resource type.
7. Check accessControl.bicepparam for custom role actions needed by this resource type.
8. Present a complete draft of all changes before implementing.

**Links:**

- governed-by → azure-policy-hard-deny
- governed-by → landing-zone-diagnostic-settings
- governed-by → azure-policy-custom-definition
- governed-by → self-service-policy-exemptions-defender-for-cloud
- governed-by → job-function-scoped-roles

**Violations:**

- Entry added to allowedResources.json before its deny policies were reviewed.
- Resource type listed with no diagnostic settings definition.

**Files:**

- `platform-management/policy/parameters/oases/`
- `platform-management/policy/parameters/diagnosticSettings.bicepparam`
- `platform-management/policy/parameters/customDefinitions/`

### azure-policy-custom-definition

**Subject:** custom-definition (entity)

Every Deny or DeployIfNotExists gap with no built-in policy must be closed by a custom definition.

**Why:** Without custom policies, Audit-only coverage looks like enforcement but the violation still occurs.

**Anchor:** no-unapproved-resources

**Implements:**

- azure-policy-hard-deny

**Links:**

- depends-on → azure-policy-naming-convention — The effect a custom definition carries determines the prefix its assignment takes.

**Violations:**

- Resource type listed with a known Deny gap and no custom definition to close it.

**Files:**

- `platform-management/policy/bicep/customPolicyDefinitions.bicep`
- `platform-management/policy/parameters/customDefinitions/policyDefinitions.bicepparam`
- `platform-management/policy/parameters/customDefinitions/*.json`

### azure-policy-naming-convention

**Subject:** policy-assignment (entity)

A policy assignment name must begin with its effect prefix, deny, config, or allowed, followed by the requirement name.

**Why:** Without an effect prefix, reading an assignment name does not tell you whether it denies, configures, or allows.

**Anchor:** no-unapproved-resources

**Implements:**

- azure-policy-hard-deny
- azure-policy-allowed-resources

**Violations:**

- Effect prefix outside deny, config, or allowed.
- Two policy names sharing their first 24 characters, so both assignments resolve to one truncated name.

**Files:**

- `platform-management/policy/bicep/oases.bicep`
- `platform-management/policy/bicep/modules/assignment.bicep`

### azure-policy-reference

**Subject:** exemption (entity)

An exemption must resolve its assignment ID through the platform-generated reference file, not a literal ARM ID.

**Why:** A hardcoded assignment ID silently breaks every exemption when the platform redeploys.

**Anchor:** no-unapproved-resources

**Implements:**

- self-service-policy-exemptions

**Links:**

- depends-on → azure-policy-naming-convention — The reference file is indexed by assignment name, so the name stays stable across redeployments.

**Violations:**

- Manually editing policy-assignment-reference.json.
- Exemption naming an assignment with a literal string instead of resolving it through the loaded reference.

**Files:**

- `.github/workflows/lz-flow-create-policy-exemption.yml`
- `landing-zones/*/policy-assignment-reference.json`
- `.github/utils/get-policyAssignmentsReference.ps1`

### create-landing-zone

**Subject:** provision (process)

A landing zone must be provisioned through requestNew-Landing-Zone, and for a registered platform member.

**Why:** Provisioning outside the workflow leaves the subscription unaccounted for in the bank and off the application invoice section.

**Anchor:** no-platform-ops

**Implements:**

- landing-zone-lifecycle

**Trigger:**

- create landing zone
- provision environment
- new environment
- add azure subscription

**Workflow:** requestNew-Landing-Zone

**Steps:**

1. Confirm the application file exists under platform-members/. If not, register-platform-member completes first.
2. Collect from the user: application name, environment (test or prod), management group name (oases-prod or oases-test), and budget (optional, default 100).
3. Auto-select the subscription ID: az account management-group subscription show-sub-under-mg --name subscription-bank --query "[0].name" -o tsv
4. Confirm the values with the user, including the auto-selected subscription ID, then trigger the workflow, which raises a pull request.
5. A platform engineer reviews and approves the pull request, and that approval triggers the automation to complete provisioning.

**Links:**

- depends-on → register-platform-member — Provisioning has no application to target until the member profile, group, and billing scope exist.
- governed-by → application-teams-own-the-cost
- governed-by → landing-zone-ipam
- governed-by → landing-zone-template
- governed-by → deployment-branch-gated-promotion

**Violations:**

- Landing zone provisioned for an application with no platform member file.
- Subscription created new while the bank held an empty one.

**Files:**

- `platform-members/`
- `.github/workflows/requestNew-Landing-Zone.yml`

### deployment-logic-reusable-workflow

**Subject:** workflow (entity)

Deployment logic must live in a reusable workflow; an environment workflow supplies inputs and nothing more.

**Why:** Without reuse, a fix to deployment logic has to be repeated in every environment workflow, and environments drift apart.

**Anchor:** no-human-touch

**Implements:**

- platform-test-environment

**Violations:**

- Deployment steps duplicated in an environment workflow instead of called from a template.

**Files:**

- `.github/workflows/template-landing-zones.yml`
- `.github/workflows/template-Azure-Policy.yml`
- `.github/workflows/template-access-control.yml`
- `.github/workflows/template-Management-Groups.yml`
- `.github/workflows/template-lz-template.yml`

### destroy-landing-zone

**Subject:** destroy (process)

A landing zone must be decommissioned through lz-flow-destroy-landing-zone, which returns its subscription to the bank.

**Why:** Deleting resources by hand cancels the subscription instead of returning it, and the quota is not released.

**Anchor:** no-platform-ops

**Implements:**

- landing-zone-lifecycle

**Trigger:**

- destroy landing zone
- decommission landing zone
- sunset environment

**Workflow:** lz-flow-destroy-landing-zone

**Steps:**

1. Read the rules this process is governed by, to understand what is being destroyed and what constraints apply.
2. Collect from the user: subscription ID of the landing zone to decommission.
3. Verify the bicepparam file and the lz-oasis-{appName}-{env} workflow both exist. Stop if either is missing.
4. Present what will be permanently destroyed: deployment stack, resource groups, role assignments, budget, Defender settings. Confirm the subscription returns to the bank. Wait for explicit confirmation.
5. Trigger lz-flow-destroy-landing-zone via workflow_dispatch with the subscription ID. Leave the file deletions to the workflow.

**Links:**

- governed-by → deployment-declarative-lifecycle
- governed-by → application-teams-own-the-cost

**Violations:**

- Landing zone resources deleted by hand instead of through the workflow.
- Subscription cancelled rather than returned to the bank.

**Files:**

- `landing-zones/oases-prod/`
- `.github/workflows/`

### knowledge-candidate

**Subject:** curate (process)

An observation that does not fit as a rule, a link, or a violation must be recorded as a knowledge-candidate issue rather than forced into the graph.

**Why:** Forcing an observation into a node shape produces an entry that passes review but gives no signal when the system drifts.

**Anchor:** no-human-touch

**Trigger:**

- knowledge that doesn't fit the graph
- pattern across decisions
- explanatory context without a dependency

**Workflow:** validate-knowledge-graph

**Steps:**

1. Confirm the observation does not fit as a rule, a link, or a violation. If it does, update-knowledge-base is the process instead.
2. Draft the issue title and body. The title names the observation, and the body states the insight and references related entry ids.
3. Present the draft for confirmation.
4. Create the issue with the knowledge-candidate label.

**Links:**

- depends-on → update-knowledge-base — An observation reaches this path after that process establishes it does not fit the graph as an entry.

**Violations:**

- Issue created without confirmation.
- Observation recorded as a candidate when it is actually a missing rule or link.

### landing-zone-action-group

**Subject:** action-group (entity)

Alerts must route through the landing zone's action group, addressed from the platform member profile rather than to a person.

**Why:** Hardcoded contacts go stale, so alerts fire to former members and incidents go unanswered.

**Anchor:** no-platform-ops

**Implements:**

- landing-zone-platform-members

**Violations:**

- Budget alert without an action group.
- Action group holding a hand-typed email address.

**Files:**

- `landing-zones/bicep/modules/base/actionGroup.bicep`
- `landing-zones/bicep/modules/base/budget.bicep`
- `landing-zones/bicep/modules/monitor.bicep`

### landing-zone-allowed-public-ip

**Subject:** trusted-public-ip (entity)

Data-plane access from outside Azure must originate from the platform-trusted public IP.

**Why:** Without a trusted source address, application teams cannot reach Azure data-plane resources from their laptops.

**Anchor:** no-platform-ops

**Implements:**

- deployment-config-in-repo

**Violations:**

- Platform configuring PaaS firewall rules on behalf of the application team.
- IP address hardcoded in an application pipeline instead of read from the platform variable.

**Files:**

- `githubVariables.json`

### landing-zone-automation

**Subject:** automation-job (entity)

Automation jobs must run inside the landing zone's own subscription.

**Why:** Without isolation, all landing zones would share a runtime the platform has no subscription to host.

**Anchor:** no-fixed-cost

**Links:**

- depends-on → platform-identity-graph — Jobs query Entra ID, so the Graph read permissions are what make that call possible.

**Violations:**

- Automation job running from a resource outside the landing zone subscription.

**Files:**

- `landing-zones/bicep/modules/landingzone-automation.bicep`
- `landing-zones/bicep/modules/base/jobs-cron.bicep`
- `landing-zones/bicep/modules/base/managedEnvironments.bicep`

### landing-zone-diagnostic-settings

**Subject:** diagnostic-settings (entity)

Diagnostic settings must be defined by the platform; a landing zone declares none of its own.

**Why:** Without a platform definition, each landing zone routes logs differently and some resources emit none.

**Anchor:** no-platform-ops

**Implements:**

- azure-policy-allowed-resources

**Links:**

- depends-on → landing-zone-automation — Resources that already exist are brought into line when the remediation job runs in the landing zone.

**Violations:**

- Resource type added to allowedResources.json without a diagnostic settings definition.
- Landing zone declaring its own diagnostic setting.

**Files:**

- `platform-management/policy/parameters/diagnosticSettings.bicepparam`
- `platform-management/policy/bicep/configDiagnosticSettings.bicep`
- `landing-zones/bicep/modules/azurePolicy.bicep`

### landing-zone-getting-started

**Subject:** application-repo (entity)

An application repo must be seeded with deployable pipelines and modules from the template at creation.

**Why:** Without them, teams reverse-engineer platform patterns before they can deploy anything.

**Anchor:** no-platform-ops

**Implements:**

- landing-zone-repo

**Violations:**

- Module template customized for a specific application instead of generic.
- Repo created without pipelines, leaving the team no deployment path.

**Files:**

- `.github/workflows/template-new-platform-members.yml`

### landing-zone-github-runners

**Subject:** github-runners (entity)

Every landing zone must have its own private GitHub runners provisioned inside its VNet.

**Why:** Public runners have no network path to the PaaS data plane once public access is denied.

**Anchor:** no-platform-ops

**Implements:**

- azure-policy-hard-deny

**Links:**

- depends-on → platform-identity-github — Runner registration needs the GitHub App, as no other identity can register runners to a repo.

**Violations:**

- Application team using a separate VNet for runner integration.
- Runner label implying capability differences instead of network accessibility.

**Files:**

- `landing-zones/bicep/modules/base/virtualNetwork.bicep`
- `.github/utils/create-landingzone-gh-runners.ps1`
- `.github/workflows/template-landing-zones.yml`

### landing-zone-identity

**Subject:** managed-identity (entity)

A landing zone must have a single managed identity, shared across all its workflows, jobs, and service integrations.

**Why:** Without a single identity, every new capability multiplies the permission surface through RBAC and OIDC sprawl.

**Anchor:** no-platform-ops

**Links:**

- depends-on → landing-zone-repo — OIDC federation is scoped to the landing zone repo and environment.

**Violations:**

- Managed identity shared across multiple landing zones.
- Second identity introduced for a new capability.

**Files:**

- `landing-zones/bicep/modules/identity.bicep`
- `landing-zones/bicep/modules/base/appRoleAssignedTo.bicep`

### landing-zone-ipam

**Subject:** virtual-network (entity)

VNet address spaces must be allocated by querying live Azure, not by reading an assignment registry.

**Why:** Without querying live state, address allocations drift and VNets cannot peer.

**Anchor:** no-platform-ops

**Violations:**

- VNet with a manually assigned address space.
- Allocation recorded in a registry file and trusted without a live check.

**Files:**

- `githubVariables.json`
- `.github/workflows/template-calculate-vnet-address-space.yml`
- `landing-zones/managementGroup-AppName-environment.bicepparam`

### landing-zone-monitoring

**Subject:** log-analytics-workspace (entity)

A landing zone must not share a Log Analytics Workspace with another landing zone.

**Why:** A shared workspace merges ingestion costs across landing zones, which breaks the cost ownership model.

**Anchor:** no-platform-ops

**Implements:**

- application-teams-own-the-cost

**Links:**

- depends-on → landing-zone-diagnostic-settings — Without diagnostic settings the workspace is provisioned with no telemetry pipeline to fill it.

**Violations:**

- Centralized Log Analytics workspace for general purpose logs.

**Files:**

- `landing-zones/bicep/modules/monitor.bicep`
- `landing-zones/bicep/modules/base/logAnalyticsWorkspace.bicep`
- `landing-zones/bicep/modules/base/ActivityLogAlerts.bicep`

### landing-zone-resource-group

**Subject:** resource-group (entity)

Platform-managed landing zone resources must live in a single dedicated resource group, separate from application resources.

**Why:** Without a dedicated group, platform resources mix with application resources and teams cannot tell which are theirs.

**Anchor:** no-platform-ops

**Implements:**

- landing-zone-ownership

**Violations:**

- Platform resource deployed into an application-owned resource group.
- Second platform-managed resource group created in a landing zone.

**Files:**

- `landing-zones/bicep/main.bicep`

### landing-zone-tags

**Subject:** tag (entity)

Tag values on a landing zone must be sourced from the platform member profile.

**Why:** Hand-typed tags drift from the member profile, so a resource stops showing who actually owns it.

**Anchor:** no-platform-ops

**Implements:**

- landing-zone-platform-members

**Links:**

- depends-on → landing-zone-automation — Tag remediation has no runtime without the automation capability.

**Violations:**

- Tag introduced that does not apply to all application landing zones.
- ownerEmail or engineerEmail hardcoded instead of read from the profile.

**Files:**

- `landing-zones/bicep/modules/azurePolicy.bicep`
- `landing-zones/managementGroup-AppName-environment.bicepparam`

### landing-zone-template

**Subject:** landing-zone (entity)

Each landing zone must have its own parameter file and its own trigger workflow.

**Why:** A shared trigger means acting on one landing zone risks redeploying another team.

**Anchor:** no-human-touch

**Implements:**

- landing-zone-repo

**Links:**

- depends-on → deployment-logic-reusable-workflow — Per landing zone triggers share centralized deployment logic through the reusable workflow.
- depends-on → platform-identity-azure — The app registration's credentials are what let the template deploy landing zone resources.

**Violations:**

- Generated workflow name not matching the lz-* prefix, which breaks fan-out discovery.
- One parameter file covering more than one landing zone.

**Files:**

- `landing-zones/managementGroup-AppName-environment.bicepparam`
- `.github/workflows/template-lz-template.yml`
- `.github/workflows/requestNew-Landing-Zone.yml`

### platform-break-glass

**Subject:** break-glass (entity)

Break-glass must be used only where automation cannot execute the change.

**Why:** An unrestricted role with no usage boundary becomes the fast path, and the repository stops being the record.

**Anchor:** no-human-touch

**Links:**

- depends-on → deployment-declarative-lifecycle — Stack deny assignments override role actions, so break-glass reaches platform resources by being excluded from them.
- depends-on → azure-policy-hard-deny — Policy denies apply regardless of role actions, so break-glass cannot deploy an unapproved resource type.

**Violations:**

- Break-glass used for a change a pull request could have made.

**Files:**

- `platform-management/access-control/parameters/accessControl.bicepparam`
- `platform-management/access-control/bicep/accessControl.bicep`
- `.github/workflows/template-landing-zones.yml`

### platform-exemptions-automation

**Subject:** automation-job (entity)

Platform automation Docker images must be hosted outside the landing zones.

**Why:** Without an external registry, each landing zone needs persistent image hosting, adding always-on cost before any workload exists.

**Anchor:** no-fixed-cost

**Links:**

- constrains → azure-native-services-only — GitHub Container Registry sits outside ARM, so it is a dependency the platform consumes rather than a service it adopts.

**Violations:**

- Automation image pulled from a registry the platform pays to host.
- Registry provisioned inside a landing zone to host platform images.

**Files:**

- `landing-zones/bicep/modules/landingzone-automation.bicep`
- `landing-zones/bicep/modules/base/jobs-cron.bicep`

### platform-identity-azure

**Subject:** app-registration (entity)

The platform must authenticate through an app registration rather than a managed identity.

**Why:** The platform has no subscription of its own in which to host a managed identity.

**Anchor:** no-human-touch

**Links:**

- depends-on → deployment-config-in-repo — The registration has a distinct client ID per environment, and each appears as a committed variable.

**Violations:**

- Platform app registration shared with non-platform workloads.

**Files:**

- `githubVariables.json`
- `landing-zones/bicep/modules/identity.bicep`

### platform-identity-claude

**Subject:** agentic-workflow (entity)

Agentic workflows must authenticate with the Claude Pro OAuth token.

**Why:** Without the token, every agentic workflow requires a paid API key.

**Anchor:** no-human-touch

**Violations:**

- Agentic workflow step using ANTHROPIC_API_KEY instead of CLAUDE_CODE_OAUTH_TOKEN.

**Files:**

- `.github/workflows/validate-knowledge-graph.yml`

### platform-identity-github

**Subject:** github-app (entity)

Platform and landing zone workflows must authenticate to GitHub through the shared GitHub App.

**Why:** Without a shared GitHub App, the platform has no mechanism to provision and configure application repos and environments.

**Anchor:** no-human-touch

**Violations:**

- GITHUB_TOKEN used to write org-level variables or trigger other workflows.

**Files:**

- `githubVariables.json`
- `.github/workflows/template-landing-zones.yml`

### platform-identity-graph

**Subject:** managed-identity (entity)

A landing zone identity must hold granular Microsoft Graph read permissions and no broad directory access.

**Why:** Without them, applications cannot resolve tenant identities, so user lookup and group-based authorization fail.

**Anchor:** no-platform-ops

**Links:**

- depends-on → landing-zone-identity — One shared identity per landing zone is what makes a single permission grant cover every workload in it.

**Violations:**

- Landing zone identity granted write permissions to Microsoft Graph.
- Landing zone identity granted Directory.Read.All instead of granular read permissions.

**Files:**

- `landing-zones/bicep/entra.bicep`
- `landing-zones/bicep/modules/base/appRoleAssignedTo.bicep`

### register-platform-member

**Subject:** register (process)

An application must be registered through requestNew-Platform-Members before any landing zone is provisioned for it.

**Why:** Without the profile there is no Entra ID group, invoice section, or repo for a landing zone to attach to.

**Anchor:** no-platform-ops

**Implements:**

- landing-zone-platform-members

**Trigger:**

- register application
- new application team
- onboard team
- new team
- add application
- platform member
- join the platform

**Workflow:** requestNew-Platform-Members

**Steps:**

1. Collect from the user: application name, owner email, and engineer email.
2. Confirm the values with the user, then trigger the workflow, which raises a pull request creating platform-members/{AppName}.json.
3. A platform engineer reviews and approves the pull request, and that approval provisions the application repo, Entra group, billing scope, and repository variables.

**Violations:**

- Platform member file created by hand instead of through the workflow.

**Files:**

- `platform-members/`
- `.github/workflows/requestNew-Platform-Members.yml`

### self-service-policy-exemptions-defender-for-cloud

**Subject:** exemption (entity)

Defender for Cloud recommendations with no free remediation path must be pre-exempted by the platform.

**Why:** An unactionable recommendation left on the dashboard erodes confidence in the rest of the data.

**Anchor:** no-unapproved-resources

**Implements:**

- self-service-policy-exemptions
- application-teams-own-the-cost

**Violations:**

- Defender for Cloud exemption list containing a recommendation with a free remediation path.

**Files:**

- `landing-zones/defenderForCloudExemptions.jsonc`
- `landing-zones/bicep/modules/azurePolicy.bicep`

### update-knowledge-base

**Subject:** curate (process)

A knowledge graph entry must be drafted and presented before any file is written, and must reach main through a pull request.

**Why:** An entry written without review enters the graph unchallenged, and the graph is what every later change is read against.

**Anchor:** no-human-touch

**Trigger:**

- add a decision
- update a decision
- add an operation
- update an operation
- refine reasoning
- add a link
- update knowledge graph

**Workflow:** validate-knowledge-graph

**Steps:**

1. Identify whether this is a new entry or an update to an existing one. For an update, read the existing file first.
2. Determine the type: vocabulary, constitutive, or regulative. Constitutive states what counts as something; regulative states what has to happen inside that.
3. Draft the entry. The id matches the filename, the subject names a vocabulary term, the anchor names a foundation, and the why states the consequence of ignoring the rule rather than restating it.
4. For links: add one where the source is incomplete without the target, and let the note say which source behaviour relies on which target constraint, fact, or output. Drop it if the relationship is obvious from context alone.
5. For a regulative rule, name the constitutive rules it upholds in implements[]. An empty array is legal where the rule serves its foundation directly.
6. Present the complete draft before writing any file.
7. Write the file.
8. Open a pull request. Validation runs on changed entries, and the pull request cannot merge until it passes.

**Violations:**

- File written before a draft was presented.
- Link added in both directions between two entries.
- Violation that restates the rule instead of describing a detectable breach.

**Files:**

- `knowledge-graph/vocabulary/`
- `knowledge-graph/constitutive/`
- `knowledge-graph/regulative/`
- `knowledge-graph/schema/`

### update-landing-zone

**Subject:** redeploy (process)

A landing zone must be reshaped by editing its parameter file and merging a pull request, which redeploys the stack.

**Why:** An out-of-band edit is removed on the next deployment, because the stack deletes what the code no longer declares.

**Anchor:** no-platform-ops

**Implements:**

- self-service-policy-exemptions

**Trigger:**

- temporary policy exemption
- policy exclusion
- update budget
- cost alert

**Workflow:** lz-oasis-{appName}-{env}

**Steps:**

1. Read the rules this process is governed by, to understand the constraints on tags, budget, and exemptions.
2. Verify the landing zone exists: the bicepparam file and the lz-oasis-{appName}-{env} workflow. If either is missing this is a create-landing-zone task.
3. Collect from the user the app and environment to manage, and which concern to change: cost, tags, or exemptions.
4. Cost: edit the single budget value. The budget drives one forecasted alert, so additional thresholds are out of scope.
5. Tags: edit subscriptionLevelTags and resourceLevelTags keys and placement. Keep ownerEmail and engineerEmail as readEnvironmentVariable references, and keep ownerEmail at subscription level.
6. Exemptions: ask whether the exemption is temporary or long-lived. Temporary triggers lz-flow-create-policy-exemption with an 8-hour expiry. Long-lived adds an entry to the exemptions array referencing a policy-assignment-reference.json key.
7. Present a complete draft of the bicepparam change before implementing.
8. Open a pull request. The merge redeploys the landing zone stack with deleteAll.

**Links:**

- depends-on → create-landing-zone — There is no parameter file to edit until the landing zone has been provisioned.
- governed-by → azure-policy-reference
- governed-by → landing-zone-tags
- governed-by → deployment-declarative-lifecycle

**Violations:**

- Budget, tag, or exemption changed in the portal instead of the parameter file.
- Exemption entry naming a literal ARM assignment ID.

**Files:**

- `landing-zones/oases-prod/`
- `landing-zones/oases-test/`
- `.github/workflows/lz-flow-create-policy-exemption.yml`
