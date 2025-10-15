/**
 * Animation utilities for enhanced UX
 */

// Keyframe animations for CSS-in-JS or Tailwind config
export const animations = {
  // Gentle scale animation for interactive elements
  scaleOnHover: 'transition-all duration-200 hover:scale-105 active:scale-95',

  // Smooth color transitions
  colorTransition: 'transition-colors duration-200',

  // Card hover effects
  cardHover:
    'transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10',

  // Input focus animations
  inputFocus:
    'transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500',

  // Button press animation
  buttonPress:
    'transition-all duration-150 active:scale-95 disabled:active:scale-100',

  // Fade in animation
  fadeIn: 'animate-in fade-in-0 duration-500',

  // Slide animations
  slideInFromLeft: 'animate-in slide-in-from-left-4 duration-500',
  slideInFromRight: 'animate-in slide-in-from-right-4 duration-500',
  slideInFromBottom: 'animate-in slide-in-from-bottom-4 duration-500',

  // Stagger animations for lists
  staggered: (delay: number) =>
    `animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-${delay}`,
};

// Color scheme configurations for different UI elements
export const colorSchemes = {
  primary: {
    hover: 'hover:text-blue-600 dark:hover:text-blue-400',
    focus:
      'focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-400',
    background: 'hover:bg-blue-50 dark:hover:bg-blue-950',
  },
  secondary: {
    hover: 'hover:text-purple-600 dark:hover:text-purple-400',
    focus:
      'focus:ring-purple-500/50 focus:border-purple-500 dark:focus:border-purple-400',
    background: 'hover:bg-purple-50 dark:hover:bg-purple-950',
  },
  success: {
    hover: 'hover:text-green-600 dark:hover:text-green-400',
    focus:
      'focus:ring-green-500/50 focus:border-green-500 dark:focus:border-green-400',
    background: 'hover:bg-green-50 dark:hover:bg-green-950',
  },
  warning: {
    hover: 'hover:text-orange-600 dark:hover:text-orange-400',
    focus:
      'focus:ring-orange-500/50 focus:border-orange-500 dark:focus:border-orange-400',
    background: 'hover:bg-orange-50 dark:hover:bg-orange-950',
  },
  error: {
    hover: 'hover:text-red-600 dark:hover:text-red-400',
    focus:
      'focus:ring-red-500/50 focus:border-red-500 dark:focus:border-red-400',
    background: 'hover:bg-red-50 dark:hover:bg-red-950',
  },
};

// Gradient configurations
export const gradients = {
  card: 'bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-900 dark:to-gray-800/30',
  button:
    'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500',
  text: 'bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent',
  avatar:
    'bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500',
};

// Animation timing functions
export const timing = {
  fast: 'duration-150',
  normal: 'duration-200',
  slow: 'duration-300',
  slower: 'duration-500',
};

// Animation class builders
export const buildAnimationClasses = {
  // Loading spinner classes
  loadingSpinner: (size = 'w-4 h-4') =>
    `${size} border-2 border-white/30 border-t-white rounded-full animate-spin`,

  // Hover scale wrapper classes
  hoverScale: (scale = 'hover:scale-105', className = '') =>
    `transition-transform duration-200 ${scale} active:scale-95 ${className}`,

  // Input field with color scheme
  inputField: (colorScheme: keyof typeof colorSchemes) =>
    `transition-all duration-200 ${colorSchemes[colorScheme].focus} ${colorSchemes[colorScheme].background}`,

  // Card with hover effects
  interactiveCard: (colorScheme: keyof typeof colorSchemes = 'primary') =>
    `transition-all duration-300 hover:shadow-lg ${colorSchemes[colorScheme].background} border-0 ${gradients.card}`,
};

// Staggered animation helper
export const useStaggeredAnimation = (itemCount: number, baseDelay = 100) => {
  return Array.from({ length: itemCount }, (_, index) => ({
    animationDelay: `${index * baseDelay}ms`,
    className: `animate-in fade-in-0 slide-in-from-bottom-2 duration-500`,
  }));
};

// Intersection observer animation trigger
export const useScrollAnimation = () => {
  // This would typically use IntersectionObserver
  // For now, returning basic animation classes
  return {
    ref: null,
    className: 'animate-in fade-in-0 slide-in-from-bottom-4 duration-700',
  };
};
