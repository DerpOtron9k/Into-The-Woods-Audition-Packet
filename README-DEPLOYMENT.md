# Automated Google Apps Script Deployment

This repository is set up to automatically deploy `Code.gs` to Google Apps Script whenever you push changes to the main or develop branches.

## 🚀 Setup Instructions

### 1. Install clasp CLI
```bash
npm install -g @google/clasp
```

### 2. Authenticate with Google
```bash
clasp login
```
This will open a browser window for you to authenticate with your Google account.

### 3. Get your credentials
After logging in, clasp creates a `.clasprc.json` file in your home directory. Copy its contents:
```bash
# On Windows
type %USERPROFILE%\.clasprc.json

# On Mac/Linux
cat ~/.clasprc.json
```

### 4. Add GitHub Secret
1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `CLASP_CREDENTIALS`
5. Value: Paste the entire contents of your `.clasprc.json` file

## 🔄 How It Works

- **Automatic Deployment**: When you push changes to `Code.gs` on the main or develop branches, GitHub Actions automatically:
  1. Installs clasp CLI
  2. Sets up authentication using your stored credentials
  3. Pushes the updated code to Google Apps Script
  4. Deploys it as a new version

- **Manual Deployment**: You can also deploy manually using:
  ```bash
  # Windows
  deploy.bat
  
  # Mac/Linux
  ./deploy.sh
  ```

## 📁 Files Created

- `.clasp.json` - Configuration file linking to your Apps Script project
- `.github/workflows/deploy-apps-script.yml` - GitHub Actions workflow
- `deploy.sh` - Manual deployment script (Mac/Linux)
- `deploy.bat` - Manual deployment script (Windows)

## 🔧 Configuration

The `.clasp.json` file contains your Apps Script project ID. If you need to change it, update the `scriptId` field.

## 🚨 Security Notes

- Your Google credentials are stored securely in GitHub Secrets
- The `.clasprc.json` file should never be committed to the repository
- Only authorized users with access to the repository can trigger deployments

## 📝 Usage

1. Make changes to `Code.gs`
2. Commit and push to main or develop branch
3. GitHub Actions will automatically deploy the changes
4. Check the Actions tab in GitHub to monitor deployment status

## 🆘 Troubleshooting

If deployment fails:
1. Check the GitHub Actions logs for error details
2. Verify your `CLASP_CREDENTIALS` secret is correctly set
3. Ensure your Google account has access to the Apps Script project
4. Try manual deployment using the provided scripts
