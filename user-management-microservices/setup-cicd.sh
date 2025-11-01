#!/bin/bash

# GitHub Actions Setup Script for User Management Microservices

echo "🚀 Setting up GitHub Actions CI/CD Pipeline..."

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Initialize git if not already done
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: User management microservices"
else
    echo "✅ Git repository already initialized"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository as remote origin:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/user-management-microservices.git"
    echo "   git branch -M main"
    echo "   git push -u origin main"
else
    echo "✅ Remote origin already configured"
fi

# Create develop branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/develop; then
    echo "🌿 Creating develop branch..."
    git checkout -b develop
    git push -u origin develop
    git checkout main
else
    echo "✅ Develop branch already exists"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. 📝 Create GitHub repository (if not done already)"
echo "2. 🔐 Add GitHub Secrets in your repository settings:"
echo "   - DOCKERHUB_USERNAME (if using Docker Hub)"
echo "   - DOCKERHUB_TOKEN (if using Docker Hub)"
echo "   - Add cloud provider secrets if deploying to cloud"
echo ""
echo "3. 🔄 Update workflow files:"
echo "   - Replace 'YOUR_USERNAME' with your GitHub username"
echo "   - Replace 'your-dockerhub-username' with your Docker Hub username"
echo ""
echo "4. 🚀 Push changes to trigger the pipeline:"
echo "   git add ."
echo "   git commit -m 'Setup CI/CD pipeline'"
echo "   git push origin main"
echo ""
echo "5. 📊 Monitor the pipeline in GitHub Actions tab"
echo ""
echo "Happy deploying! 🎯"