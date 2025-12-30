# Script PowerShell pour mettre à jour l'URL de l'API sur Vercel
# Usage: .\update-vercel-api-url.ps1 "https://votre-nouvelle-url.loca.lt"

param(
    [Parameter(Mandatory=$true)]
    [string]$ApiUrl
)

Write-Host "🔧 Mise à jour de la variable d'environnement sur Vercel..." -ForegroundColor Cyan

# Vérifier si Vercel CLI est installé
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "⚠️  Vercel CLI n'est pas installé." -ForegroundColor Yellow
    Write-Host "📦 Installation de Vercel CLI..." -ForegroundColor Cyan
    npm install -g vercel
}

Write-Host ""
Write-Host "🌐 Nouvelle URL API: $ApiUrl" -ForegroundColor Green
Write-Host ""

# Se connecter à Vercel si nécessaire
Write-Host "🔐 Connexion à Vercel..." -ForegroundColor Cyan
vercel login

# Lier le projet
Write-Host "🔗 Liaison au projet Vercel..." -ForegroundColor Cyan
vercel link

# Ajouter la variable d'environnement
Write-Host "➕ Ajout de la variable VITE_API_URL..." -ForegroundColor Cyan
vercel env add VITE_API_URL production

Write-Host ""
Write-Host "✅ Variable d'environnement mise à jour!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Pour redéployer l'application:" -ForegroundColor Yellow
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""
Write-Host "📌 Ou configurez manuellement sur:" -ForegroundColor Yellow
Write-Host "   https://vercel.com/dashboard → Settings → Environment Variables" -ForegroundColor White

