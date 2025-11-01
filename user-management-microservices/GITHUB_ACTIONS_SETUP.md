# GitHub Actions CI/CD Pipeline Setup Guide

## Step-by-Step Process to Automate Microservice Deployment

### Prerequisites
- GitHub account
- Docker Hub account (optional, for Docker Hub deployment)
- Cloud provider account (AWS, GCP, Azure) or server for deployment
- Git installed locally

### Step 1: Initialize Git Repository

1. **Navigate to your project directory:**
   ```powershell
   cd c:\Users\priya\Downloads\ci-cd\user-management-microservices
   ```

2. **Initialize Git repository:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: User management microservices"
   ```

3. **Create GitHub repository:**
   - Go to GitHub.com
   - Click "New repository"
   - Name it: `user-management-microservices`
   - Don't initialize with README (you already have files)
   - Click "Create repository"

4. **Connect local repo to GitHub:**
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/user-management-microservices.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Set Up GitHub Secrets

1. **Go to your GitHub repository**
2. **Navigate to Settings > Secrets and variables > Actions**
3. **Add the following secrets:**

   **For Docker Hub deployment:**
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token

   **For cloud deployment (if using):**
   - `AWS_ACCESS_KEY_ID` (for AWS)
   - `AWS_SECRET_ACCESS_KEY` (for AWS)
   - `KUBE_CONFIG` (for Kubernetes)

### Step 3: Configure GitHub Actions Workflows

The workflows are already created in `.github/workflows/`. You need to:

1. **Update the workflow files:**
   - Edit `.github/workflows/ci-cd.yml`
   - Replace `YOUR_USERNAME` with your actual GitHub username
   - Update image names if needed

2. **For Docker Hub deployment:**
   - Edit `.github/workflows/docker-hub-deploy.yml`
   - Replace `your-dockerhub-username` with your Docker Hub username

### Step 4: Set Up Deployment Environments

1. **Create GitHub Environments:**
   - Go to your repo Settings > Environments
   - Create `development` environment
   - Create `production` environment
   - Add protection rules (require reviews for production)

### Step 5: Update Deployment Configurations

1. **Update Kubernetes deployment:**
   - Edit `deployment/kubernetes.yml`
   - Replace `YOUR_USERNAME` with your GitHub username

2. **Update Docker Compose production:**
   - Edit `deployment/docker-compose.prod.yml`
   - Replace `YOUR_USERNAME` with your GitHub username

### Step 6: Test the Pipeline

1. **Push changes to trigger the pipeline:**
   ```powershell
   git add .
   git commit -m "Setup CI/CD pipeline"
   git push origin main
   ```

2. **Monitor the pipeline:**
   - Go to your GitHub repo
   - Click on "Actions" tab
   - Watch the workflow execution

### Step 7: Branch Strategy Setup

1. **Create development branch:**
   ```powershell
   git checkout -b develop
   git push -u origin develop
   ```

2. **Set branch protection rules:**
   - Go to Settings > Branches
   - Add rule for `main` branch
   - Require pull request reviews
   - Require status checks to pass

### Step 8: Deployment Options

#### Option A: Deploy to Cloud (Kubernetes)

1. **Set up Kubernetes cluster** (EKS, GKE, or AKS)

2. **Add Kubernetes deployment to workflow:**
   ```yaml
   - name: Deploy to Kubernetes
     run: |
       echo "${{ secrets.KUBE_CONFIG }}" | base64 -d > kubeconfig
       export KUBECONFIG=kubeconfig
       kubectl apply -f deployment/kubernetes.yml
   ```

#### Option B: Deploy to Server (Docker Compose)

1. **Add server deployment to workflow:**
   ```yaml
   - name: Deploy to Server
     uses: appleboy/ssh-action@v0.1.5
     with:
       host: ${{ secrets.SERVER_HOST }}
       username: ${{ secrets.SERVER_USER }}
       key: ${{ secrets.SERVER_SSH_KEY }}
       script: |
         cd /path/to/deployment
         docker-compose -f docker-compose.prod.yml pull
         docker-compose -f docker-compose.prod.yml up -d
   ```

### Step 9: Monitor Deployments

1. **Set up monitoring:**
   - Add health check endpoints (already included)
   - Use GitHub Actions status badges
   - Set up notifications

2. **Add status badge to README:**
   ```markdown
   [![CI/CD Pipeline](https://github.com/YOUR_USERNAME/user-management-microservices/workflows/CI%2FCD%20Pipeline%20for%20Microservices/badge.svg)](https://github.com/YOUR_USERNAME/user-management-microservices/actions)
   ```

## What the Pipeline Does

### 🔄 **Continuous Integration (CI):**
1. **Code Quality Checks:** Runs on every push/PR
2. **Build Services:** Installs dependencies and builds both services
3. **Health Checks:** Verifies services start correctly
4. **Docker Images:** Builds and pushes container images

### 🚀 **Continuous Deployment (CD):**
1. **Development:** Auto-deploys from `develop` branch
2. **Production:** Auto-deploys from `main` branch
3. **Environment Separation:** Different configs for dev/prod
4. **Rollback Support:** Easy to revert if issues occur

## Workflow Triggers

- **Push to `main`:** Triggers production deployment
- **Push to `develop`:** Triggers development deployment
- **Pull Requests:** Runs CI checks only
- **Manual trigger:** Can be run manually from Actions tab

## Next Steps After Setup

1. **Test the pipeline** by making a small change and pushing
2. **Monitor the deployment** in the Actions tab
3. **Set up monitoring** for your deployed services
4. **Configure alerts** for deployment failures
5. **Add integration tests** for better quality assurance

Your microservices will now be automatically deployed whenever you push code changes! 🎉