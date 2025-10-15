'use client';

import { AnimatedPage, FadeInUp } from '@/components/ui/animated-components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Globe,
  Heart,
  Lightbulb,
  Target,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Learning',
      description:
        'Hands-on courses and real-world projects that build practical skills through engaging content.',
    },
    {
      icon: Users,
      title: 'Expert Instructors',
      description:
        'Learn from industry professionals and experienced educators who know their craft.',
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description:
        'Track your progress, earn badges, and unlock new skill trees as you advance.',
    },
    {
      icon: Zap,
      title: 'Adaptive Learning',
      description:
        'Personalized learning paths that adapt to your pace and learning style.',
    },
    {
      icon: Target,
      title: 'Goal-Oriented',
      description:
        'Set learning goals and follow structured paths to achieve your objectives.',
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description:
        'Join a community of learners and educators supporting each other.',
    },
  ];

  const stats = [
    { label: 'Active Learners', value: '10,000+' },
    { label: 'Skill Trees', value: '50+' },
    { label: 'Expert Instructors', value: '100+' },
    { label: 'Completion Rate', value: '95%' },
  ];

  return (
    <AnimatedPage className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <FadeInUp>
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              About example_project
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              Empowering Learning Through Technology
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
              example_project is a revolutionary skill tree learning platform that makes
              acquiring new skills engaging, structured, and effective. We
              believe everyone deserves access to quality education that adapts
              to their unique learning style.
            </p>
          </div>
        </FadeInUp>

        {/* Mission Section */}
        <FadeInUp delay={100}>
          <Card className="mb-16 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Lightbulb className="size-8 text-primary" />
              </div>
              <CardTitle className="mb-4 text-3xl">Our Mission</CardTitle>
              <CardDescription className="mx-auto max-w-2xl text-lg">
                To democratize education by creating an interactive, gamified
                learning experience that makes skill acquisition accessible,
                engaging, and effective for everyone, anywhere in the world.
              </CardDescription>
            </CardHeader>
          </Card>
        </FadeInUp>

        {/* Stats Section */}
        <FadeInUp delay={200}>
          <div className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="mb-2 text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeInUp>

        {/* Features Section */}
        <FadeInUp delay={300}>
          <div className="mb-16">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                What Makes example_project Special
              </h2>
              <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                Our platform combines cutting-edge technology with proven
                learning methodologies
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 transition-transform group-hover:scale-110">
                      <feature.icon className="size-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Vision Section */}
        <FadeInUp delay={400}>
          <Card className="mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Globe className="size-8 text-primary" />
              </div>
              <CardTitle className="mb-4 text-3xl">Our Vision</CardTitle>
              <CardDescription className="mx-auto max-w-3xl text-lg">
                We envision a world where learning is not constrained by
                geography, time, or traditional educational barriers. Through
                our skill tree approach, we make complex subjects digestible and
                progression clear, helping millions of people unlock their
                potential and achieve their goals.
              </CardDescription>
            </CardHeader>
          </Card>
        </FadeInUp>

        {/* Team Section */}
        <FadeInUp delay={500}>
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold">
              Built by Educators, for Learners
            </h2>
            <p className="mx-auto mb-8 max-w-3xl text-lg text-muted-foreground">
              Our team consists of passionate educators, developers, and
              designers who understand the challenges of learning and are
              committed to solving them through innovative technology.
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-xl font-bold text-background">
                    ED
                  </div>
                  <h3 className="mb-2 font-semibold">Education Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Curriculum designers and learning specialists creating
                    engaging content
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-xl font-bold text-background">
                    TH
                  </div>
                  <h3 className="mb-2 font-semibold">Technology Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Full-stack developers building scalable and intuitive
                    learning experiences
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-xl font-bold text-background">
                    DX
                  </div>
                  <h3 className="mb-2 font-semibold">Design Team</h3>
                  <p className="text-sm text-muted-foreground">
                    UX/UI designers focused on creating beautiful and accessible
                    interfaces
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </FadeInUp>

        {/* CTA Section */}
        <FadeInUp delay={600}>
          <Card className="border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5">
            <CardContent className="p-8 text-center">
              <h2 className="mb-4 text-3xl font-bold">
                Ready to Start Learning?
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
                Join thousands of learners who are already building new skills
                with example_project. Start your journey today and unlock your
                potential.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/auth/register">Get Started Free</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>
      </div>
    </AnimatedPage>
  );
}
