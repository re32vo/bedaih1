# PowerShell helper: prompts for SMTP settings and writes them to .env
# Usage: Open PowerShell in project root and run:
#   powershell -ExecutionPolicy Bypass -File .\scripts\set-smtp.ps1

$envPath = Join-Path (Get-Location) ".env"

function Read-Secret([string]$prompt) {
    $secure = Read-Host -AsSecureString $prompt
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    return $plain
}

Write-Host "This script will add/update SMTP entries in $envPath" -ForegroundColor Cyan

$host = Read-Host "SMTP_HOST (e.g. smtp.sendgrid.net or smtp.gmail.com)"
$port = Read-Host "SMTP_PORT (587 or 465)"
$user = Read-Host "SMTP_USER (your SMTP username or email)"
$pass = Read-Secret "SMTP_PASS (app password or SMTP password)"
$emailFrom = Read-Host "EMAIL_FROM (optional, e.g. \"جمعية بداية <no-reply@domain.com>\")"

# Read existing .env lines if present
$existing = @()
if (Test-Path $envPath) {
    $existing = Get-Content $envPath -ErrorAction SilentlyContinue
}

# Keys to replace
$keys = @("SMTP_HOST","SMTP_PORT","SMTP_USER","SMTP_PASS","EMAIL_FROM")

# Filter out existing keys
$filtered = @()
foreach ($line in $existing) {
    $skip = $false
    foreach ($k in $keys) {
        if ($line -match "^$k=") { $skip = $true; break }
    }
    if (-not $skip) { $filtered += $line }
}

# Prepare new lines
$newLines = @()
$newLines += "SMTP_HOST=$host"
$newLines += "SMTP_PORT=$port"
$newLines += "SMTP_USER=$user"
$newLines += "SMTP_PASS=$pass"
if ($emailFrom -and $emailFrom.Trim() -ne "") { $newLines += "EMAIL_FROM=$emailFrom" }

# Combine and write
$final = $filtered + $newLines
Set-Content -Path $envPath -Value $final -Encoding UTF8

Write-Host "✅ SMTP settings written to $envPath" -ForegroundColor Green
Write-Host "Reminder: do NOT commit the .env file to source control." -ForegroundColor Yellow
Write-Host "Now restart the dev server: npm run dev" -ForegroundColor Cyan
