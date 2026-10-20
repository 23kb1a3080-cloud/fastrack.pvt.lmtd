'use client';

import { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BRANCHES, DEMO_PROJECTS } from '@/lib/constants';
import { EngineeringBranch, Project } from '@/lib/types';
import ProjectCard from '@/components/catalog/project-card';
import { normalizeProjects } from '@/lib/utils/project';
import { Search, SlidersHorizontal, RotateCcw, Filter, ArrowUpDown, Flame, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialPrice = searchParams.get('price') || 'ALL';

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedBranches, setSelectedBranches] = useState<EngineeringBranch[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [priceRange, setPriceRange] = useState<string>(
    initialPrice === '3000' || initialPrice === 'STARTS_3000' ? 'STARTS_3000' : initialPrice
  );
  const [sortBy, setSortBy] = useState<string>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const p = searchParams.get('price');
    if (p === '3000' || p === 'STARTS_3000') {
      setPriceRange('STARTS_3000');
    }
  }, [searchParams]);

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
    setPriceRange('ALL');
    setSortBy('featured');
  };

  const starting3000Count = useMemo(() => {
    return projects.filter((p) => (p.discounted_price_inr || p.price_inr) === 3000).length;
  }, [projects]);

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

      const price = project.discounted_price_inr || project.price_inr;
      let matchesPrice = true;
      if (priceRange === 'STARTS_3000') matchesPrice = price === 3000;
      if (priceRange === '3000_4000') matchesPrice = price >= 3000 && price <= 4000;
      if (priceRange === 'ABOVE_4000') matchesPrice = price > 4000;

      return matchesSearch && matchesBranch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
      const priceA = a.discounted_price_inr || a.price_inr;
      const priceB = b.discounted_price_inr || b.price_inr;
      if (sortBy === 'price_asc') return priceA - priceB;
      if (sortBy === 'price_desc') return priceB - priceA;
      return 0;
    });
  }, [projects, searchQuery, selectedBranches, selectedCategory, priceRange, sortBy]);

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
              className="text-xs font-bold text-[#000000] hover:underline flex items-center gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-[#000000]/70 uppercase tracking-wider block">
              Search Keyword
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]/50" />
              <input
                type="text"
                placeholder="Topic or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#ECE4DA] border border-[#D8CEBE] rounded-xl text-xs text-[#000000] font-bold focus:outline-none focus:border-[#000000]"
              />
            </div>
          </div>

          {/* Department Checkboxes */}
          <div className="space-y-3 pt-2 border-t border-[#D8CEBE]">
            <label className="text-xs font-extrabold text-[#000000]/70 uppercase tracking-wider block">
              Engineering Branch
            </label>
            <div className="space-y-2">
              {BRANCHES.map((b) => {
                const checked = selectedBranches.includes(b.id);
                return (
                  <label
                    key={b.id}
                    className="flex items-center gap-2.5 text-xs text-[#000000] font-bold cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleBranch(b.id)}
                      className="rounded border-[#D8CEBE] text-[#000000] focus:ring-[#000000] h-4 w-4"
                    />
                    <span>{b.name}</span>
                    <span className="text-[10px] text-[#000000]/60 ml-auto font-semibold">{b.fullName.split(' ')[0]}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Project Type */}
          <div className="space-y-3 pt-4 border-t border-[#D8CEBE]">
            <label className="text-xs font-extrabold text-[#000000]/70 uppercase tracking-wider block">
              Project Category
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
                <span>All Categories</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#000000] font-bold cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === 'MAJOR_FINAL_YEAR'}
                  onChange={() => setSelectedCategory('MAJOR_FINAL_YEAR')}
                  className="text-[#000000] focus:ring-[#000000] h-4 w-4"
                />
                <span>Major Final Year</span>
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

          {/* Price Range Filter */}
          <div className="space-y-3 pt-4 border-t border-[#D8CEBE]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold text-[#000000]/70 uppercase tracking-wider block">
                Price Filter (₹)
              </label>
              <span className="text-[10px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                Starts @ ₹3,000
              </span>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-[#000000] font-bold cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'ALL'}
                  onChange={() => setPriceRange('ALL')}
                  className="text-[#000000] focus:ring-[#000000] h-4 w-4"
                />
                <span>All Prices</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#000000] font-black cursor-pointer bg-amber-400/20 p-2 rounded-xl border border-amber-400/50">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'STARTS_3000'}
                  onChange={() => setPriceRange('STARTS_3000')}
                  className="text-amber-600 focus:ring-amber-500 h-4 w-4"
                />
                <span className="flex items-center gap-1 text-black font-black">
                  <Flame className="h-3.5 w-3.5 fill-amber-600 text-amber-600" />
                  Starting @ ₹3,000 Deals
                </span>
                <span className="ml-auto text-[10px] font-black bg-amber-400 text-black px-1.5 py-0.5 rounded-md">
                  {starting3000Count}
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#000000] font-bold cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === '3000_4000'}
                  onChange={() => setPriceRange('3000_4000')}
                  className="text-[#000000] focus:ring-[#000000] h-4 w-4"
                />
                <span>₹3,000 – ₹4,000</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-[#000000] font-bold cursor-pointer">
                <input
                  type="radio"
                  name="price"
                  checked={priceRange === 'ABOVE_4000'}
                  onChange={() => setPriceRange('ABOVE_4000')}
                  className="text-[#000000] focus:ring-[#000000] h-4 w-4"
                />
                <span>Above ₹4,000</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Right Catalog Area */}
        <main className="lg:col-span-3 space-y-6">
          {/* Quick Filter Pill Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPriceRange(priceRange === 'STARTS_3000' ? 'ALL' : 'STARTS_3000')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 shadow-xs ${
                priceRange === 'STARTS_3000'
                  ? 'bg-amber-500 text-black border-2 border-amber-600 ring-2 ring-amber-400/50'
                  : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
              }`}
            >
              <Flame className="h-3.5 w-3.5 fill-amber-600 text-amber-600" />
              <span>Starting @ ₹3,000 Deals ({starting3000Count})</span>
            </button>
            <button
              onClick={() => setSelectedCategory(selectedCategory === 'MAJOR_FINAL_YEAR' ? 'ALL' : 'MAJOR_FINAL_YEAR')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedCategory === 'MAJOR_FINAL_YEAR'
                  ? 'bg-[#000000] text-[#FFFFFF] border-black'
                  : 'bg-[#FAF6F0] text-[#000000] border-[#D8CEBE] hover:bg-[#ECE4DA]'
              }`}
            >
              Major Final Year
            </button>
            <button
              onClick={() => setSelectedCategory(selectedCategory === 'MINI_PROJECT' ? 'ALL' : 'MINI_PROJECT')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                selectedCategory === 'MINI_PROJECT'
                  ? 'bg-[#000000] text-[#FFFFFF] border-black'
                  : 'bg-[#FAF6F0] text-[#000000] border-[#D8CEBE] hover:bg-[#ECE4DA]'
              }`}
            >
              Mini Projects
            </button>
          </div>

          {/* Highlight Banner when filtering by Starting 3000 */}
          {priceRange === 'STARTS_3000' && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-400/25 via-amber-200/40 to-amber-100/30 border-2 border-amber-500 shadow-xs flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-400 text-black shrink-0">
                  <Sparkles className="h-4 w-4 fill-black" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-black">
                    Showing Projects Starting From ₹3,000
                  </h4>
                  <p className="text-[11px] text-black/80 font-medium">
                    Verified university deliverable packages including source code, IEEE report, and PPT slides for ₹3,000.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPriceRange('ALL')}
                className="px-3 py-1 rounded-full bg-black text-white text-[11px] font-bold hover:bg-neutral-800 shrink-0"
              >
                Clear Filter
              </button>
            </div>
          )}
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
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
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
                className="mt-4 px-5 py-2.5 rounded-full bg-[#000000] text-[#FFFFFF] font-bold text-xs shadow-xs"
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

export default function ProjectsCatalogPage() {
  return (
    <Suspense fallback={<div className="p-10 text-[#000000] text-sm font-bold">Loading Catalog...</div>}>
      <CatalogContent />
    </Suspense>
  );
}
