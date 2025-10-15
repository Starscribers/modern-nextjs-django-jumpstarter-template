'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  TrendingUp,
  Users,
  Zap,
  Star,
  CheckCircle,
  Code,
  Github,
  Twitter,
  Sun,
  Moon,
  Rocket
} from 'lucide-react';

export default function Home() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      className="relative min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Rocket className="size-8 text-primary" />
              <span className="text-xl font-bold">
                Modern Django Template
              </span>
            </div>

            <div className="hidden items-center space-x-8 md:flex">
              <button
                onClick={toggleTheme}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </button>

              <Link href="/auth/login">
                <Button variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button>
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        className="relative flex min-h-screen items-center px-4 pb-20 pt-24 sm:px-6 lg:px-8"
        variants={itemVariants}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-10 top-20 h-72 w-72 animate-float rounded-full bg-primary/10 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 h-96 w-96 animate-float-delayed rounded-full bg-primary/10 blur-3xl"></div>
        </div>

        <div className="mx-auto max-w-7xl text-center">
          <motion.h1
            className="mb-6 text-5xl font-bold leading-tight md:text-7xl"
            variants={itemVariants}
          >
            Build Modern Web Apps
            <br />
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Faster Than Ever
            </span>
          </motion.h1>
          <motion.p
            className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground"
            variants={itemVariants}
          >
            A production-ready template featuring Django REST Framework backend with Next.js frontend,
            complete with authentication, Docker containerization, and modern development tools.
          </motion.p>

          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            variants={itemVariants}
          >
            <Link href="/auth/register">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="size-5" />
              </Button>
            </Link>
            <Link href="https://github.com/yourusername/modern-django-template" target="_blank">
              <Button size="lg" variant="outline" className="gap-2">
                <Github className="size-5" />
                View on GitHub
              </Button>
            </Link>
          </motion.div>

          {/* Tech Stack Badges */}
          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-4"
            variants={itemVariants}
          >
            <div className="rounded-lg border bg-card px-4 py-2 text-sm font-medium">
              Django 5.2+
            </div>
            <div className="rounded-lg border bg-card px-4 py-2 text-sm font-medium">
              Next.js 14+
            </div>
            <div className="rounded-lg border bg-card px-4 py-2 text-sm font-medium">
              TypeScript
            </div>
            <div className="rounded-lg border bg-card px-4 py-2 text-sm font-medium">
              Docker
            </div>
            <div className="rounded-lg border bg-card px-4 py-2 text-sm font-medium">
              PostgreSQL
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8"
        variants={itemVariants}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="mb-16 text-center"
            variants={itemVariants}
          >
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Everything You Need to Build Fast
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-muted-foreground">
              A comprehensive full-stack template with best practices and modern tooling
              to accelerate your development workflow.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainerVariants}
          >
            {/* Feature 1 */}
            <motion.div variants={cardVariants}>
              <Card className="h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Code className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">
                    Full-Stack Ready
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Django REST Framework backend with Next.js frontend, pre-configured
                    with authentication, API documentation, and more.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 2 */}
            <motion.div variants={cardVariants}>
              <Card className="h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                    <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">
                    Production Ready
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Docker containerization, comprehensive testing, CI/CD workflows,
                    and deployment guides for various cloud providers.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 3 */}
            <motion.div variants={cardVariants}>
              <Card className="h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                    <Zap className="size-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">
                    Modern Tooling
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    TypeScript, Tailwind CSS, ESLint, Prettier, pre-commit hooks,
                    and hot reloading for optimal developer experience.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 4 */}
            <motion.div variants={cardVariants}>
              <Card className="h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                    <Users className="size-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">
                    Authentication Built-In
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    JWT authentication with refresh tokens, OAuth integration,
                    user management, and role-based permissions out of the box.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 5 */}
            <motion.div variants={cardVariants}>
              <Card className="h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                    <TrendingUp className="size-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">
                    Scalable Architecture
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    PostgreSQL database, Redis caching, Celery background tasks,
                    and S3 file storage for handling production workloads.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Feature 6 */}
            <motion.div variants={cardVariants}>
              <Card className="h-full border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                    <BookOpen className="size-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="mb-4 text-xl font-bold">
                    Comprehensive Docs
                  </h3>
                  <p className="leading-relaxed text-muted-foreground">
                    Detailed documentation covering setup, development, deployment,
                    API reference, and architecture decisions.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-gradient-to-r from-primary to-primary/80 px-4 py-20 sm:px-6 lg:px-8 overflow-hidden"
        variants={itemVariants}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.h2
            className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl"
            variants={itemVariants}
          >
            Ready to Build Something Amazing?
          </motion.h2>
          <motion.p
            className="mb-10 text-xl leading-relaxed text-primary-foreground/90"
            variants={itemVariants}
          >
            Get started with a production-ready template that includes everything you need
            to build and deploy your next full-stack application.
          </motion.p>
          <motion.div
            className="flex flex-col justify-center gap-4 sm:flex-row"
            variants={itemVariants}
          >
            <Link href="/auth/register">
              <Button size="lg" variant="glass" className="px-8 py-4 text-lg shadow-xl">
                Start Building Now
                <ArrowRight className="ml-2 size-5" />
              </Button>
            </Link>
            <Link href="https://github.com/yourusername/modern-django-template" target="_blank">
              <Button size="lg" variant="outline" className="border-2 border-primary-foreground/60 bg-primary-foreground/10 px-8 py-4 text-lg text-primary-foreground backdrop-blur-sm hover:border-primary-foreground hover:bg-primary-foreground/20">
                <Github className="mr-2 size-5" />
                Star on GitHub
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="border-t bg-background px-4 py-16 sm:px-6 lg:px-8"
        variants={itemVariants}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="grid grid-cols-1 gap-8 md:grid-cols-4"
            variants={staggerContainerVariants}
          >
            <motion.div
              className="col-span-1 md:col-span-2"
              variants={itemVariants}
            >
              <div className="mb-4 flex items-center space-x-3">
                <Rocket className="size-8 text-primary" />
                <span className="text-2xl font-bold">Modern Django Template</span>
              </div>
              <p className="mb-6 max-w-md text-muted-foreground">
                A production-ready full-stack template featuring Django REST Framework
                and Next.js with comprehensive tooling and documentation.
              </p>
              <div className="flex space-x-4">
                <Link href="https://github.com/yourusername/modern-django-template" target="_blank">
                  <Github className="size-5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
                </Link>
                <Link href="https://twitter.com/yourhandle" target="_blank">
                  <Twitter className="size-5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
                </Link>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="mb-4 font-semibold">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-muted-foreground transition-colors hover:text-foreground">Features</Link></li>
                <li><Link href="https://github.com/yourusername/modern-django-template" target="_blank" className="text-muted-foreground transition-colors hover:text-foreground">Documentation</Link></li>
                <li><Link href="https://github.com/yourusername/modern-django-template/releases" target="_blank" className="text-muted-foreground transition-colors hover:text-foreground">Changelog</Link></li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="mb-4 font-semibold">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">About</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">Privacy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">Terms</Link></li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-12 border-t pt-8 text-center text-muted-foreground"
            variants={itemVariants}
          >
            <p>&copy; 2025 Modern Django Template. Licensed under MIT License.</p>
          </motion.div>
        </div>
      </motion.footer>
    </motion.div>
  );
}
