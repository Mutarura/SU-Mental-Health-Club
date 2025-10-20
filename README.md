
# Strathmore Mental Health Club Website

Official website for the Strathmore University Mental Health Club - promoting mental wellness and providing resources for the university community.

## 🎯 Project Overview

This is a modern, responsive web application built with Next.js 15, featuring:
- **Mental Health Resources**: Comprehensive guides and support materials
- **Event Management**: Upcoming events and workshops
- **Peer Support System**: Connect students with peer counselors
- **Admin Dashboard**: Content management and user administration
- **Responsive Design**: Optimized for desktop and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd strathmore-mental-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   ```bash
   # Initialize Supabase (if not already done)
   npx supabase init
   
   # Run migrations
   npx supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
strathmore-mental-health/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/             # About page
│   │   ├── admin/             # Admin dashboard
│   │   ├── events/            # Events listing
│   │   ├── peer-support/      # Peer support system
│   │   ├── resources/         # Mental health resources
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx          # Homepage
│   │   └── globals.css       # Global styles
│   ├── components/            # Reusable React components
│   │   ├── layout/           # Layout components (Navbar, Footer)
│   │   ├── ui/               # UI components
│   │   ├── about/            # About page components
│   │   ├── admin/            # Admin components
│   │   ├── events/           # Event components
│   │   ├── home/             # Homepage components
│   │   ├── peer-support/     # Peer support components
│   │   ├── resources/        # Resource components
│   │   └── Logo.tsx          # University logo component
│   ├── lib/                  # Utility libraries
│   │   └── supabase.ts       # Supabase client configuration
│   └── types/                # TypeScript type definitions
│       └── database.types.ts # Database type definitions
├── supabase/                 # Supabase configuration
│   └── migrations/           # Database migrations
├── public/                   # Static assets
├── tailwind.config.js        # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Project dependencies
```

## 🎨 Design System

### Brand Colors (Strathmore University)
- **Primary Blue**: `#3A5DAE` (Pantone 7455 C)
- **Secondary Red**: `#E03C31` (Pantone 179 C) 
- **Accent Gold**: `#EED484` (Pantone 7403 C)
- **Text Black**: `#2D2926` (Pantone Black C)

### Typography
- **Primary Font**: Gill Sans
- **Fallback**: Inter, system-ui, sans-serif

### Component Sizes
- **Logo**: sm (40px), md (64px), lg (80px), xl (96px)
- **Responsive**: Mobile-first approach with Tailwind breakpoints

## 🔧 Key Features

### 1. Homepage
- Hero section with call-to-action
- Featured events and resources
- Quick access to support services

### 2. Mental Health Resources
- Categorized resource library
- Search and filter functionality
- External resource links

### 3. Events System
- Event calendar integration
- Event registration (future enhancement)
- Past event archives

### 4. Peer Support
- Peer counselor directory
- Support group information
- Crisis contact information

### 5. Admin Dashboard
- User authentication via Supabase
- Content management
- Event management
- User administration

## 🗄️ Database Schema

The application uses Supabase PostgreSQL with the following main tables:
- `events` - Event information and scheduling
- `resources` - Mental health resources and materials
- `peer_counselors` - Peer support staff information
- `users` - User authentication and profiles

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
# Build the application
npm run build

# Start production server
npm run start
```

## 🔒 Environment Variables

Required environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🛠️ Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Tailwind CSS for styling
- Implement responsive design patterns

### Component Structure
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Follow atomic design principles
- Use 'use client' directive for client-side components

### Performance
- Optimize images with Next.js Image component
- Implement proper loading states
- Use React.memo for expensive components
- Minimize bundle size with dynamic imports

## 📞 Support & Maintenance

### Common Issues
1. **Build Errors**: Check TypeScript types and imports
2. **Styling Issues**: Verify Tailwind configuration
3. **Database Errors**: Check Supabase connection and migrations

### Maintenance Tasks
- Regular dependency updates
- Database backup and monitoring
- Performance monitoring
- Security updates

## 📄 License

This project is developed for Strathmore University Mental Health Club. All rights reserved.

## 🤝 Contributing

For internal development team:
1. Create feature branches from `main`
2. Follow conventional commit messages
3. Test thoroughly before merging
4. Update documentation as needed

## 📧 Contact

For technical support or questions:
- **Development Team**: [Add contact information]
- **Mental Health Club**: [Add club contact information]
- **University IT Support**: [Add IT contact information]

---

**Built with ❤️ for Strathmore University Mental Health Club**
=======
# strathmore-mental-health-club

