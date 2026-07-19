<#
.SYNOPSIS
    Builds llms-full.txt from all knowledge-graph JSON files.
.DESCRIPTION
    Renders every JSON file under AzurePlatform/knowledge-graph/ into a single
    llms-full.txt using a flat, LLM-friendly markdown format.
#>

param(
    [string]$DataPath = $env:DATA_PATH
)

$root = Split-Path $PSScriptRoot -Parent

if (-not $DataPath) {
    $DataPath = Join-Path (Split-Path $root -Parent) 'AzurePlatform' 'knowledge-graph'
}

$kgPath = $DataPath
$outFile = Join-Path $root 'site' 'public' 'llms-full.txt'

function Format-Title ([string]$id) {
    ($id -replace '-', ' ' -replace '(\b\w)', { $_.Groups[1].Value.ToUpper() })
}

function Render-GuidingPrinciple ($obj) {
    $sb = [System.Text.StringBuilder]::new()
    [void]$sb.AppendLine("# $(Format-Title $obj.id)")
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine("Intent: $($obj.intent)")
    if ($obj.decisions.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('Decisions:')
        foreach ($d in $obj.decisions) { [void]$sb.AppendLine("- $d") }
    }
    if ($obj.violations.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('Violations:')
        foreach ($v in $obj.violations) { [void]$sb.AppendLine("- $v") }
    }
    $sb.ToString()
}

function Render-Decision ($obj) {
    $sb = [System.Text.StringBuilder]::new()
    [void]$sb.AppendLine("# $(Format-Title $obj.id)")
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine("Decision: $($obj.decision)")
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine("Why: $($obj.why)")
    if ($obj.links.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('Related:')
        foreach ($l in $obj.links) { [void]$sb.AppendLine("- $($l.id): $($l.note)") }
    }
    if ($obj.violations.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('Violations:')
        foreach ($v in $obj.violations) { [void]$sb.AppendLine("- $v") }
    }
    if ($obj.files.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('Files:')
        foreach ($f in $obj.files) { [void]$sb.AppendLine("- $f") }
    }
    $sb.ToString()
}

function Render-Operation ($obj) {
    $sb = [System.Text.StringBuilder]::new()
    [void]$sb.AppendLine("# $(Format-Title $obj.id)")
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine("Intent: $($obj.intent)")
    if ($obj.triggers.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine("Triggers: $($obj.triggers -join ', ')")
    }
    if ($obj.prerequisite) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine("Prerequisite: $($obj.prerequisite)")
    }
    if ($obj.workflow) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine("Workflow: $($obj.workflow)")
    }
    if ($obj.decisions.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('Decisions:')
        foreach ($d in $obj.decisions) { [void]$sb.AppendLine("- $d") }
    }
    if ($obj.steps.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('Steps:')
        $i = 1
        foreach ($s in $obj.steps) { [void]$sb.AppendLine("$i. $s"); $i++ }
    }
    if ($obj.violations.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('Violations:')
        foreach ($v in $obj.violations) { [void]$sb.AppendLine("- $v") }
    }
    if ($obj.files.Count -gt 0) {
        [void]$sb.AppendLine('')
        [void]$sb.AppendLine('Files:')
        foreach ($f in $obj.files) { [void]$sb.AppendLine("- $f") }
    }
    $sb.ToString()
}

$sections = [ordered]@{
    'guiding-principles' = @{ heading = 'Guiding Principles'; renderer = 'Render-GuidingPrinciple' }
    'decisions'          = @{ heading = 'Decisions';           renderer = 'Render-Decision' }
    'operations'         = @{ heading = 'Operations';          renderer = 'Render-Operation' }
}

$content = [System.Text.StringBuilder]::new()
[void]$content.AppendLine("Codebase: https://github.com/gazelle-cloud/Azure-landing-zones")
[void]$content.AppendLine('')
$totalFiles = 0

foreach ($section in $sections.GetEnumerator()) {
    $dir = Join-Path $kgPath $section.Key
    if (-not (Test-Path $dir)) { continue }

    $files = Get-ChildItem -Path $dir -Filter '*.json' | Sort-Object Name
    $totalFiles += $files.Count

    [void]$content.AppendLine("===============================================================================")
    [void]$content.AppendLine("  $($section.Value.heading)")
    [void]$content.AppendLine("===============================================================================")
    [void]$content.AppendLine('')

    foreach ($file in $files) {
        $obj = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json
        $rendered = & $section.Value.renderer $obj
        [void]$content.Append($rendered)
    }
}

Set-Content -Path $outFile -Value $content.ToString().TrimEnd() -Encoding UTF8 -NoNewline
$size = (Get-Item $outFile).Length
Write-Host "Written $outFile ($('{0:N0}' -f $size) bytes, $totalFiles files)"
