# Generate-KnowledgeGraphJsonLd.ps1
#
# Reads all JSON files under knowledge-graph/ and produces a single
# JSON-LD file (knowledge-graph.jsonld) in the repo root.

$root = Split-Path $PSScriptRoot -Parent
$KnowledgeGraphPath = Join-Path (Split-Path $root -Parent) 'AzurePlatform' 'knowledge-graph'
$OutputPath = Join-Path $root 'site' 'public' 'knowledge-graph.jsonld'

$context = [ordered]@{
    '@vocab'        = 'https://gazelle.cloud/schema/'
    'id'            = '@id'
    'type'          = '@type'
    'decisions'     = [ordered]@{ '@id' = 'decisions';  '@type' = '@id'; '@container' = '@set' }
    'links'         = 'links'
    'prerequisite'  = [ordered]@{ '@id' = 'prerequisite'; '@type' = '@id' }
}

$graph = [System.Collections.Generic.List[object]]::new()

# --- Guiding Principles ---
foreach ($file in Get-ChildItem "$KnowledgeGraphPath/guiding-principles" -Filter *.json) {
    $raw  = Get-Content $file.FullName -Raw | ConvertFrom-Json
    $node = [ordered]@{
        '@id'        = $raw.id
        '@type'      = 'GuidingPrinciple'
        'intent'     = $raw.intent
        'decisions'  = @($raw.decisions)
        'violations' = @($raw.violations)
    }
    $graph.Add($node)
}

# --- Decisions ---
foreach ($file in Get-ChildItem "$KnowledgeGraphPath/decisions" -Filter *.json) {
    $raw  = Get-Content $file.FullName -Raw | ConvertFrom-Json
    $node = [ordered]@{
        '@id'        = $raw.id
        '@type'      = 'Decision'
        'decision'   = $raw.decision
        'why'        = $raw.why
        'violations' = @($raw.violations)
        'files'      = @($raw.files)
    }
    if ($raw.links) {
        $node['links'] = @($raw.links | ForEach-Object {
            [ordered]@{ '@id' = $_.id; 'note' = $_.note }
        })
    }
    $graph.Add($node)
}

# --- Operations ---
foreach ($file in Get-ChildItem "$KnowledgeGraphPath/operations" -Filter *.json) {
    $raw  = Get-Content $file.FullName -Raw | ConvertFrom-Json
    $node = [ordered]@{
        '@id'        = $raw.id
        '@type'      = 'Operation'
        'intent'     = $raw.intent
        'workflow'   = $raw.workflow
        'decisions'  = @($raw.decisions)
        'violations' = @($raw.violations)
        'steps'      = @($raw.steps)
        'files'      = @($raw.files)
    }
    if ($raw.triggers)     { $node['triggers']     = @($raw.triggers) }
    if ($raw.prerequisite) { $node['prerequisite'] = $raw.prerequisite }
    $graph.Add($node)
}

# --- Assemble and write ---
$jsonld = [ordered]@{
    '@context' = $context
    '@graph'   = $graph.ToArray()
}

$jsonld | ConvertTo-Json -Depth 10 | Set-Content -Path $OutputPath -Encoding utf8

Write-Host "Written $($graph.Count) nodes to $OutputPath"
