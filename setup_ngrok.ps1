# PowerShell script to setup ngrok
Write-Host "Setting up ngrok..." -ForegroundColor Green

# Check if ngrok is installed
if (-not (Get-Command ngrok -ErrorAction SilentlyContinue)) {
    Write-Host "Installing ngrok..." -ForegroundColor Yellow
    npm install -g ngrok
}

# Check if authtoken is configured
$ngrokConfig = "$env:USERPROFILE\.ngrok2\ngrok.yml"
if (-not (Test-Path $ngrokConfig)) {
    Write-Host "`n⚠️  ngrok requires authentication token!" -ForegroundColor Red
    Write-Host "`nTo get your authtoken:" -ForegroundColor Yellow
    Write-Host "1. Go to https://dashboard.ngrok.com/get-started/your-authtoken" -ForegroundColor Cyan
    Write-Host "2. Copy your authtoken" -ForegroundColor Cyan
    Write-Host "3. Run: ngrok config add-authtoken YOUR_TOKEN" -ForegroundColor Cyan
    Write-Host "`nOr run this command with your token:" -ForegroundColor Yellow
    Write-Host "ngrok config add-authtoken YOUR_TOKEN_HERE" -ForegroundColor White
    exit 1
}

Write-Host "✅ ngrok is configured!" -ForegroundColor Green
Write-Host "`nStarting ngrok on port 5173..." -ForegroundColor Green
Write-Host "Your public URL will be displayed below:" -ForegroundColor Cyan
Write-Host "`n" -ForegroundColor White

# Start ngrok
Start-Process ngrok -ArgumentList "http 5173" -NoNewWindow

Write-Host "`n✅ ngrok is running!" -ForegroundColor Green
Write-Host "Check the ngrok window for your public URL (https://xxxx.ngrok-free.app)" -ForegroundColor Cyan
Write-Host "`nPress any key to stop ngrok..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

