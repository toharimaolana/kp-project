import { getSupabase } from './supabase';

/**
 * Menyimpan data log membaca (guest) ke tabel reading_logs
 * @param {Object} data - { student_name, student_class, module_slug, status }
 */
export async function insertReadingLog(data) {
  const supabase = getSupabase();
  if (!supabase) {
    console.error('Supabase client not configured');
    return { error: new Error('Supabase client not configured') };
  }

  const { error } = await supabase
    .from('reading_logs')
    .insert([
      {
        student_name: data.student_name,
        student_class: data.student_class,
        module_slug: data.module_slug,
        status: data.status,
      }
    ]);

  if (error) {
    console.error('Failed to insert reading log:', error);
  }

  return { success: !error, error };
}

/**
 * Menyimpan event interaksi (view/like) ke tabel literacy_event
 */
export async function insertEngagementEvent(material_slug, action_type) {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: new Error('Supabase client not configured') };

  const { error } = await supabase
    .from('literacy_event')
    .insert([
      {
        material_slug,
        action_type
      }
    ]);

  if (error) {
    console.error(`Failed to insert ${action_type} event:`, error);
  }

  return { success: !error, error };
}

/**
 * Mengambil total views dan likes untuk suatu materi
 */
export async function getEngagementMetrics(material_slug) {
  const supabase = getSupabase();
  if (!supabase) return { views: 0, likes: 0 };

  const [viewRes, likeRes] = await Promise.all([
    supabase
      .from('literacy_event')
      .select('*', { count: 'exact', head: true })
      .eq('material_slug', material_slug)
      .eq('action_type', 'view'),
    supabase
      .from('literacy_event')
      .select('*', { count: 'exact', head: true })
      .eq('material_slug', material_slug)
      .eq('action_type', 'like')
  ]);

  return {
    views: viewRes.count || 0,
    likes: likeRes.count || 0
  };
}

/**
 * Mengambil total views dan likes untuk SEMUA materi (agregasi by slug)
 */
export async function getAllEngagementMetrics() {
  const supabase = getSupabase();
  if (!supabase) return {};

  const { data, error } = await supabase
    .from('literacy_event')
    .select('material_slug, action_type');

  if (error) {
    console.error('Failed to fetch all engagement metrics:', error);
    return {};
  }

  const metrics = {};
  for (const row of data) {
    if (!metrics[row.material_slug]) {
      metrics[row.material_slug] = { views: 0, likes: 0 };
    }
    if (row.action_type === 'view') {
      metrics[row.material_slug].views += 1;
    } else if (row.action_type === 'like') {
      metrics[row.material_slug].likes += 1;
    }
  }

  return metrics;
}
