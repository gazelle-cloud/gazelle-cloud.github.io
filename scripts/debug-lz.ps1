$raw = Get-Content 'C:/gazelle/gazelle-cloud.github.io/app/public/landing-zone.json' -Raw | ConvertFrom-Json
$raw | Get-Member -MemberType NoteProperty | Select-Object Name
Write-Host "nodes: $($raw.nodes.Count)"
Write-Host "links: $($raw.links.Count)"
Write-Host "--- first link ---"
$raw.links[0] | ConvertTo-Json
