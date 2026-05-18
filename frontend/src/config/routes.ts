/**
 * frontend/src/config/routes.ts
 * 
 * Application route definitions and navigation configuration.
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Protected routes
  DASHBOARD: '/dashboard',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',

  // Treebank routes
  TREEBANKS: '/dashboard/treebanks',
  TREEBANK_DETAIL: (id: string | number) => `/dashboard/treebanks/${id}`,
  TREEBANK_EDIT: (id: string | number) => `/dashboard/treebanks/${id}/edit`,

  // Annotation routes
  ANNOTATIONS: '/dashboard/annotations',
  ANNOTATION_DETAIL: (id: string | number) => `/dashboard/annotations/${id}`,

  // Admin routes (if needed)
  ADMIN: '/admin',
} as const;

export const PUBLIC_ROUTES = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER];
export const PROTECTED_ROUTES = [ROUTES.DASHBOARD];

export type Route = typeof ROUTES[keyof typeof ROUTES];
