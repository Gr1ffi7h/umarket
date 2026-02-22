# UMarket Deployment Guide

## ✅ Pre-Deployment Checklist

### Environment Variables
- [ ] `.env.local` created with Supabase credentials
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set to your Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set to your Supabase anon key
- [ ] Environment variables added to Vercel dashboard

### Build Verification
- [ ] `npm run build` completes successfully
- [ ] No TypeScript errors
- [ ] No ESLint warnings blocking build
- [ ] All pages compile correctly

### Page Testing
- [ ] Landing page (`/`) loads correctly
- [ ] Browse page (`/browse`) displays listings
- [ ] Create Listing (`/create-listing`) form works
- [ ] My Listings (`/my-listings`) shows user listings
- [ ] Profile (`/profile`) loads user data
- [ ] Edit Profile (`/profile/edit`) form works
- [ ] Messages (`/messages`) loads conversation list
- [ ] Admin panel (`/admin`) accessible to admins
- [ ] Login/Signup pages work correctly

### Functionality Testing
- [ ] Authentication flow works (login/signup)
- [ ] Protected routes redirect to login
- [ ] Supabase database operations work
- [ ] Real-time updates function
- [ ] Responsive design on mobile/desktop
- [ ] Image optimization with next/image
- [ ] Navigation between pages works

### Production Deployment
- [ ] Code pushed to GitHub
- [ ] Vercel project connected to repository
- [ ] Environment variables configured in Vercel
- [ ] Deployment successful
- [ ] Live site loads correctly

## 🚀 Quick Deploy Commands

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. Test build locally
npm run build

# 4. Start production server
npm start

# 5. Deploy to Vercel
vercel --prod
```

## 🔧 Environment Variables Setup

### Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create new project or select existing
3. Go to Project Settings > API
4. Copy Project URL and anon key
5. Add to `.env.local` and Vercel environment variables

### Vercel Environment Variables
1. Go to your Vercel project dashboard
2. Settings > Environment Variables
3. Add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Redeploy project

## 🐛 Common Issues & Solutions

### Build Errors
- **TypeScript errors**: Check all interfaces and types
- **Import errors**: Verify all import paths are correct
- **ESLint errors**: Fix linting issues or disable during build

### Runtime Errors
- **Supabase connection**: Check environment variables
- **Auth issues**: Verify Supabase auth configuration
- **Blank pages**: Check console for JavaScript errors

### Environment Issues
- **Missing variables**: Ensure all required env vars are set
- **Wrong URLs**: Double-check Supabase project URL
- **Permission issues**: Verify anon key has correct permissions

## 📱 Cross-Device Testing

### Desktop (Chrome/Firefox/Safari)
- [ ] All pages load correctly
- [ ] Navigation works smoothly
- [ ] Forms submit properly
- [ ] Images load and display correctly

### Mobile (iOS/Android)
- [ ] Responsive design works
- [ ] Touch interactions work
- [ ] Mobile navigation functions
- [ ] Performance is acceptable

### Tablet
- [ ] Layout adapts correctly
- [ ] All features accessible
- [ ] Performance optimized

---

## Vercel Configuration

### Runtime Configuration Fix
- **Error**: "Function Runtimes must have a valid version"
- **Cause**: Invalid runtime specification `nodejs18.x` in vercel.json
- **Solution**: Removed manual runtime configuration to allow Vercel auto-detection

### Why Runtime Config Was Removed

1. **Vercel Auto-Detection**: Vercel automatically detects the appropriate Node.js runtime for Next.js projects
2. **Version Conflicts**: Manual runtime specifications can conflict with Vercel's optimization
3. **Best Practice**: Let Vercel handle runtime selection for optimal performance

### Current Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  }
}
```

### Deployment Benefits

- ✅ **Automatic Runtime Detection**: Vercel selects optimal Node.js version
- ✅ **No Runtime Conflicts**: Eliminates version specification errors
- ✅ **Standard Next.js Behavior**: Uses default Next.js deployment patterns
- ✅ **Serverless Compatibility**: All API routes remain serverless-compatible

### Environment Variables

Configure these in Vercel Dashboard (not in vercel.json):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `NODE_ENV`: Automatically set to "production" by Vercel
- Any other variables from `.env.example`

### Best Practices

1. **Avoid Manual Runtime Specs**: Let Vercel handle runtime detection
2. **Use Standard Framework Spec**: `"framework": "nextjs"` is sufficient
3. **Configure Env Vars in Dashboard**: Don't hardcode in vercel.json
4. **Keep Config Minimal**: Only specify what's necessary

### API Routes

All API routes in `src/app/api/` will automatically:
- Use Vercel's optimal Node.js runtime
- Remain serverless-compatible
- Scale automatically with demand
- Support edge computing when needed

This configuration ensures reliable, conflict-free deployments on Vercel.
