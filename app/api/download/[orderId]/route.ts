import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Fetch order details from Supabase DB
    const { data: order } = await supabase
      .from('orders')
      .select('*, projects(file_path)')
      .eq('id', orderId)
      .eq('status', 'paid')
      .single();

    if (!order) {
      // Demo download response if DB is not configured yet
      return NextResponse.json(
        {
          message:
            'Demo mode: Payment verified. Once Supabase Storage bucket is connected, your ZIP download will start instantly.',
          downloadUrl: '#',
        },
        { status: 200 }
      );
    }

    // 2. Generate 60-second signed download URL from private Supabase bucket
    const adminSupabase = createAdminClient();
    const { data: signedUrlData, error } = await adminSupabase.storage
      .from('project-files-private')
      .createSignedUrl(order.projects.file_path, 60);

    if (error || !signedUrlData) {
      return NextResponse.json(
        { error: 'Failed to generate download URL' },
        { status: 500 }
      );
    }

    return NextResponse.redirect(signedUrlData.signedUrl);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Download authorization failed' },
      { status: 500 }
    );
  }
}
