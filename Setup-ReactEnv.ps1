<#
.SYNOPSIS
  Sets up a Windows 11 environment for modern React development (no project creation).

.DESCRIPTION
  Installs Node.js LTS using WinGet, then enables pnpm via Corepack (with a safe npm fallback).
  This script is intentionally limited to *system-level environment* setup so you can reuse it
  across many projects. Project scaffolding (e.g., Vite + React) is a separate, explicit step.

.NOTES
  - Why LTS? It’s the stable channel most tools target; reduces “works on my machine” issues.
  - Why pnpm? Faster installs, disk-efficient, and widely used in modern JS stacks.
  - Why Corepack? Ships with Node and manages package manager versions cleanly per project.
  - Run this as Administrator so WinGet can install packages quietly without prompts.
#>

[CmdletBinding()]
param()

# Treat unexpected errors as fatal so we don't leave you in a half-configured state.
$ErrorActionPreference = 'Stop'

# ---------- small helpers for pretty output ----------
function Write-Step($msg) { Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-Ok($msg)   { Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Warn($msg) { Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Err($msg)  { Write-Host "❌ $msg" -ForegroundColor Red }

# ---------- (Why) Admin check ----------
# WinGet can install per-user in some cases, but system-wide installs (the usual) are smoother with elevation.
# We *warn* if you're not admin, but don't hard-fail—maybe your policy allows user-scope installs.
$IsAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()
).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $IsAdmin) {
  Write-Warn "Running without Administrator privileges. WinGet may prompt or fail for system-wide install."
}

# ---------- (Why) Check WinGet availability ----------
# WinGet is the Microsoft-supported package manager for Windows 11. Using it avoids sketchy downloads/MSIs.
Write-Step "Checking for WinGet (Windows package manager)"
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
  Write-Err "WinGet not found. Update the 'App Installer' from Microsoft Store and try again."
  throw "WinGet is required for automated Node installation."
}
Write-Ok "WinGet is available."

# ----------------------------------------------------------------
# 1) Install Node.js LTS (What & Why)
# ----------------------------------------------------------------
# WHAT: Install Node runtime + npm via the official OpenJS LTS package.
# WHY: LTS is the “safe default” most frameworks (React, Vite, Next.js) target and test against.
#      It minimizes native-module rebuild issues and keeps CI/teammates aligned more easily.
Write-Step "Installing Node.js (LTS) via WinGet"
winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements

# ---------- (Why) Refresh PATH in *this* session ----------
# The installer updates Machine/User PATH, but the current PowerShell process doesn't auto-refresh.
# We recompute PATH so 'node' and 'npm' are immediately available without opening a new terminal.
$env:Path = [System.Environment]::GetEnvironmentVariable('Path','Machine') + ';' +
            [System.Environment]::GetEnvironmentVariable('Path','User')

# ---------- Verify Node/npm ----------
Write-Step "Verifying Node/npm availability"
try {
  $nodeVersion = node -v
  $npmVersion  = npm -v
  Write-Ok "Node detected: $nodeVersion"
  Write-Ok "npm detected:  $npmVersion"
} catch {
  Write-Err "Node.js not found in PATH for this session."
  Write-Host "   Try opening a NEW PowerShell window, or sign out/in, then re-run this script." -ForegroundColor Gray
  throw
}

# ----------------------------------------------------------------
# 2) Enable pnpm via Corepack (What & Why)
# ----------------------------------------------------------------
# WHAT: Use Corepack (bundled with Node 16.13+) to activate pnpm.
# WHY: Corepack pins package manager versions per project (via 'packageManager' field)
#      which improves reproducibility and avoids global-path drift.
Write-Step "Activating pnpm using Corepack"
$pnpmActivated = $false
try {
  # Enable Corepack shims & activate the latest pnpm version.
  corepack enable            | Out-Null
  corepack prepare pnpm@latest --activate | Out-Null
  $pnpmVersion = pnpm -v
  Write-Ok "pnpm activated via Corepack: $pnpmVersion"
  $pnpmActivated = $true
} catch {
  Write-Warn "Corepack not available or failed to activate pnpm. Falling back to global install."
}

# ---------- Fallback: global pnpm ----------
# WHAT: Install pnpm globally via npm if Corepack isn't usable (older Node, custom corp images, etc.).
# WHY: Keeps you moving. You can switch to Corepack later with 'corepack enable' after upgrading Node.
if (-not $pnpmActivated) {
  Write-Step "Installing pnpm globally (fallback path)"
  npm install -g pnpm
  $pnpmVersion = pnpm -v
  Write-Ok "pnpm installed globally: $pnpmVersion"
}

# ----------------------------------------------------------------
# 3) Final notes & next steps (What & Why)
# ----------------------------------------------------------------
# WHAT: We stop here—environment only. No project files are created.
# WHY: Environment setup is done rarely; project scaffolding is per-project and should be explicit.
Write-Step "Environment setup complete"
Write-Ok    "Node: $nodeVersion"
Write-Ok    "npm:  $npmVersion"
Write-Ok    "pnpm: $pnpmVersion"

Write-Host ""
Write-Host "Next steps (per project):" -ForegroundColor Cyan
Write-Host "  1) Create a new React app with Vite:" -ForegroundColor Gray
Write-Host "       pnpm create vite@latest my-app -- --template react" -ForegroundColor White
Write-Host "     (Add TypeScript by using '--template react-ts')" -ForegroundColor Gray
Write-Host "  2) Install deps & run dev server:" -ForegroundColor Gray
Write-Host "       cd my-app" -ForegroundColor White
Write-Host "       pnpm install" -ForegroundColor White
Write-Host "       pnpm dev   # opens http://localhost:5173" -ForegroundColor White

Write-Host ""
Write-Host "Why this is a good baseline:" -ForegroundColor Cyan
Write-Host "  - LTS Node minimizes breaking changes across tools." -ForegroundColor Gray
Write-Host "  - pnpm is fast and disk-efficient; Corepack keeps versions consistent." -ForegroundColor Gray
Write-Host "  - Separating env setup from project creation avoids accidental re-scaffolding." -ForegroundColor Gray
