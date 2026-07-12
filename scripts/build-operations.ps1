<#
.SYNOPSIS
    Builds operations.json from AzurePlatform knowledge-graph/operations source files.
.DESCRIPTION
    Reads every JSON file under AzurePlatform/knowledge-graph/operations/ and produces
    the combined operations.json used by the website's force-directed graph.
#>

$root = Split-Path $PSScriptRoot -Parent
$kgPath = Join-Path (Split-Path $root -Parent) 'AzurePlatform' 'knowledge-graph'
$opsPath = Join-Path $kgPath 'operations'
$decPath = Join-Path $kgPath 'decisions'
$outFile = Join-Path $root 'site' 'public' 'operations.json'

# Pre-load all decisions into a lookup table
$decisionLookup = @{}
if (Test-Path $decPath) {
    foreach ($file in Get-ChildItem -Path $decPath -Filter '*.json') {
        $obj = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json
        $decisionLookup[$obj.id] = $obj
    }
}

function Format-Label ([string]$id) {
    ($id -replace '-', ' ' -replace '(\b\w)', { $_.Groups[1].Value.ToUpper() })
}

$operationNodes = [System.Collections.ArrayList]::new()
$decisionSet    = [System.Collections.Generic.HashSet[string]]::new()
$fileSet        = [System.Collections.Generic.HashSet[string]]::new()
$links          = [System.Collections.ArrayList]::new()

foreach ($file in Get-ChildItem -Path $opsPath -Filter '*.json' | Sort-Object Name) {
    $obj = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json

    # Operation node
    [void]$operationNodes.Add([ordered]@{
        id     = $obj.id
        type   = 'operation'
        label  = Format-Label $obj.id
        intent = $obj.intent
    })

    # Decision links
    if ($obj.decisions) {
        foreach ($d in $obj.decisions) {
            [void]$decisionSet.Add($d)
            [void]$links.Add([ordered]@{
                source = $obj.id
                target = $d
                type   = 'reasoning'
            })
        }
    }

    # File links
    if ($obj.files) {
        foreach ($f in $obj.files) {
            [void]$fileSet.Add($f)
            [void]$links.Add([ordered]@{
                source = $obj.id
                target = $f
                type   = 'file'
            })
        }
    }
}

# Build nodes array: operations first, then decisions, then files
$nodes = [System.Collections.ArrayList]::new()
foreach ($n in $operationNodes) { [void]$nodes.Add($n) }

foreach ($d in $decisionSet | Sort-Object) {
    $node = [ordered]@{
        id    = $d
        type  = 'decision'
        label = Format-Label $d
    }
    if ($decisionLookup.ContainsKey($d)) {
        $node.decision = $decisionLookup[$d].decision
    }
    [void]$nodes.Add($node)
}

foreach ($f in $fileSet | Sort-Object) {
    [void]$nodes.Add([ordered]@{
        id    = $f
        type  = 'file'
        label = $f
    })
}

$result = [ordered]@{
    nodes = $nodes
    links = $links
}

$json = $result | ConvertTo-Json -Depth 5
Set-Content -Path $outFile -Value $json -Encoding UTF8 -NoNewline

$size = (Get-Item $outFile).Length
Write-Host "Written $outFile ($('{0:N0}' -f $size) bytes, $($nodes.Count) nodes, $($links.Count) links)"
