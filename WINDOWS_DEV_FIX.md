# Windows Development Server Fix

## Issue

When running the development server on Windows, you may encounter errors like:

```
⨯ [Error: ENOENT: no such file or directory, open '...\trackappli\.next\static\development\_buildManifest.js.tmp.xxxxx']
```

## Root Cause

This is a known issue with **Turbopack** on Windows systems, particularly when:
- Windows Defender or antivirus is scanning files
- OneDrive is syncing the project folder
- File system operations are slower due to path length or permissions

## Solution

We've updated the scripts to use the standard Next.js compiler by default, which is more stable on Windows.

### Updated Scripts:

- `npm run dev` - Standard Next.js dev server (recommended for Windows)
- `npm run dev:turbo` - Turbopack dev server (if you want to try it)
- `npm run build` - Standard production build
- `npm run build:turbo` - Turbopack production build

### Steps to Fix:

1. **Stop any running dev servers** (Ctrl+C)

2. **Clear the .next cache:**
   ```bash
   rm -rf .next
   # or on Windows PowerShell:
   Remove-Item -Recurse -Force .next
   ```

3. **Start the dev server without Turbopack:**
   ```bash
   npm run dev
   ```

4. **Visit your landing page** - The errors should be gone!

## Additional Windows Optimizations

If you still experience issues:

### 1. Exclude from Windows Defender
Add your project folder to Windows Defender exclusions:
- Open Windows Security
- Go to Virus & threat protection
- Manage settings → Exclusions
- Add your project folder

### 2. Disable OneDrive Sync (if applicable)
If your project is in OneDrive:
- Right-click the project folder
- Choose "Always keep on this device"
- Or move the project outside OneDrive

### 3. Use Shorter Path
Windows has path length limitations. If your path is very long:
```
C:\Users\medba\OneDrive\Bureau\tom code\trakappli\trackappli
```

Consider moving to a shorter path like:
```
C:\dev\trackappli
```

### 4. Run as Administrator (last resort)
If nothing else works, try running your terminal as Administrator.

## Performance Comparison

| Mode | Build Speed | Hot Reload | Windows Stability |
|------|-------------|------------|-------------------|
| Standard | Normal | Fast | ✅ Excellent |
| Turbopack | Faster | Very Fast | ⚠️ Can have issues |

For Windows development, we recommend using the **standard mode** (`npm run dev`) for stability.

## When to Use Turbopack

Turbopack is great for:
- ✅ Linux/Mac development
- ✅ CI/CD pipelines
- ✅ Large projects where speed is critical
- ✅ Systems with fast SSDs and no antivirus interference

## Verification

After applying the fix, you should see:
```bash
npm run dev

> trackappli@0.1.0 dev
> next dev

  ▲ Next.js 15.5.6
  - Local:        http://localhost:3000

✓ Ready in 2.5s
```

No more ENOENT errors! 🎉

---

**Note:** The production build (`npm run build`) works fine with or without Turbopack. This issue only affects the development server on Windows.
