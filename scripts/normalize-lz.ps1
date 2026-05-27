$inFile  = Join-Path $PSScriptRoot '..' 'app' 'public' 'landing-zone.json'
$outFile = $inFile

$raw = Get-Content $inFile -Raw | ConvertFrom-Json

# Transform nodes: drop label, flatten meta, keep id/type/subtype + all meta fields
$nodes = $raw.nodes | ForEach-Object {
    $n = [ordered]@{ id = $_.id; type = $_.type }
    if ($_.subtype) { $n['subtype'] = $_.subtype }
    if ($_.meta) {
        $_.meta.PSObject.Properties | ForEach-Object { $n[$_.Name] = $_.Value }
    }
    $n
}

# Transform links: rename type -> relationship
$links = $raw.links | ForEach-Object {
    [ordered]@{ source = $_.source; target = $_.target; relationship = $_.type }
}

$out = [ordered]@{ nodes = $nodes; links = $links }
$out | ConvertTo-Json -Depth 6 | Set-Content $outFile -Encoding UTF8

Write-Host "Done"
Write-Host "  nodes : $($nodes.Count)"
Write-Host "  links : $($links.Count)"
