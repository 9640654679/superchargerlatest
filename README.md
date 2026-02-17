# SuperCharger -- Advanced Quiz & Survey Platform

A comprehensive quiz and survey platform built with Next.js, Supabase, and AI integration. Create, manage, and analyze quizzes with powerful analytics and AI-powered insights.

## 🚀 Quick Start

Get SuperCharger up and running in minutes. See the [Deployment Guide](./DEPLOYMENT.md) for detailed deployment instructions.

## 📑 Table of Contents

- [Features](#-features)
- [Technology Stack](#️-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Database Schema](#-database-schema)
- [Usage Guide](#-usage-guide)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Additional Resources](#-additional-resources)

## ✨ Features

### 🎯 Core Quiz Functionality
- **Quiz Creation & Management**: Create quizzes with multiple questions and customizable options
- **Manual & AI-Powered Creation**: Build quizzes manually or use AI to generate questions automatically
- **Flexible Scoring System**: Assign points to different answer options for sophisticated scoring
- **Publish & Share**: Publish quizzes and share them via public links
- **Real-time Editing**: Edit quiz content, questions, and options with live updates

### 🤖 AI Integration
- **Gemini AI Integration**: Powered by Google's Gemini AI for content generation
- **Smart Question Generation**: Generate quiz questions based on topics and requirements
- **Context-Aware AI**: AI understands existing quiz content to generate non-redundant questions
- **AI-Powered Analytics**: Get intelligent insights and analysis of quiz responses
- **Personalized Feedback**: AI-generated personalized summaries and recommendations

### 📊 Advanced Analytics & Reporting
- **Comprehensive Response Analytics**: Track and analyze all quiz responses
- **Visual Data Representation**: Interactive charts and graphs using Chart.js
- **Filtering & Search**: Filter responses by date, score range, and specific questions
- **Statistical Insights**: Average scores, min/max points, response distribution
- **Individual Response Tracking**: View detailed responses for each participant

### 🔐 Authentication & Security
- **Supabase Authentication**: Secure user authentication with email/password
- **Protected Routes**: Role-based access control for quiz management
- **Session Management**: Persistent sessions across browser refreshes
- **Password Reset**: Secure password reset functionality
- **User Profile Management**: Manage user accounts and preferences

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme**: Toggle between light and dark themes
- **Gradient Backgrounds**: Beautiful gradient designs throughout the application
- **Interactive Components**: Smooth animations and hover effects
- **Accessibility**: Built with accessibility best practices

### 📱 User Experience
- **Intuitive Dashboard**: Clean and organized quiz management interface
- **Real-time Updates**: Live updates when publishing or modifying quizzes
- **Copy-to-Clipboard**: Easy sharing with one-click link copying
- **Progress Indicators**: Loading states and progress feedback
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🛠️ Technology Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Modern component library
- **Lucide React**: Beautiful icon library
- **Chart.js**: Data visualization and analytics
- **React Chart.js 2**: React wrapper for Chart.js

### Backend & Database
- **Supabase**: Backend-as-a-Service platform
- **PostgreSQL**: Robust relational database
- **Supabase Auth**: Authentication and user management
- **Supabase SSR**: Server-side rendering support

### AI & External Services
- **Google Gemini AI**: AI content generation and analysis
- **@google/genai**: Official Google Gemini SDK

### Development Tools
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

### Styling & Theming
- **Tailwind CSS**: Utility-first styling
- **CSS Variables**: Dynamic theming support
- **next-themes**: Theme switching functionality
- **Tailwind Animate**: Animation utilities

## 📁 Project Structure

```
supercharger/
├── app/                          # Next.js App Router
│   ├── (auth-pages)/            # Authentication pages
│   │   ├── sign-in/             # Login page
│   │   ├── sign-up/             # Registration page
│   │   ├── forgot-password/     # Password reset
│   │   └── layout.tsx           # Auth layout
│   ├── auth/                    # Authentication handlers
│   │   └── callback/            # OAuth callbacks
│   ├── protected/               # Protected user routes
│   │   ├── quizzes/             # Quiz management
│   │   │   ├── new/             # Create new quiz
│   │   │   ├── [id]/            # Individual quiz management
│   │   │   │   ├── edit/        # Edit quiz
│   │   │   │   └── responses/   # View responses
│   │   │   └── page.tsx         # Quiz list
│   │   └── page.tsx             # Dashboard
│   ├── quiz/                    # Public quiz pages
│   │   └── [id]/                # Take quiz
│   │       └── result/          # Quiz results
│   ├── actions.ts               # Server actions
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── ui/                      # UI components (shadcn/ui)
│   ├── marketing/               # Marketing page components
│   ├── tutorial/                # Onboarding components
│   └── ...                      # Other components
├── utils/                       # Application utilities
│   ├── supabase/                # Supabase configuration
│   │   ├── client.ts            # Browser client
│   │   ├── server.ts            # Server client
│   │   ├── middleware.ts        # Auth middleware
│   │   └── check-env-vars.ts    # Environment validation
│   └── utils.ts                 # Additional utilities
├── middleware.ts                # Next.js middleware
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind configuration
├── supabase-migration.sql       # Database schema migration
├── package.json                 # Dependencies and scripts
├── README.md                    # This file
└── DEPLOYMENT.md                # Deployment guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd supercharger
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
   
   **Where to find these values:**
   - **Supabase**: Go to your project dashboard → Settings → API
   - **Gemini API**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to create an API key

4. **Set up Supabase database**
   
   - Navigate to your Supabase project dashboard
   - Go to **SQL Editor**
   - Copy the contents of `supabase-migration.sql`
   - Paste and execute the SQL script
   - Verify all tables are created successfully
   
   **Important Notes:**
   - Do NOT enable RLS on `auth.users` - it's managed by Supabase Auth and will cause an error
   - The migration includes complete RLS policies for all tables
   - All tables use UUID primary keys with cascade deletes for referential integrity

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📊 Database Schema

The application uses a relational database schema with the following main entities:

### Tables
- **quizzes**: Store quiz metadata and settings
- **questions**: Individual questions within quizzes
- **options**: Answer options for each question
- **responses**: User submissions for quizzes
- **answers**: Specific answers selected by users

### Key Features
- **UUID Primary Keys**: Secure, non-sequential identifiers
- **Cascade Deletes**: Maintains referential integrity
- **Timestamps**: Automatic creation time tracking
- **Row Level Security**: Database-level access control
- **Flexible Scoring**: Points-based scoring system

## 🎯 Usage Guide

### Creating Quizzes
1. **Sign up/Login** to your account
2. **Navigate to Dashboard** and click "Create New Quiz"
3. **Choose Creation Method**:
   - Manual: Build questions step by step
   - AI: Generate questions automatically using Gemini AI
4. **Configure Quiz**:
   - Add title and description
   - Set up questions and options
   - Assign points to different answers
5. **Save and Publish** your quiz

### Taking Quizzes
1. **Access Public Link** shared by quiz creator
2. **Answer Questions** by selecting options
3. **Submit Responses** to see results
4. **View Detailed Results** with AI analysis

### Analyzing Responses
1. **Access Quiz Management** from your dashboard
2. **View Response Analytics** with filtering options
3. **Generate AI Insights** for comprehensive analysis
4. **Export Data** for further analysis

## 🔧 Configuration

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `GEMINI_API_KEY`: Google Gemini API key for AI features

**Gemini API Configuration:**
- **Model**: Uses `gemini-3-flash-preview` (latest model)
- **Rate Limits**: Automatic retry logic with exponential backoff for rate limit errors (429)
- **Quota**: Free tier has limited requests per day/minute
- **Quota Status**: Check your quota at [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Documentation**: Latest API docs at [Google AI Documentation](https://ai.google.dev/gemini-api/docs)

### Customization
- **Themes**: Modify `tailwind.config.ts` for custom styling
- **Components**: Extend shadcn/ui components in `components/ui/`
- **Database**: Add custom fields to existing tables as needed

## 🚀 Deployment

For detailed deployment instructions, see the **[Deployment Guide](./DEPLOYMENT.md)**.

### Quick Deploy Options

- **Vercel** (Recommended): One-click deployment with automatic HTTPS and CDN
- **Netlify**: Compatible with Next.js with plugin support
- **Railway**: Full-stack deployment with built-in PostgreSQL option
- **DigitalOcean**: App Platform with managed infrastructure
- **Self-Hosted**: Docker or traditional server deployment

The deployment guide includes step-by-step instructions for all platforms, troubleshooting tips, and post-deployment configuration.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Supabase Team** for the powerful backend platform
- **Google** for Gemini AI capabilities
- **shadcn/ui** for the beautiful component library
- **Vercel** for deployment and hosting

## 📚 Additional Resources

- **[Deployment Guide](./DEPLOYMENT.md)**: Comprehensive deployment instructions for all platforms
- **[Supabase Documentation](https://supabase.com/docs)**: Learn more about Supabase features
- **[Next.js Documentation](https://nextjs.org/docs)**: Next.js framework documentation
- **[Google Gemini API](https://ai.google.dev/gemini-api/docs)**: AI API documentation

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the [Deployment Guide](./DEPLOYMENT.md) for deployment-related questions
- Review application logs for debugging

---

**Built with ❤️ using Next.js, Supabase, and AI**
