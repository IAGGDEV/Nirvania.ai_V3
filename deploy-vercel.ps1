# Script de despliegue rápido en Vercel

Write-Host "🚀 Desplegando Nirvania en Vercel..." -ForegroundColor Cyan

# Verificar si Vercel CLI está instalado
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "📦 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Crear archivo .vercelignore
@"
node_modules
.next
.git
*.log
.env*.local
"@ | Out-File -FilePath .vercelignore -Encoding UTF8

# Desplegar
Write-Host "🔄 Iniciando despliegue..." -ForegroundColor Green
vercel --prod

Write-Host "✅ ¡Despliegue completado!" -ForegroundColor Green
Write-Host "🌐 Tu sitio estará disponible en nirvaniaai.com una vez configures el DNS" -ForegroundColor Cyan




