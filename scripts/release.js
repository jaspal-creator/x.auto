#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

// Get the version type from command line arguments
const versionType = process.argv[2];
const validTypes = ['patch', 'minor', 'major'];

if (!versionType || !validTypes.includes(versionType)) {
  console.error('❌ Usage: npm run release:patch | npm run release:minor | npm run release:major');
  console.error('   Or: node scripts/release.js <patch|minor|major>');
  process.exit(1);
}

function runCommand(command, description) {
  console.log(`🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function getNewVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}`);
  }
}

async function main() {
  console.log(`🚀 Starting ${versionType} release process...`);

  // Check if we're on the correct branch
  try {
    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
    if (currentBranch !== 'main') {
      console.log(`⚠️  Warning: You're on branch '${currentBranch}', not 'main'`);
      console.log('   Make sure this is intentional before proceeding.');
    }
  } catch (error) {
    console.error('❌ Failed to check current branch:', error.message);
    process.exit(1);
  }

  // Check for uncommitted changes
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.error('❌ You have uncommitted changes. Please commit or stash them first.');
      console.log('Uncommitted changes:');
      console.log(status);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to check git status:', error.message);
    process.exit(1);
  }

  const currentVersion = getCurrentVersion();
  const newVersion = getNewVersion(currentVersion, versionType);

  console.log(`📦 Current version: ${currentVersion}`);
  console.log(`📦 New version: ${newVersion}`);

  // Pre-release checks
  // runCommand('npm run lint', 'Running linter');
  runCommand('npm run typecheck', 'Type checking');
  runCommand('npm run build', 'Building application');

  // Update version
  runCommand(
    `npm version ${versionType} --no-git-tag-version`,
    `Updating version to ${newVersion}`
  );

  // Commit version change
  runCommand(`git add package.json package-lock.json`, 'Staging version changes');
  runCommand(`git commit -m "chore: bump version to ${newVersion}"`, 'Committing version bump');

  // Create and push tag
  runCommand(
    `git tag -a v${newVersion} -m "Release v${newVersion}"`,
    `Creating tag v${newVersion}`
  );
  runCommand('git push origin main', 'Pushing changes to main branch');
  runCommand('git push origin --tags', 'Pushing tags');

  console.log('🎉 Release process completed successfully!');
  console.log(`📋 Next steps:`);
  console.log(`   • GitHub Actions will automatically build and create the release`);
  console.log(`   • Check https://github.com/C0L2/x.auto/actions for build progress`);
  console.log(
    `   • Release will be available at https://github.com/C0L2/x.auto/releases/tag/v${newVersion}`
  );
}

main().catch((error) => {
  console.error('❌ Release process failed:', error.message);
  process.exit(1);
});
