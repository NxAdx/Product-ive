# script: encode-keystore.ps1
# Description: Encodes the productive.jks into Base64 for GitHub Secrets.

$KeystorePath = "android/app/productive.jks"

if (-Not (Test-Path $KeystorePath)) {
    Write-Host "Error: No keystore found at $KeystorePath" -ForegroundColor Red
    Write-Host "Please run the 'keytool' command in the setup guide first!" -ForegroundColor Yellow
    exit 1
}

Write-Host "Encoding $KeystorePath to Base64..." -ForegroundColor Cyan
$Bytes = [System.IO.File]::ReadAllBytes($KeystorePath)
$Base64 = [System.Convert]::ToBase64String($Bytes)

$OutputPath = "keystore_base64.txt"
$Base64 | Out-File -FilePath $OutputPath -Encoding ascii

Write-Host "Success! Base64 string saved to $OutputPath." -ForegroundColor Green
Write-Host "COPY THIS CONTENT TO YOUR GITHUB 'RELEASE_KEYSTORE' SECRET." -ForegroundColor Black -BackgroundColor White

# Attempt to copy to clipboard for convenience
try {
    $Base64 | Set-Clipboard
    Write-Host "Copied to clipboard automatically!" -ForegroundColor Green
} catch {
    Write-Host "Could not copy to clipboard. Please open $OutputPath manually." -ForegroundColor Yellow
}
