import { Project } from '@/lib/types';

export const STARTING_PRICE = 3000;

/**
 * Checks if a project is in the Starting Price tier (starts from ₹3,000).
 */
export function isStartingTier(project: Project | null | undefined): boolean {
  if (!project) return false;
  const displayPrice = project.discounted_price_inr || project.price_inr;
  return displayPrice === STARTING_PRICE;
}

/**
 * Normalizes a project to ensure pricing starts from at least ₹3,000.
 * Entry/Mini projects start at flat ₹3,000 (discounted from ₹4,500),
 * and advanced/major projects scale upwards from ₹3,499 to ₹5,499.
 */
export function normalizeProject(project: Project): Project {
  if (!project) return project;

  const originalPrice = Number(project.price_inr) || 0;
  const originalDiscount = Number(project.discounted_price_inr) || 0;
  const effectiveCurrent = originalDiscount || originalPrice;

  // Designated starting ₹3,000 projects (popular entry-level, mini, and featured starter projects)
  const designatedStartingIds = new Set([
    'chatgpt-1', // AI Resume Analyzer
    'chatgpt-6', // Sentiment Analysis Web App
    'chatgpt-7', // College FAQ Chatbot
    'chatgpt-9', // Online Complaint Management System
    'chatgpt-12', // Hospital Appointment System
    'chatgpt-13', // Smart Library Management System
    'p3',         // Real-Time Driver Drowsiness System
    'p8',         // Full-Stack E-Commerce Website
    'p9',         // Online Job Portal System
    'p10',        // Student Placement System
  ]);

  // If already explicitly starting at 3000
  if (effectiveCurrent === 3000) {
    return {
      ...project,
      price_inr: Math.max(originalPrice, 4500),
      discounted_price_inr: 3000,
    };
  }

  // If designated as starting 3000 or previously low-cost (< 1500)
  if (designatedStartingIds.has(project.id) || effectiveCurrent < 1500 || project.category === 'MINI_PROJECT') {
    return {
      ...project,
      price_inr: 4500,
      discounted_price_inr: 3000,
    };
  }

  // Tier 1: ₹3,499 (previously 1500 - 1799)
  if (effectiveCurrent >= 1500 && effectiveCurrent < 1800) {
    return {
      ...project,
      price_inr: 4999,
      discounted_price_inr: 3499,
    };
  }

  // Tier 2: ₹3,999 (previously 1800 - 2099)
  if (effectiveCurrent >= 1800 && effectiveCurrent < 2100) {
    return {
      ...project,
      price_inr: 5499,
      discounted_price_inr: 3999,
    };
  }

  // Tier 3: ₹4,499 (previously 2100 - 2499)
  if (effectiveCurrent >= 2100 && effectiveCurrent < 2500) {
    return {
      ...project,
      price_inr: 5999,
      discounted_price_inr: 4499,
    };
  }

  // Tier 4: ₹4,999+ (previously 2500+)
  if (effectiveCurrent >= 2500) {
    return {
      ...project,
      price_inr: 6999,
      discounted_price_inr: 4999,
    };
  }

  // Fallback to guarantee minimum ₹3,000
  return {
    ...project,
    price_inr: Math.max(originalPrice, 4500),
    discounted_price_inr: Math.max(effectiveCurrent, 3000),
  };
}

export function normalizeProjects(projects: Project[]): Project[] {
  if (!Array.isArray(projects)) return [];
  return projects.map(normalizeProject);
}
