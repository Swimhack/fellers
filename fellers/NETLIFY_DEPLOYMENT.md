# Netlify Deployment Configuration
## Fellers Resources - https://fellersresources.com

### 🚀 **Automatic Deployment Setup**

This project is configured for automatic deployment to Netlify from the GitHub repository: https://github.com/Swimhack/fellers.git

---

## 📁 **Build Configuration**

### Build Settings
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node.js Version:** 18
- **Framework:** Vite + React + TypeScript

### Files Created:
- `netlify.toml` - Main Netlify configuration
- `public/_redirects` - SPA routing redirects

---

## 🔧 **Environment Variables**

### Required Environment Variables in Netlify Dashboard:

1. **VITE_SUPABASE_URL**
   - Value: `https://ksmehxxzhtjqilrmikxb.supabase.co`
   - Description: Supabase project URL for database and edge functions

2. **VITE_SUPABASE_ANON_KEY**
   - Value: [Get from Supabase Dashboard → Settings → API]
   - Description: Supabase anonymous/public key for client-side access

### Optional Environment Variables:

3. **VITE_SUPABASE_SERVICE_ROLE_KEY**
   - Value: [Get from Supabase Dashboard → Settings → API]
   - Description: Service role key for admin operations

4. **RESEND_API_KEY**
   - Value: [Get from Resend Dashboard]
   - Description: API key for email sending service

5. **FROM_EMAIL**
   - Value: `dispatch@fellersresources.com`
   - Description: Email address for sending notifications

6. **TO_EMAIL**
   - Value: `dispatch@fellersresources.com`
   - Description: Email address to receive contact form submissions

---

## 🌐 **Domain Configuration**

### Custom Domain Setup:
1. In Netlify Dashboard → Domain Settings
2. Add custom domain: `fellersresources.com`
3. Configure DNS records:
   - **A Record:** `@` → Netlify IP
   - **CNAME:** `www` → `fellersresources.netlify.app`

### SSL Certificate:
- ✅ Automatically provisioned by Netlify
- ✅ HTTP to HTTPS redirect enabled

---

## 🔄 **Deployment Process**

### Automatic Deployment Triggers:
1. **Push to main branch** → Triggers production build
2. **Pull request creation** → Triggers deploy preview
3. **Branch pushes** → Triggers branch deploys

### Build Process:
1. Netlify pulls code from GitHub
2. Installs dependencies: `npm install`
3. Runs build command: `npm run build`
4. Publishes `dist` folder contents
5. Configures redirects and headers

---

## 📋 **Manual Deployment Steps**

If setting up Netlify for the first time:

### 1. Connect Repository
```
1. Log into Netlify Dashboard
2. Click "New site from Git"
3. Choose GitHub provider
4. Select repository: Swimhack/fellers
5. Branch: main
6. Build command: npm run build
7. Publish directory: dist
```

### 2. Configure Environment Variables
```
1. Go to Site Settings → Environment Variables
2. Add each required variable listed above
3. Save configuration
```

### 3. Configure Domain
```
1. Go to Domain Settings
2. Add custom domain: fellersresources.com
3. Update DNS records as shown above
4. Enable HTTPS redirect
```

---

## 🛡️ **Security Configuration**

### Security Headers (in netlify.toml):
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block
- ✅ X-Content-Type-Options: nosniff
- ✅ Referrer-Policy: strict-origin-when-cross-origin
- ✅ Permissions-Policy restrictions

### Caching Strategy:
- ✅ Static assets: 1 year cache
- ✅ Images: 1 year cache
- ✅ HTML: No cache (for SPA updates)

---

## 🔍 **Performance Optimization**

### Build Optimizations:
- ✅ CSS bundling and minification
- ✅ JavaScript bundling and minification
- ✅ HTML pretty URLs
- ✅ Asset compression

### Lighthouse Plugin:
- ✅ Performance: 80%+ target
- ✅ Accessibility: 90%+ target
- ✅ Best Practices: 80%+ target
- ✅ SEO: 80%+ target

---

## 🧪 **Testing Deployment**

### After Deployment, Test:

1. **Main Site**
   - [ ] https://fellersresources.com loads correctly
   - [ ] All sections render properly
   - [ ] Contact form works
   - [ ] Gallery images display

2. **Admin Panel**
   - [ ] https://fellersresources.com/admin/ loads
   - [ ] Login works with credentials: admin / fellers123
   - [ ] Admin dashboard accessible
   - [ ] Image upload functions

3. **Routing**
   - [ ] Direct URLs work (e.g., /admin/dashboard)
   - [ ] Browser back/forward buttons work
   - [ ] 404 pages redirect properly

4. **Performance**
   - [ ] Site loads quickly
   - [ ] Images are optimized
   - [ ] No console errors

---

## 🚨 **Troubleshooting**

### Common Issues:

1. **Build Fails**
   - Check Node.js version (should be 18)
   - Verify all dependencies in package.json
   - Check for TypeScript errors

2. **Routes Not Working**
   - Verify _redirects file in public folder
   - Check netlify.toml redirects configuration
   - Ensure SPA routing is properly set up

3. **Environment Variables**
   - Double-check all required variables are set
   - Verify Supabase keys are correct
   - Test database connectivity

4. **Admin Login Issues**
   - Verify credentials: admin / fellers123
   - Check browser console for errors
   - Clear localStorage if needed

---

## 📈 **Monitoring**

### Netlify Analytics:
- ✅ Pageview tracking enabled
- ✅ Form submission monitoring
- ✅ Build and deploy logs

### Uptime Monitoring:
- Consider setting up external monitoring for:
  - Main site availability
  - Admin panel accessibility
  - Contact form functionality

---

## 🔄 **Updates and Maintenance**

### Automatic Updates:
- Code changes pushed to GitHub automatically deploy
- Dependencies can be updated via package.json
- Environment variables can be updated in Netlify dashboard

### Manual Maintenance:
- Monitor build logs for errors
- Update environment variables as needed
- Review performance metrics monthly

---

## ✅ **Deployment Checklist**

Before going live:
- [ ] All environment variables configured
- [ ] Custom domain connected
- [ ] SSL certificate active
- [ ] Admin login tested
- [ ] Contact form tested
- [ ] Gallery functionality tested
- [ ] Performance optimized
- [ ] Security headers configured

**Status: READY FOR AUTOMATIC DEPLOYMENT** 🚀

