<#
.SYNOPSIS
    Builds knowledge-graph.json from AzurePlatform knowledge-graph source files.
.DESCRIPTION
    Reads guiding-principles and decisions JSON files from AzurePlatform/knowledge-graph/
    and produces the combined knowledge-graph.json used by the website.
#>

$root = Split-Path $PSScriptRoot -Parent
$kgPath = Join-Path (Split-Path $root -Parent) 'AzurePlatform' 'knowledge-graph'
$outFile = Join-Path $root 'site' 'public' 'knowledge-graph.json'

$nodes = [System.Collections.ArrayList]::new()
$links = [System.Collections.ArrayList]::new()

# --- Guiding Principles → rule nodes + "groups" links ---
$gpDir = Join-Path $kgPath 'guiding-principles'
if (Test-Path $gpDir) {
    foreach ($file in Get-ChildItem -Path $gpDir -Filter '*.json' | Sort-Object Name) {
        $obj = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json

        [void]$nodes.Add([ordered]@{
            id     = $obj.id
            type   = 'rule'
            intent = $obj.intent
        })

        if ($obj.decisions) {
            foreach ($d in $obj.decisions) {
                [void]$links.Add([ordered]@{
                    source       = $obj.id
                    target       = $d
                    relationship = 'groups'
                })
            }
        }
    }
}

# --- Decisions → decision nodes + "related" links ---
$decDir = Join-Path $kgPath 'decisions'
if (Test-Path $decDir) {
    foreach ($file in Get-ChildItem -Path $decDir -Filter '*.json' | Sort-Object Name) {
        $obj = Get-Content -Path $file.FullName -Raw | ConvertFrom-Json

        $node = [ordered]@{
            id       = $obj.id
            type     = 'decision'
            why      = $obj.why
        }

        if ($obj.links -and $obj.links.Count -gt 0) {
            $node.links = @($obj.links | ForEach-Object {
                [ordered]@{ id = $_.id; note = $_.note }
            })
        }

        $node.decision = $obj.decision

        [void]$nodes.Add($node)

        if ($obj.links) {
            foreach ($l in $obj.links) {
                [void]$links.Add([ordered]@{
                    source       = $obj.id
                    target       = $l.id
                    relationship = 'related'
                })
            }
        }
    }
}

$result = [ordered]@{
    nodes = $nodes
    links = $links
}

$json = $result | ConvertTo-Json -Depth 5
Set-Content -Path $outFile -Value $json -Encoding UTF8 -NoNewline

$size = (Get-Item $outFile).Length
Write-Host "Written $outFile ($('{0:N0}' -f $size) bytes, $($nodes.Count) nodes, $($links.Count) links)"
