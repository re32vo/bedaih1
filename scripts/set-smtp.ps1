# Write SMTP settings into .env
# Run from project root:
#   powershell -ExecutionPolicy Bypass -File .\scripts\set-smtp.ps1

$envPath = Join-Path (Get-Location) ".env"

function Read-Input {
    param([string]$PromptText)
    Write-Host ($PromptText + ": ") -NoNewline
    [Console]::ReadLine()
}

Write-Host "Configure SMTP values for .env" -ForegroundColor Cyan

$smtpServer = Read-Input "SMTP_HOST (smtp.gmail.com)"
$smtpPort = Read-Input "SMTP_PORT (587 or 465)"
$smtpUser = Read-Input "SMTP_USER (your gmail)"
$smtpPass = Read-Input "SMTP_PASS (google app password)"
$emailFrom = Read-Input "EMAIL_FROM (optional)"

$keys = @('SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','EMAIL_FROM')
$existingLines = if (Test-Path $envPath) { Get-Content $envPath -ErrorAction SilentlyContinue } else { @() }

$filteredLines = foreach ($line in $existingLines) {
    if ($line -notmatch '^(SMTP_HOST|SMTP_PORT|SMTP_USER|SMTP_PASS|EMAIL_FROM)=') {
        $line
    }
}

$newLines = @(
    "SMTP_HOST=$smtpServer",
    "SMTP_PORT=$smtpPort",
    "SMTP_USER=$smtpUser",
    "SMTP_PASS=$smtpPass"
)

if ($emailFrom -and $emailFrom.Trim() -ne '') {
    $newLines += "EMAIL_FROM=$emailFrom"
}

$finalLines = @($filteredLines) + $newLines
Set-Content -Path $envPath -Value $finalLines -Encoding UTF8

Write-Host "Done. SMTP values saved in $envPath" -ForegroundColor Green
Write-Host "Restart server: npm run dev" -ForegroundColor Cyan
