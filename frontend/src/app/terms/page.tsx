'use client';

import { AnimatedPage, FadeInUp } from '@/components/ui/animated-components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle,
  ScrollText,
} from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing and using example_project ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      title: '2. Description of Service',
      content: `example_project is an online learning platform that provides skill tree-based educational content, interactive courses, and progress tracking. The Service may include various features such as user accounts, course completion tracking, and educational resources.`,
    },
    {
      title: '3. User Accounts',
      content: `
        • You must be at least 13 years old to create an account
        • You are responsible for maintaining the confidentiality of your account
        • You agree to provide accurate, current, and complete information
        • You are responsible for all activities that occur under your account
        • We reserve the right to suspend or terminate accounts that violate these terms
      `,
    },
    {
      title: '4. User Content and Conduct',
      content: `
        You agree not to:
        • Upload, post, or transmit harmful, offensive, or illegal content
        • Impersonate any person or entity
        • Interfere with or disrupt the Service or servers
        • Attempt to gain unauthorized access to any part of the Service
        • Use the Service for any commercial purpose without our consent
      `,
    },
    {
      title: '5. Intellectual Property Rights',
      content: `
        • All content on example_project, including text, graphics, logos, and software, is owned by example_project or its licensors
        • You may not reproduce, distribute, or create derivative works without permission
        • User-generated content remains the property of the user, but you grant us a license to use it as necessary for the Service
      `,
    },
    {
      title: '6. Privacy Policy',
      content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your information.`,
    },
    {
      title: '7. Educational Content',
      content: `
        • Educational content is provided for informational purposes only
        • We do not guarantee the accuracy or completeness of educational materials
        • Completion of courses does not constitute professional certification
        • You are responsible for verifying information before acting upon it
      `,
    },
    {
      title: '8. Payment and Subscriptions',
      content: `
        • Some features may require payment or subscription
        • All fees are non-refundable unless otherwise stated
        • Subscription fees are billed in advance on a recurring basis
        • We reserve the right to change pricing with 30 days notice
      `,
    },
    {
      title: '9. Limitation of Liability',
      content: `
        example_project shall not be liable for:
        • Any indirect, incidental, or consequential damages
        • Loss of profits, data, or business opportunities
        • Service interruptions or technical issues
        • Actions of other users on the platform
      `,
    },
    {
      title: '10. Service Availability',
      content: `
        • We strive to provide continuous service but cannot guarantee 100% uptime
        • We may temporarily suspend the Service for maintenance
        • We reserve the right to modify or discontinue features with notice
      `,
    },
    {
      title: '11. Termination',
      content: `
        • You may terminate your account at any time
        • We may terminate or suspend accounts for violations of these terms
        • Upon termination, you lose access to your account and associated content
        • Certain provisions of these terms survive termination
      `,
    },
    {
      title: '12. Changes to Terms',
      content: `We reserve the right to modify these terms at any time. We will notify users of significant changes via email or platform notifications. Continued use of the Service constitutes acceptance of modified terms.`,
    },
    {
      title: '13. Governing Law',
      content: `These terms are governed by the laws of California, United States. Any disputes will be resolved in the courts of San Francisco County, California.`,
    },
    {
      title: '14. Contact Information',
      content: `If you have questions about these Terms of Service, please contact us at legal@example_project.com or through our contact page.`,
    },
  ];

  return (
    <AnimatedPage className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <FadeInUp>
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className="mr-2 size-4" />
                Back to Home
              </Link>
            </Button>

            <div className="mb-8 text-center">
              <Badge variant="secondary" className="mb-4">
                Legal
              </Badge>
              <h1 className="mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
                Terms of Service
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                These terms govern your use of the example_project learning platform.
                Please read them carefully before using our services.
              </p>
            </div>
          </div>
        </FadeInUp>

        {/* Last Updated */}
        <FadeInUp delay={100}>
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                  <ScrollText className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Last Updated: January 2025</p>
                  <p className="text-sm text-muted-foreground">
                    These terms are effective immediately and supersede all
                    previous versions.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Important Notice */}
        <FadeInUp delay={200}>
          <Card className="mb-8 border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <AlertTriangle className="size-5" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent className="text-amber-800 dark:text-amber-300">
              <p>
                By using example_project, you agree to these terms of service. If you do
                not agree with any part of these terms, you should not use our
                platform. These terms constitute a legally binding agreement
                between you and example_project.
              </p>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Terms Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <FadeInUp key={index} delay={300 + index * 50}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    {section.content.split('\n').map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className="mb-3 leading-relaxed text-muted-foreground"
                      >
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </FadeInUp>
          ))}
        </div>

        {/* Footer */}
        <FadeInUp delay={800}>
          <Card className="mt-12 border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="mx-auto mb-4 size-12 text-green-500" />
                <h3 className="mb-2 text-lg font-semibold">
                  Questions About These Terms?
                </h3>
                <p className="mb-4 text-muted-foreground">
                  If you have any questions or concerns about our Terms of
                  Service, we&apos;re here to help clarify anything you need to
                  know.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Button asChild>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/privacy">View Privacy Policy</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeInUp>

        {/* Legal Disclaimer */}
        <FadeInUp delay={900}>
          <div className="mt-8 rounded-lg bg-muted/50 p-4">
            <p className="text-center text-xs text-muted-foreground">
              This document constitutes the entire agreement between you and
              example_project regarding the use of our service. These terms supersede
              any prior agreements or understandings. If any provision is found
              to be unenforceable, the remaining provisions will remain in full
              force.
            </p>
          </div>
        </FadeInUp>
      </div>
    </AnimatedPage>
  );
}
