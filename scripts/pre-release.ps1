$ErrorActionPreference = 'Stop'

function Write-Step {
  param([string]$Message)
  Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Run-Step {
  param(
    [string]$Label,
    [scriptblock]$Action
  )

  Write-Step $Label
  & $Action
}

function Assert-HttpStatus {
  param(
    [string]$Url,
    [int]$Expected = 200
  )

  $response = Invoke-WebRequest -Uri $Url -UseBasicParsing
  if ($response.StatusCode -ne $Expected) {
    throw "Unexpected status for ${Url}: $($response.StatusCode)"
  }

  return $response
}

Run-Step 'Lint' { npm run lint }
Run-Step 'Build' { npm run build }
Run-Step 'Typecheck (after build)' { npx tsc --noEmit }

$port = 3100
$serverProcess = $null

try {
  Run-Step "Start production server on :$port" {
    $serverProcess = Start-Process `
      -FilePath 'cmd.exe' `
      -ArgumentList "/c npm run start -- --port $port" `
      -WorkingDirectory (Get-Location).Path `
      -PassThru `
      -WindowStyle Hidden

    Start-Sleep -Seconds 6
  }

  Run-Step 'HTTP smoke checks' {
    $homeResponse = Assert-HttpStatus "http://localhost:$port/"
    $robots = Assert-HttpStatus "http://localhost:$port/robots.txt"
    $sitemap = Assert-HttpStatus "http://localhost:$port/sitemap.xml"

    if ($robots.Content -notmatch 'Sitemap:\s+https://botfactory.by/sitemap.xml') {
      throw 'robots.txt does not contain canonical sitemap URL'
    }

    if ($sitemap.Content -notmatch 'https://botfactory.by/services/web-development-minsk') {
      throw 'sitemap.xml does not contain expected service page URL'
    }
  }

  Run-Step 'Done' {
    Write-Host 'Pre-release checks passed.' -ForegroundColor Green
  }
}
finally {
  if ($serverProcess -and -not $serverProcess.HasExited) {
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
  }
}
