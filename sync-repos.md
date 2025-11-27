# Repository Sync Guide

This project maintains both a **private** and **public** repository for syncing code.

## Repository Setup

### Current Remotes
- `origin` (private) - Your main development repository
- `public` (public) - Public open-source repository

## Workflow

### Initial Setup (One-time)

1. **Create public repository** on GitHub (if not already created)
   - Name it: `family-activity-finder-planner` (or your preferred name)
   - Make it public
   - Don't initialize with README (we'll push existing code)

2. **Add public remote**:
   ```bash
   git remote add public https://github.com/YOUR_USERNAME/family-activity-finder-planner-public.git
   ```

3. **Verify remotes**:
   ```bash
   git remote -v
   ```

### Syncing Private → Public

When you want to push changes from private to public:

```bash
# Make sure you're on the branch you want to sync (usually main)
git checkout main

# Push to public repository
git push public main

# Or push all branches
git push public --all
```

### Syncing Public → Private

When you want to pull changes from public to private:

```bash
# Fetch from public
git fetch public

# Merge public changes into your current branch
git merge public/main

# Or if you want to see what's different first
git log origin/main..public/main
```

### Bidirectional Sync

To sync both ways (merge changes from both repos):

```bash
# 1. Fetch from both remotes
git fetch origin
git fetch public

# 2. Check what's different
git log origin/main..public/main  # Changes in public not in private
git log public/main..origin/main  # Changes in private not in public

# 3. Merge public into private (if needed)
git checkout main
git merge public/main

# 4. Merge private into public (if needed)
git push public main
```

## Important: What Stays Private

These files/directories should **NEVER** be pushed to public:

- ✅ `.env` files (API keys, secrets)
- ✅ `certs/` directory (SSL certificates)
- ✅ Any files with sensitive credentials
- ✅ Private notes or internal documentation

### Verify Before Pushing to Public

Before pushing to public, check what will be pushed:

```bash
# See what would be pushed
git log public/main..origin/main --oneline

# Check for sensitive files
git diff public/main origin/main --name-only | grep -E '\.env|certs|secret'
```

## Quick Commands Reference

```bash
# Push private → public
git push public main

# Pull public → private
git fetch public && git merge public/main

# See differences
git log origin/main..public/main
git diff origin/main public/main

# Sync both ways
git fetch origin && git fetch public
git merge public/main
git push public main
```

## Troubleshooting

### If you accidentally push secrets to public:
1. **Immediately** rotate/regenerate the exposed credentials
2. Remove from git history (requires force push - be careful!)
3. Add to `.gitignore` to prevent future commits

### Merge conflicts:
- Resolve conflicts as normal
- Private repo takes precedence for sensitive files
- Public repo can have sanitized versions (e.g., `.env.example`)


