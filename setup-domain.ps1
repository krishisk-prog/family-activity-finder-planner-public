# Setup local domain name for Family Activity Finder
# Must be run as Administrator

param(
    [string]$Domain = "family-activity.local",
    [string]$IPAddress = "192.168.88.36"
)

$hostsPath = "$env:SystemRoot\System32\drivers\etc\hosts"

Write-Host "=== Family Activity Finder - Domain Setup ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Domain: $Domain" -ForegroundColor Yellow
Write-Host "IP Address: $IPAddress" -ForegroundColor Yellow
Write-Host ""

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Backup hosts file
$backupPath = "$hostsPath.backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
Copy-Item -Path $hostsPath -Destination $backupPath
Write-Host "Hosts file backed up to: $backupPath" -ForegroundColor Green

# Read current hosts file
$hostsContent = Get-Content $hostsPath

# Check if entry already exists
$entryExists = $hostsContent | Where-Object { $_ -match "family-activity.local" }

if ($entryExists) {
    Write-Host ""
    Write-Host "Entry already exists in hosts file:" -ForegroundColor Yellow
    Write-Host $entryExists
    Write-Host ""
    $response = Read-Host "Do you want to update it? (Y/N)"

    if ($response -ne 'Y' -and $response -ne 'y') {
        Write-Host "Cancelled." -ForegroundColor Yellow
        exit 0
    }

    # Remove old entry
    $hostsContent = $hostsContent | Where-Object { $_ -notmatch "family-activity.local" }
}

# Add new entry
$newEntry = "$IPAddress    $Domain"
$hostsContent += ""
$hostsContent += "# Family Activity Finder - Local Development"
$hostsContent += $newEntry

# Write back to hosts file
$hostsContent | Out-File -FilePath $hostsPath -Encoding ASCII

Write-Host ""
Write-Host "SUCCESS! Hosts file updated." -ForegroundColor Green
Write-Host ""
Write-Host "You can now access the app at:" -ForegroundColor Cyan
Write-Host "  Frontend: https://$Domain:5174" -ForegroundColor White
Write-Host "  Backend:  https://$Domain:3001" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Regenerate SSL certificate to include $Domain" -ForegroundColor White
Write-Host "2. Restart frontend and backend servers" -ForegroundColor White
Write-Host "3. Configure other devices (see troubleshooting-guide.md)" -ForegroundColor White
Write-Host ""
Write-Host "To undo: Restore from backup at $backupPath" -ForegroundColor Gray
