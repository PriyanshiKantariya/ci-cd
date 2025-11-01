# GitHub Actions Setup Script for Windows PowerShell

Write-Host "🚀 Setting up GitHub Actions CI/CD Pipeline..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "docker-compose.yml")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

# Initialize git if not already done
if (-not (Test-Path ".git")) {
    Write-Host "📝 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: User management microservices"
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Check if remote origin exists
try {
    git remote get-url origin | Out-Null
    Write-Host "✅ Remote origin already configured" -ForegroundColor Green
} catch {
    Write-Host "🔗 Please add your GitHub repository as remote origin:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/user-management-microservices.git" -ForegroundColor Cyan
    Write-Host "   git branch -M main" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
}

# Create develop branch if it doesn't exist
try {
    git show-ref --verify --quiet refs/heads/develop
    Write-Host "✅ Develop branch already exists" -ForegroundColor Green
} catch {
    Write-Host "🌿 Creating develop branch..." -ForegroundColor Yellow
    git checkout -b develop
    git push -u origin develop
    git checkout main
}

Write-Host ""
Write-Host "🎉 Setup complete! Next steps:" -ForegroundColor Green
Write-Host ""
Write-Host "1. 📝 Create GitHub repository (if not done already)" -ForegroundColor White
Write-Host "2. 🔐 Add GitHub Secrets in your repository settings:" -ForegroundColor White
Write-Host "   - DOCKERHUB_USERNAME (if using Docker Hub)" -ForegroundColor Cyan
Write-Host "   - DOCKERHUB_TOKEN (if using Docker Hub)" -ForegroundColor Cyan
Write-Host "   - Add cloud provider secrets if deploying to cloud" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. 🔄 Update workflow files:" -ForegroundColor White
Write-Host "   - Replace 'YOUR_USERNAME' with your GitHub username" -ForegroundColor Cyan
Write-Host "   - Replace 'your-dockerhub-username' with your Docker Hub username" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. 🚀 Push changes to trigger the pipeline:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Cyan
Write-Host "   git commit -m 'Setup CI/CD pipeline'" -ForegroundColor Cyan
Write-Host "   git push origin main" -ForegroundColor Cyan
Write-Host ""
Write-Host "5. 📊 Monitor the pipeline in GitHub Actions tab" -ForegroundColor White
Write-Host ""
Write-Host "Happy deploying! 🎯" -ForegroundColor Magenta