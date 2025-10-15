'use client';

import { Button } from '@/components/ui/button';
import { Download, Zap, Star, Shield, Settings, Play } from 'lucide-react';

import React from 'react';
import { Button } from './button';
import {
  Download,
  Upload,
  Settings,
  User,
  Star,
  Zap,
  Shield,
  Play,
  Pause,
  SkipForward,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Check,
  X,
  Plus,
  Minus,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Bell,
  BellOff,
  Home,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  ShoppingCart,
  Package,
  Truck,
  Gift,
  Trophy,
  Target,
  Compass,
  Navigation,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  Video,
  Image,
  FileText,
  Folder,
  Archive,
  Trash2,
  Edit,
  Copy,
  Scissors,
  RotateCcw,
  RefreshCw,
  Save,
  Bookmark,
  Tag,
  Hash,
  AtSign,
  Link,
  ExternalLink,
  Maximize,
  Minimize,
  Grid,
  List,
  Columns,
  Rows,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  Indent,
  Outdent,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Crop,
  Type,
  Palette,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  MousePointer,
  Hand,
  Crosshair,
  Square,
  Circle,
  Triangle,
  Hexagon,
} from 'lucide-react';

export const FuturisticButtonDemo: React.FC = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold futuristic-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Futuristic Button System
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            A comprehensive showcase of our Halo Infinite-inspired button system with glass morphism effects,
            smooth animations, and futuristic aesthetics.
          </p>
        </div>

        {/* Standard Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-2">
            Standard Variants
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Default</h3>
              <Button variant="default">Default</Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Destructive</h3>
              <Button variant="destructive">Destructive</Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Outline</h3>
              <Button variant="outline">Outline</Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Secondary</h3>
              <Button variant="secondary">Secondary</Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Ghost</h3>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400">Link</h3>
              <Button variant="link">Link</Button>
            </div>
          </div>
        </section>

        {/* Futuristic Variants */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-2">
            Futuristic Variants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-300">Glass Effect</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="glass">Glass Button</Button>
                <Button variant="glass" size="sm">Small Glass</Button>
                <Button variant="glass" size="lg">Large Glass</Button>
                <Button variant="glass" disabled>Disabled Glass</Button>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-300">Neon Glow</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="neon">Neon Button</Button>
                <Button variant="neon" size="sm">Small Neon</Button>
                <Button variant="neon" size="lg">Large Neon</Button>
                <Button variant="neon" disabled>Disabled Neon</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Theming / Color Accents */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-2">
            Theming (Accent Colors)
          </h2>
          <p className="text-slate-400 text-sm max-w-2xl">
            Use the <code className="px-1 py-0.5 rounded bg-slate-800/60">themeColor</code> prop to quickly apply accent rings and subtle palette shifts without redefining structural variants.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Button themeColor="cyan">Cyan</Button>
            <Button themeColor="blue">Blue</Button>
            <Button themeColor="purple">Purple</Button>
            <Button themeColor="emerald">Emerald</Button>
            <Button themeColor="amber">Amber</Button>
            <Button themeColor="rose">Rose</Button>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button variant="glass" themeColor="purple">Glass + Purple</Button>
            <Button variant="neon" themeColor="emerald">Neon + Emerald</Button>
            <Button variant="outline" themeColor="amber">Outline + Amber</Button>
            <Button variant="secondary" themeColor="rose">Secondary + Rose</Button>
          </div>
        </section>

        {/* Sizes */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-2">
            Button Sizes
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
            <Button size="icon" variant="glass">
              <Star className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* With Icons */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-2">
            Buttons with Icons
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button variant="glass">
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <Button variant="neon">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </section>

        {/* Interactive States */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-2">
            Interactive States
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={handleLoadingDemo} disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Click to Load'}
              </Button>
              <Button onClick={() => setIsDisabled(!isDisabled)}>
                {isDisabled ? 'Enable' : 'Disable'} Buttons
              </Button>
            </div>
            <div className="flex gap-4">
              <Button disabled={isDisabled}>Default Disabled</Button>
              <Button variant="glass" disabled={isDisabled}>Glass Disabled</Button>
              <Button variant="neon" disabled={isDisabled}>Neon Disabled</Button>
            </div>
          </div>
        </section>

        {/* Action Categories */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-2">
            Action Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Primary Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-cyan-400">Primary Actions</h3>
              <div className="space-y-2">
                <Button variant="glass">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
                <Button variant="neon">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </div>
            </div>

            {/* Secondary Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-blue-400">Secondary Actions</h3>
              <div className="space-y-2">
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button variant="ghost">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Destructive Actions */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-red-400">Destructive Actions</h3>
              <div className="space-y-2">
                <Button variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button variant="destructive" size="sm">
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
                <Button variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-purple-400">Navigation</h3>
              <div className="space-y-2">
                <Button variant="glass" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button variant="glass" size="sm">
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
                <Button variant="neon" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Icon Grid */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-2">
            Icon Showcase
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-2">
            {[
              Download, Upload, Settings, User, Star, Zap, Shield, Play,
              Pause, SkipForward, Heart, MessageCircle, Share2, MoreHorizontal,
              Check, X, Plus, Minus, Search, Filter, SortAsc, SortDesc,
              Eye, EyeOff, Lock, Unlock, Bell, BellOff, Home, Mail,
              Phone, MapPin, Calendar, Clock, DollarSign, CreditCard,
              ShoppingCart, Package, Truck, Gift, Trophy, Target,
              Compass, Navigation, Wifi, WifiOff, Battery, BatteryCharging,
              Volume2, VolumeX, Mic, MicOff, Camera, Video, Image,
              FileText, Folder, Archive, Trash2, Edit, Copy, Scissors,
              RotateCcw, RefreshCw, Save, Bookmark, Tag, Hash, AtSign,
              Link, ExternalLink, Maximize, Minimize, Grid, List, Columns,
              Rows, AlignLeft, AlignCenter, AlignRight, Bold, Italic,
              Underline, Strikethrough, Code, Quote, Heading1, Heading2,
              Heading3, ListOrdered, Indent, Outdent, ChevronLeft, ChevronRight,
              ChevronUp, ChevronDown, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
              Move, ZoomIn, ZoomOut, RotateCw, FlipHorizontal, FlipVertical,
              Crop, Type, Palette, Sun, Moon, Monitor, Smartphone,
              Tablet, Laptop, MousePointer, Hand, Crosshair, Square,
              Circle, Triangle, Hexagon
            ].map((Icon, index) => (
              <Button key={index} variant="glass" size="icon" className="w-10 h-10">
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        </section>

        {/* Glass Card Demo */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-white border-b border-slate-700 pb-2">
            Glass Card Integration
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Card Title</h3>
              <p className="text-slate-300">
                This is a glass morphism card with buttons inside.
              </p>
              <div className="flex gap-2">
                <Button variant="glass" size="sm">Action 1</Button>
                <Button variant="neon" size="sm">Action 2</Button>
              </div>
            </div>
            <div className="glass-card-dark p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Dark Card</h3>
              <p className="text-slate-300">
                This card uses the dark glass effect variant.
              </p>
              <div className="flex gap-2">
                <Button variant="neon" size="sm">Primary</Button>
                <Button variant="outline" size="sm">Secondary</Button>
              </div>
            </div>
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-lg font-semibold text-white">Interactive Card</h3>
              <p className="text-slate-300">
                Cards can contain various button combinations.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  Like
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Comment
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8 border-t border-slate-700">
          <p className="text-slate-400">
            Built with ❤️ using Next.js, Tailwind CSS, and Lucide Icons
          </p>
        </div>
      </div>
    </div>
  );
};