# x.auto

An Electron application with React and TypeScript for auto-service management.

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## 🔧 Troubleshooting

### SQLite3 Build Issues

If you encounter SQLite3 related errors during development or building:

```bash
# Rebuild native modules for Electron
$ npm run rebuild

# If the issue persists, reinstall and rebuild
$ npm install sqlite3 --save
$ npm run rebuild
$ npm run build
```

**Common SQLite3 Errors:**
- `DriverPackageNotInstalledError: SQLite package has not been found installed`
- `Module did not self-register`
- Build failures with native module compilation

**Solution:** The project includes an automated rebuild script that recompiles SQLite3 for the correct Electron version.

### Windows Build Requirements

For Windows development, you may need:
- **Visual Studio Build Tools** (for native module compilation)
- **Python** (for node-gyp)

The project is configured to handle most build scenarios automatically.

## 🆕 Recent Features

### Cache and Session Management

The application now includes comprehensive cache and session clearing capabilities:

- **Authentication Session Clearing**: Clear user login sessions
- **Web Cache Clearing**: Clear Electron's web cache
- **Storage Data Clearing**: Clear localStorage, IndexedDB, WebSQL
- **Comprehensive Clearing**: Clear all cache and session data while preserving database

**Usage from Frontend:**
```typescript
// Clear authentication session
await window.xauto.resolveMutation('CACHE:CLEAR_AUTH_SESSION:MUTATE', {});

// Clear all cache and session data
await window.xauto.resolveMutation('CACHE:CLEAR_EVERYTHING:MUTATE', {});

// Get cache information
const info = await window.xauto.resolveQuery('CACHE:GET_CACHE_INFO:QUERY', {});
```

### Master Info Display Fix

Fixed issue where invoice print views showed incorrect master information. The system now properly displays the logged-in user's name and surname in print documents.

### Enhanced Error Handling

Improved error handling and logging throughout the application for better debugging and user experience.

## Creating a New Release

This project uses automated GitHub Actions workflows to build and release the application across multiple platforms. Follow these steps to create a new release:

### Prerequisites

- Ensure you have push access to the main branch
- All changes should be committed and pushed to the main branch
- The build should pass locally (`npm run build`)

### Step-by-Step Release Process

#### 1. Update Version Number

Update the version in `package.json`:

```bash
# Example: updating from 1.3.4 to 1.3.5
npm version patch  # for patch releases (1.3.4 → 1.3.5)
npm version minor  # for minor releases (1.3.4 → 1.4.0)
npm version major  # for major releases (1.3.4 → 2.0.0)
```

Or manually edit `package.json`:

```json
{
  "version": "1.3.5"
}
```

#### 2. Commit Version Change

```bash
git add package.json package-lock.json
git commit -m "chore: bump version to 1.3.5"
git push origin main
```

#### 3. Create and Push Release Tag

```bash
# Create a tag with the new version
git tag v1.3.5

# Push the tag to trigger the release workflow
git push origin v1.3.5
```

#### 4. Monitor the Release Process

1. Go to the **Actions** tab in your GitHub repository
2. Watch the "Build and Release" workflow progress
3. The workflow will:
   - Build for Windows, macOS, and Linux
   - Run tests and type checking
   - Create platform-specific installers
   - Upload all artifacts to a GitHub release

#### 5. Verify the Release

Once the workflow completes:

1. Go to the **Releases** page in your GitHub repository
2. Verify the new release contains all expected files:
   - **Windows**: `.exe`, `.msi`, `.zip` files
   - **macOS**: `.dmg`, `.zip` files
   - **Linux**: `.AppImage`, `.deb`, `.snap` files
3. The release should be automatically published (not draft)

### Automated Release Contents

Each release automatically includes:

- **Cross-platform installers** for Windows, macOS, and Linux
- **Auto-updater metadata** files (`latest.yml`, `latest-mac.yml`, `latest-linux.yml`)
- **Automatic release notes** generated from commit messages
- **Checksums and signatures** for security verification

### Manual Release (Alternative)

If you prefer manual control over releases:

1. Go to GitHub repository → **Actions** tab
2. Select "Manual Build" workflow
3. Click "Run workflow"
4. Choose the platform(s) to build
5. Download artifacts and create release manually

### Troubleshooting

#### Build Failures

- **TypeScript errors**: Run `npm run typecheck` locally first
- **Dependency issues**: Try `rm -rf node_modules package-lock.json && npm install`
- **Platform-specific issues**: Check the Actions logs for detailed error messages

#### Release Issues

- **Permission errors**: Ensure the repository has proper GitHub Actions permissions
- **Duplicate files**: The workflow automatically handles platform-specific file naming
- **Draft releases**: Check the workflow configuration if releases are created as drafts

### Auto-Updater

The application includes built-in auto-updater functionality:

- **Automatic checking**: Checks for updates every 4 hours (configurable)
- **User notifications**: Desktop notifications for available updates
- **Background downloads**: Downloads updates in the background with user consent
- **Graceful installation**: Prompts user to restart when ready to install

Users can also manually check for updates via the application menu: `Help → Check for Updates`
