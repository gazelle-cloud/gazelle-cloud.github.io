$dataDir   = Join-Path $PSScriptRoot '..' 'data'
$outFile   = Join-Path $PSScriptRoot '..' 'app' 'public' 'graph.json'

$nodes  = [System.Collections.Generic.List[hashtable]]::new()
$links  = [System.Collections.Generic.List[hashtable]]::new()
$nodeIds = [System.Collections.Generic.HashSet[string]]::new()

function Add-Node($id, $type, $extra = @{}) {
    if ($nodeIds.Add($id)) {
        $node = @{ id = $id; type = $type }
        foreach ($key in $extra.Keys) { $node[$key] = $extra[$key] }
        $nodes.Add($node)
    }
}

# design-decisions
Get-ChildItem (Join-Path $dataDir 'design-decisions') -Filter *.json | ForEach-Object {
    $d = Get-Content $_.FullName -Raw | ConvertFrom-Json
    Add-Node $d.id 'decision' @{ mechanism = $d.mechanism; why = $d.why }
    foreach ($rel in $d.related) {
        $links.Add(@{ source = $d.id; target = $rel.id; relationship = $rel.relationship })
    }
}

# design-principles
Get-ChildItem (Join-Path $dataDir 'design-principles') -Filter *.json | ForEach-Object {
    $a = Get-Content $_.FullName -Raw | ConvertFrom-Json
    Add-Node $a.id 'principle' @{ description = $a.description }
    foreach ($decId in $a.decisions) {
        $links.Add(@{ source = $a.id; target = $decId; relationship = 'groups' })
    }
}

# platform-operations
Get-ChildItem (Join-Path $dataDir 'platform-operations') -Filter *.json | ForEach-Object {
    $op = Get-Content $_.FullName -Raw | ConvertFrom-Json
    Add-Node $op.id 'operation'
    foreach ($decId in $op.reasoning) {
        $links.Add(@{ source = $op.id; target = $decId; relationship = 'reasons' })
    }
}

# Ghost nodes — link targets with no source file
foreach ($link in $links) {
    if (-not $nodeIds.Contains($link.target)) {
        Write-Warning "ghost node: '$($link.target)' (referenced but no source file found)"
        Add-Node $link.target 'unknown'
    }
}

$graph = @{ nodes = $nodes.ToArray(); links = $links.ToArray() }
$graph | ConvertTo-Json -Depth 5 | Set-Content $outFile -Encoding UTF8

Write-Host "graph.json written"
Write-Host "  nodes : $($nodes.Count)"
Write-Host "  links : $($links.Count)"
Write-Host "  breakdown:"
foreach ($type in 'decision','principle','operation','unknown') {
    $count = ($nodes | Where-Object { $_.type -eq $type }).Count
    if ($count) { Write-Host ("    {0,-12} {1}" -f $type, $count) }
}
