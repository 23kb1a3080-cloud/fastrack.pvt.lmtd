import type { MetadataRoute } from 'next';
import { BRANCHES, DEMO_PROJECTS } from '@/lib/constants';
import { createAdminClient } from '@/lib/supabase/admin';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://capstonia.qd.je';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/custom-request`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Branch dynamic routes
  const branchRoutes: MetadataRoute.Sitemap = BRANCHES.map((b) => ({
    url: `${baseUrl}/branches/${b.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Project dynamic routes
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createAdminClient();
    const { data: projects, error } = await supabase.from('projects').select('slug, updated_at');
    if (!error && projects && projects.length > 0) {
      projectRoutes = projects.map((p) => ({
        url: `${baseUrl}/projects/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      }));
    }
  } catch (err) {
    console.warn('sitemap database error:', err);
  }

  if (projectRoutes.length === 0) {
    projectRoutes = DEMO_PROJECTS.map((p) => ({
      url: `${baseUrl}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    }));
  }

  return [...staticRoutes, ...branchRoutes, ...projectRoutes];
}
