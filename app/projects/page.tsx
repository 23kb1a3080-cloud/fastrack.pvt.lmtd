'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BRANCHES, DEMO_PROJECTS } from '@/lib/constants';
import { EngineeringBranch, Project } from '@/lib/types';
import ProjectCard from '@/components/catalog/project-card';
import { normalizeProjects } from '@/lib/utils/project';
import { Search, SlidersHorizontal, RotateCcw, Filter, ArrowUpDown } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedBranches, setSelectedBranches] = useState<EngineeringBranch[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('projects').select('*').eq('is_published', true);
      if (data && data.length > 0) {
        setProjects(normalizeProjects(data as Project[]));
      } else {
        setProjects(normalizeProjects(DEMO_PROJECTS));
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const toggleBranch = (branchId: EngineeringBranch) => {
    setSelectedBranches((prev) =>
      prev.includes(branchId) ? prev.filter((b) => b !== branchId) : [...prev, branchId]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBranches([]);
    setSelectedCategory('ALL');
    setSortBy('featured');
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tech_stack.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesBranch =
        selectedBranches.length === 0 || selectedBranches.includes(project.branch);

      const matchesCategory =
        selectedCategory === 'ALL' || project.category === selectedCategory;

      return matchesSearch && matchesBranch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'title_asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title_desc') return b.title.localeCompare(a.title);
      return 0;
    });
  }, [projects, searchQuery, selectedBranches, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#ECE4DA] text-[#000000]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D8CEBE] pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#000000]">Engineering Projects Catalog</h1>
          <p className="text-sm text-[#000000]/80 mt-1 font-medium">
            Explore complete tested deliverable packages with source code, IEEE report, & PPT.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#000000] text-[#FFFFFF] font-extrabold text-xs"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter Projects ({filteredProjects.length})
        </button>
      </div>

      {/* Grid Layout: Left Sidebar + Right Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside
          className={`lg:block bg-[#FAF6F0] p-6 rounded-3xl border border-[#D8CEBE] shadow-xs space-y-6 ${
            mobileFiltersOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#D8CEBE] pb-4">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#000000]" />
              Filters
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-[#000000] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#000000]/70 uppercase tracking-wider block">
              Search by Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#000000]/40 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Topic, tech, branch..."
                className="w-full pl-9 pr-3 py-2 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs font-bold text-[#000000] placeholder-[#000000]/40 focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>

          {/* Branch Filter */}
          <div className="space-y-3 pt-4 border-t border-[#D8CEBE]">
            <label className="text-xs font-extrabold text-[#000000]/70 uppercase tracking-wider block">
              Department
            </label>
            <div className="space-y-2">
              {BRANCHES.map((branch) => {
                const count = projects.filter((p) => p.branch === branch.id).length;
                return (
                  <label
                    key={branch.id}
                    className="flex items-center justify-between text-xs text-[#000000] font-bold cursor-pointer hover:opacity-80"
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedBranches.includes(branch.id)}
                        onChange={() => toggleBranch(branch.id)}
                        className="rounded border-[#D8CEBE] text-[#000000] focus:ring-[#000000] h-4 w-4"
                      />
                      <span>{branch.name}</span>
                    </div>
                    <span className="text-[11px] text-[#000000]/60 font-semibold">{count}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3 pt-4 border-t border-[#D8CEBE]">
            <label className="text-xs font-extrabold text-[#000000]/70 uppercase tracking-wider block">
              Project Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-[#000000] font-bold cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === 'ALL'}
                  onChange={() => setSelectedCategory('ALL')}
                  className="text-[#000000] focus:ring-[#000000] h-4 w-4"
                />
                <span>All Projects</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#000000] font-bold cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === 'MAJOR_FINAL_YEAR'}
                  onChange={() => setSelectedCategory('MAJOR_FINAL_YEAR')}
                  className="text-[#000000] focus:ring-[#000000] h-4 w-4"
                />
                <span>Major Final Year Projects</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#000000] font-bold cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === 'MINI_PROJECT'}
                  onChange={() => setSelectedCategory('MINI_PROJECT')}
                  className="text-[#000000] focus:ring-[#000000] h-4 w-4"
                />
                <span>Mini Projects</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Catalog Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Quick Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-[#000000] text-[#FFFFFF] border-black'
                  : 'bg-[#FAF6F0] text-[#000000] border-[#D8CEBE] hover:bg-[#ECE4DA]'
              }`}
            >
              All Deliverables
            </button>
            <button
              onClick={() => setSelectedCategory(selectedCategory === 'MAJOR_FINAL_YEAR' ? 'ALL' : 'MAJOR_FINAL_YEAR')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === 'MAJOR_FINAL_YEAR'
                  ? 'bg-[#000000] text-[#FFFFFF] border-black'
                  : 'bg-[#FAF6F0] text-[#000000] border-[#D8CEBE] hover:bg-[#ECE4DA]'
              }`}
            >
              Major Final Year
            </button>
            <button
              onClick={() => setSelectedCategory(selectedCategory === 'MINI_PROJECT' ? 'ALL' : 'MINI_PROJECT')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                selectedCategory === 'MINI_PROJECT'
                  ? 'bg-[#000000] text-[#FFFFFF] border-black'
                  : 'bg-[#FAF6F0] text-[#000000] border-[#D8CEBE] hover:bg-[#ECE4DA]'
              }`}
            >
              Mini Projects
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF6F0] border border-[#D8CEBE] shadow-xs">
            <span className="text-xs font-bold text-[#000000]">
              Showing <span className="font-extrabold">{filteredProjects.length}</span> Engineering Projects
            </span>

            {/* Sort Select */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-[#000000]/60" />
              <span className="text-xs font-bold text-[#000000]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#ECE4DA] border border-[#D8CEBE] text-[#000000] text-xs rounded-xl font-bold p-2 focus:outline-none focus:border-[#000000]"
              >
                <option value="featured">Featured Projects</option>
                <option value="title_asc">Title: A to Z</option>
                <option value="title_desc">Title: Z to A</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#FAF6F0] rounded-3xl border border-[#D8CEBE]">
              <p className="text-[#000000] text-sm font-bold">No projects found matching your selected filters.</p>
              <button
                onClick={resetFilters}
                className="mt-4 px-5 py-2.5 bg-[#000000] text-[#FFFFFF] rounded-full text-xs font-extrabold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-slate-900 border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-xs font-bold text-[#000000]/70">Loading projects catalog...</p>
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
