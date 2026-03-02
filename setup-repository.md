# Setting Up GitHub Repository for Auto-Updater

## Step 1: Create Repository
1. Go to https://github.com/new
2. Repository name: `x.auto`
3. Owner: `C0L2` (or your preferred username)
4. Make it **Public** (required for auto-updater)
5. Click "Create repository"

## Step 2: Push Your Code
```bash
# If repository doesn't exist as remote
git remote set-url origin https://github.com/C0L2/x.auto.git

# Push your code
git push -u origin main
```

## Step 3: Create a Release
1. Go to https://github.com/C0L2/x.auto/releases
2. Click "Create a new release"
3. Tag version: `v1.4.5`
4. Release title: `v1.4.5`
5. Upload your built files:
   - `x.auto-1.4.5-setup.exe`
   - `x.auto.exe` (portable)
   - `latest.yml` (auto-generated)

## Step 4: Test Auto-Updater
Once the repository and releases are set up, the auto-updater will:
- Check for updates every 4 hours
- Compare current version (1.4.5) with latest release
- Show update notification if newer version available

## Alternative: Use Different Repository
If you prefer a different repository name, update these files:
- `package.json` (build.publish section)
- `dev-app-update.yml` 