export const instant = false;

import { formatINR } from '@/lib/utils/currency';
import { Shield, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: projects = [] } = await supabase.from('projects').select('*').order('created_at', { ascending: false });

  const totalRevenue = 148900;
  const totalOrders = 84;
  const totalProjects = projects?.length || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#FAFAFA]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-slate-900" />
            <h1 className="text-3xl font-extrabold text-slate-900">Admin Portal</h1>
          </div>
          <p className="text-sm text-slate-600 mt-1">Manage project catalog, track Razorpay sales & manage customer orders.</p>
        </div>

        <button className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-xs">
          <Plus className="h-4 w-4" />
          Upload New Project
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Revenue</span>
          <div className="text-3xl font-extrabold text-slate-900">{formatINR(totalRevenue)}</div>
          <span className="text-[11px] text-slate-500 font-medium">Processed securely via Razorpay UPI</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed Orders</span>
          <div className="text-3xl font-extrabold text-slate-900">{totalOrders}</div>
          <span className="text-[11px] text-slate-500 font-medium">Student downloads</span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-2 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Projects</span>
          <div className="text-3xl font-extrabold text-slate-900">{totalProjects}</div>
          <span className="text-[11px] text-slate-500 font-medium">Across 7 engineering branches</span>
        </div>
      </div>

      {/* Projects Management Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h2 className="text-lg font-extrabold text-slate-900">Catalog Projects</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Project Title</th>
                <th className="p-3">Branch</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Downloads</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">
                    {project.title}
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      {project.branch}
                    </span>
                  </td>
                  <td className="p-3">
                    {project.category === 'MAJOR_FINAL_YEAR' ? 'Major Project' : 'Mini Project'}
                  </td>
                  <td className="p-3 font-extrabold text-slate-900">
                    {formatINR(project.discounted_price_inr || project.price_inr)}
                  </td>
                  <td className="p-3">{project.download_count} downloads</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Published
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
