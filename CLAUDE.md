# Fellers Resources - Claude Code Configuration

## Project Overview
Fellers Resources is a professional tree service company website built with modern web technologies. The project includes a main React/Vite application and a Next.js web development platform.

## Project Structure

### Main Application (`/fellers/`)
- **Framework**: React + Vite + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query (@tanstack/react-query)
- **Routing**: React Router DOM
- **Email**: EmailJS for contact forms
- **File Management**: Image compression and gallery management

### Web Development Platform (`/web-dev-platform/`)
- **Framework**: Next.js
- **Purpose**: Additional web development tools and platform

## Key Features

### Core Functionality
- **Service Portfolio**: Tree removal, trimming, stump grinding, emergency services
- **Image Gallery**: Dynamic gallery with admin upload capabilities
- **Contact System**: Contact forms with EmailJS integration
- **Google Reviews**: Integration for displaying customer reviews
- **Service Area Map**: Interactive service area display
- **Admin Dashboard**: Full admin panel for content management

### Admin Features
- **Gallery Management**: Upload, organize, and manage project photos
- **Bulk Image Upload**: Efficient batch image processing
- **Image Compression**: Automatic optimization for web performance
- **Content Management**: Update services, testimonials, and site content

## Technical Stack

### Frontend
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.1
- Tailwind CSS 3.4.11
- shadcn/ui component library
- Lucide React icons

### Backend & Database
- Supabase (PostgreSQL database)
- Supabase Functions for server-side logic
- Row Level Security (RLS) policies

### Key Dependencies
- `@supabase/supabase-js`: Database and authentication
- `react-hook-form`: Form management
- `emailjs-com`: Email service integration
- `embla-carousel-react`: Image carousels
- `react-router-dom`: Client-side routing
- `@tanstack/react-query`: Server state management

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Development build
npm run build:dev

# Preview build
npm run preview

# Linting
npm run lint
```

## Environment Setup

### Required Environment Variables
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_USER_ID=your_emailjs_user_id
```

## Database Schema

### Gallery Images Table
```sql
CREATE TABLE gallery_images (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  alt TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Contact Submissions Table
```sql
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## File Structure

### Core Components
- `Header.tsx`: Main navigation and logo
- `Hero.tsx`: Hero section with rotating background images
- `ServicesGrid.tsx`: Service offerings display
- `Gallery.tsx`: Project photo gallery
- `ContactForm.tsx`: Contact form with EmailJS integration
- `AdminDashboardLayout.tsx`: Admin panel layout

### Utility Files
- `galleryUtils.ts`: Gallery image management
- `imageCompressionUtils.ts`: Image optimization
- `storageManager.ts`: Local/session storage management
- `imageProcessor.ts`: Image processing workflows

### Admin Features
- `AdminLogin.tsx`: Admin authentication
- `AdminGallery.tsx`: Gallery management interface
- `AdminBulkUpload.tsx`: Bulk image upload functionality

## Deployment Notes

### Build Optimization
- Image compression and optimization
- Code splitting with dynamic imports
- Tailwind CSS purging for smaller bundle size
- Vite build optimization

### Performance Considerations
- Lazy loading for gallery images
- Image preloading for critical content
- React Query for efficient data fetching
- Mobile-optimized responsive design

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Component-based architecture
- Custom hooks for reusable logic

### Image Management
- Automatic compression for uploaded images
- Multiple format support (JPEG, PNG, WebP)
- Gallery order management
- Admin-controlled content

### Responsive Design
- Mobile-first approach
- Tailwind breakpoints: sm, md, lg, xl
- Mobile bottom navigation bar
- Touch-friendly admin interface

## Contact & Support
- Business: Tree service and landscaping
- Service Areas: [Define service areas]
- Contact: Through website contact form
- Admin Access: Secure login for content management

## Security Features
- Supabase Row Level Security (RLS)
- Admin authentication
- Secure file uploads
- Environment variable protection

## Claude Development Notes
When working on this project:
1. Use the existing component structure and styling patterns
2. Maintain TypeScript type safety
3. Follow the established file organization
4. Test admin functionality thoroughly
5. Ensure mobile responsiveness
6. Optimize images for web performance
7. Use Supabase best practices for database operations

## Permissions
Claude has permission to access and modify:
- All source code files in `/fellers/src/`
- Configuration files (package.json, vite.config.ts, etc.)
- Component files and utilities
- Admin dashboard functionality
- Database schema and queries
- Build and deployment configurations