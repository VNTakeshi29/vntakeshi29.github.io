# Publish to GitHub Pages (user site) for repo: VNTakeshi29/vntakeshi29.github.io
# Usage: Right-click this file > Run with PowerShell (or run: powershell -ExecutionPolicy Bypass -File .\publish.ps1)

$ErrorActionPreference = 'Stop'

if (!(Get-Command git -ErrorAction SilentlyContinue)) {
  Write-Host 'Git not found. Please install Git from https://git-scm.com/downloads' -ForegroundColor Yellow
  exit 1
}

if (!(Test-Path '.git')) {
  git init
}

git add .
git commit -m "publish" --allow-empty
git branch -M main

$remote = (git remote get-url origin 2>$null)
if (-not $remote) {
  git remote add origin https://github.com/VNTakeshi29/vntakeshi29.github.io.git
}

git push -u origin main

Write-Host 'Pushed. Now enable GitHub Pages:' -ForegroundColor Green
Write-Host 'Repo → Settings → Pages → Deploy from a branch → main / (root) → Save' -ForegroundColor Green
Write-Host 'Then open: https://vntakeshi29.github.io/' -ForegroundColor Green
