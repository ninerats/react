<#
.SYNOPSIS
  Creates a new React (or React + TypeScript) project using Vite.

.DESCRIPTION
  Focuses purely on *per-project* setup. 
  Assumes Node LTS + pnpm/npm are already installed (from Setup-ReactEnv.ps1).
  Prefers pnpm (fast, disk-efficient), but will fall back to npm if needed.

.PARAMETER ProjectName
  Folder/name for the new project.  Stops if it already exists unless -Force is supplied.

.PARAMETER UseTypescript
  Switch to scaffold the React + TypeScript template instead of plain React.

.PARAMETER Force
  Overwrite an existing (empty) target folder if present.

.NOTES
  - Separating ENV setup and PROJECT setup avoids accidental re-scaffolding.
  - Vite + React is modern, lightweight, and fully compatible with React.dev tutorials.
#>

[CmdletBinding()]
param(
  [Parameter(Mandatory)]
  [ValidateNotNullOrEmpty()]
  [string]$ProjectName,

  [switch]$UseTypescript,
  [switch]$Force
)

$ErrorActionPreference = 'Stop'

# ---------- output helpers ----------
function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "❌ $msg" -ForegroundColor Red }

# ----------------------------------------------------------------
# 0) Verify Node runtime (WHAT & WHY)
# ----------------------------------------------------------------
# WHAT: Check Node exists and works.
# WHY: Vite and package managers require Node; catching missing installs early prevents half-built projects.
Write-Step "Checking Node.js availability"
try {
  $nodeVersion = node -v
  Write-Ok "Node detected: $nodeVersion"
} catch {
  Write-Err "Node.js not found.  Run Setup-ReactEnv.ps1 first."
  exit 1
}

# ----------------------------------------------------------------
# 1) Choose package manager (WHAT & WHY)
# ----------------------------------------------------------------
# WHAT: Prefer pnpm for speed + deduplication; fallback to npm for compatibility.
# WHY: Ensures you can scaffold projects even if Corepack wasn’t enabled yet.
$PackageManager = $null
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
  $PackageManager = "pnpm"
  Write-Ok "Using pnpm as package manager"
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
  $PackageManager = "npm"
  Write-Warn "pnpm not found; falling back to npm"
} else {
  Write-Err "No supported package manager found (pnpm or npm)."
  Write-Host "  Fix: run Setup-ReactEnv.ps1 or install Node manually." -ForegroundColor Gray
  exit 1
}

# ----------------------------------------------------------------
# 2) Pick Vite template (WHAT & WHY)
# ----------------------------------------------------------------
# WHAT: Choose between React (JS) and React-TS templates.
# WHY: Matches React.dev examples; avoids outdated Create-React-App tooling.
$template = if ($UseTypescript) { "react-ts" } else { "react" }
Write-Step "Selected Vite template: $template"

# ----------------------------------------------------------------
# 3) Target directory safety (WHAT & WHY)
# ----------------------------------------------------------------
# WHAT: Prevent overwriting existing non-empty folders unless -Force is used.
# WHY: Safer defaults and clearer intent.
$targetPath = Join-Path (Get-Location) $ProjectName
if (Test-Path $targetPath) {
  $isEmpty = -not (Get-ChildItem -Path $targetPath -Force -ErrorAction SilentlyContinue)
  if (-not $isEmpty -and -not $Force) {
    Write-Err "Target folder already exists and is not empty: $targetPath"
    Write-Host "  Use -Force to proceed (only if you’re sure)." -ForegroundColor Gray
    exit 1
  }
  if ($isEmpty -and $Force) {
    Write-Warn "Empty target folder exists; proceeding due to -Force: $targetPath"
  }
}

# ----------------------------------------------------------------
# 4) Scaffold project with Vite (WHAT & WHY)
# ----------------------------------------------------------------
# WHAT: Run the official Vite scaffolder (create-vite).
# WHY: Produces a minimal, fast setup identical to React.dev’s tutorial environment.
Write-Step "Scaffolding project → $ProjectName"
if ($PackageManager -eq "pnpm") {
  pnpm create vite@latest $ProjectName -- --template $template
} else {
  npm create vite@latest $ProjectName -- --template $template
}

# ----------------------------------------------------------------
# 5) Install dependencies (WHAT & WHY)
# ----------------------------------------------------------------
# WHAT: Install required packages inside the new project folder.
# WHY: Prepares node_modules and lockfile so you can immediately start the dev server.
Set-Location $ProjectName
Write-Step "Installing dependencies with $PackageManager"
if ($PackageManager -eq "pnpm") {
  pnpm install
} else {
  npm install
}
Write-Ok "Dependencies installed"

# ----------------------------------------------------------------
# 6) Final output & next steps
# ----------------------------------------------------------------
# WHAT: Print clear next-step instructions.
# WHY: Smooth transition from automation to hands-on learning.
Write-Step "Project created successfully"
Write-Ok    "Location: $(Resolve-Path .)"
Write-Host  "Run the dev server:" -ForegroundColor Cyan
if ($PackageManager -eq "pnpm") {
  Write-Host "  pnpm dev" -ForegroundColor White
} else {
  Write-Host "  npm run dev" -ForegroundColor White
}
Write-Host  "Then open: http://localhost:5173/" -ForegroundColor Gray

Write-Host ""
Write-Host "Notes:" -ForegroundColor Cyan
Write-Host "  - Vite provides instant HMR and modern ESM modules out of the box." -ForegroundColor Gray
Write-Host "  - For TypeScript next time, add -UseTypescript." -ForegroundColor Gray
Write-Host "  - For safety, this script never alters your global environment." -ForegroundColor Gray
