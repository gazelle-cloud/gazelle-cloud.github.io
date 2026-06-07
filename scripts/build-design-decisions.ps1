$SRC  = 'C:\gazelle\AzurePlatform\knowledge-graph'
$DEST = 'C:\gazelle\gazelle-cloud.github.io\app\public\design-decisions.json'

$rules     = Get-ChildItem "$SRC\platform-design"    -Filter '*.json' | Sort-Object Name | ForEach-Object { Get-Content $_.FullName -Raw | ConvertFrom-Json }
$decisions = Get-ChildItem "$SRC\platform-decisions" -Filter '*.json' | Sort-Object Name | ForEach-Object { Get-Content $_.FullName -Raw | ConvertFrom-Json }

$nodes = [System.Collections.Generic.List[object]]::new()
$links = [System.Collections.Generic.List[object]]::new()

# rule nodes
foreach ($r in $rules) {
  $nodes.Add([pscustomobject]@{ id = $r.id; type = 'rule'; intent = $r.intent })
}

# decision nodes
foreach ($d in $decisions) {
  $refs = [System.Collections.Generic.List[object]]::new()
  if ($d.links) { foreach ($l in $d.links) { $refs.Add($l) } }
  $nodes.Add([pscustomobject]@{ id = $d.id; type = 'decision'; mechanism = $d.decision; why = $d.why; links = $refs })
}

# links: rule -> decision (groups)
foreach ($r in $rules) {
  foreach ($dec in $r.decisions) {
    $links.Add([pscustomobject]@{ source = $r.id; target = $dec; relationship = 'groups' })
  }
}

# links: decision -> decision (related)
foreach ($d in $decisions) {
  foreach ($l in $d.links) {
    $links.Add([pscustomobject]@{ source = $d.id; target = $l.id; relationship = 'related' })
  }
}

$out = [pscustomobject]@{ nodes = $nodes; links = $links } | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($DEST, $out, [System.Text.Encoding]::UTF8)

Write-Host "nodes: $($nodes.Count)  links: $($links.Count)"
