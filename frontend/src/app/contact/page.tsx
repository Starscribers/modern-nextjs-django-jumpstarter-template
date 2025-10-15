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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
  Bug,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Get in touch via email',
      value: 'support@example_project.com',
      color: 'blue',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our team',
      value: 'Available 24/7',
      color: 'green',
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us directly',
      value: '+1 (555) 123-4567',
      color: 'purple',
    },
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: MessageCircle },
    { value: 'support', label: 'Technical Support', icon: HelpCircle },
    { value: 'bug', label: 'Bug Report', icon: Bug },
    { value: 'feature', label: 'Feature Request', icon: Lightbulb },
    { value: 'partnership', label: 'Partnership', icon: Mail },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      toast({
        title: 'Message sent successfully!',
        description: "We'll get back to you within 24 hours.",
      });
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      category: '',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <AnimatedPage className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <FadeInUp>
          <div className="mb-16 text-center">
            <Badge variant="secondary" className="mb-4">
              Contact Us
            </Badge>
            <h1 className="mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
              Get in Touch
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-muted-foreground">
              Have questions, suggestions, or need help? We&apos;re here to
              assist you. Reach out to us and we&apos;ll get back to you as soon
              as possible.
            </p>
          </div>
        </FadeInUp>

        {/* Contact Methods */}
        <FadeInUp delay={100}>
          <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="pt-6">
                  <div
                    className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full
                    ${
                      method.color === 'blue'
                        ? 'bg-blue-100 dark:bg-blue-900'
                        : ''
                    }
                    ${
                      method.color === 'green'
                        ? 'bg-green-100 dark:bg-green-900'
                        : ''
                    }
                    ${
                      method.color === 'purple'
                        ? 'bg-purple-100 dark:bg-purple-900'
                        : ''
                    }
                  `}
                  >
                    <method.icon
                      className={`size-8
                      ${
                        method.color === 'blue'
                          ? 'text-blue-600 dark:text-blue-400'
                          : ''
                      }
                      ${
                        method.color === 'green'
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }
                      ${
                        method.color === 'purple'
                          ? 'text-purple-600 dark:text-purple-400'
                          : ''
                      }
                    `}
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{method.title}</h3>
                  <p className="mb-3 text-sm text-muted-foreground">
                    {method.description}
                  </p>
                  <p className="font-medium text-foreground">{method.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeInUp>

        {/* Contact Form */}
        <FadeInUp delay={200}>
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll respond within 24
                    hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name */}
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={e =>
                            handleInputChange('name', e.target.value)
                          }
                          placeholder="Your full name"
                          required
                          className="mt-1"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={e =>
                            handleInputChange('email', e.target.value)
                          }
                          placeholder="your.email@example.com"
                          required
                          className="mt-1"
                        />
                      </div>

                      {/* Category */}
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={value =>
                            handleInputChange('category', value)
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                <div className="flex items-center gap-2">
                                  <category.icon className="size-4" />
                                  {category.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Subject */}
                      <div>
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          type="text"
                          value={formData.subject}
                          onChange={e =>
                            handleInputChange('subject', e.target.value)
                          }
                          placeholder="Brief description of your inquiry"
                          className="mt-1"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={e =>
                            handleInputChange('message', e.target.value)
                          }
                          placeholder="Tell us more about your inquiry..."
                          required
                          rows={5}
                          className="mt-1"
                        />
                      </div>

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                        size="lg"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 size-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  ) : (
                    <div className="py-8 text-center">
                      <CheckCircle className="mx-auto mb-4 size-16 text-green-500" />
                      <h3 className="mb-2 text-xl font-semibold">
                        Message Sent!
                      </h3>
                      <p className="mb-6 text-muted-foreground">
                        Thank you for contacting us. We&apos;ll get back to you
                        within 24 hours.
                      </p>
                      <Button onClick={resetForm} variant="outline">
                        Send Another Message
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="space-y-8">
                {/* Office Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-5 text-primary" />
                      Our Office
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-muted-foreground">
                      <p>example_project Learning Platform</p>
                      <p>123 Education Avenue</p>
                      <p>Innovation District</p>
                      <p>San Francisco, CA 94105</p>
                      <p>United States</p>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ Link */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="size-5 text-primary" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">
                      Check out our FAQ section for quick answers to common
                      questions.
                    </p>
                    <Button variant="outline" className="w-full">
                      View FAQ
                    </Button>
                  </CardContent>
                </Card>

                {/* Response Time */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="size-5 text-primary" />
                      Response Times
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          General Inquiries
                        </span>
                        <span className="font-medium">24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Technical Support
                        </span>
                        <span className="font-medium">12 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Bug Reports
                        </span>
                        <span className="font-medium">6 hours</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </AnimatedPage>
  );
}
