import { getSupabase } from '@/services/supabase.js';

/** Nama tabel event anonim (sinkron dengan InteractionTracker nanti). */
export const LITERACY_EVENTS_TABLE = 'literacy_events';
let hasWarnedMissingTable = false;

/**
 * Skema tabel yang diharapkan di Supabase:
 * - material_slug (text, not null)
 * - action_type (text, e.g. 'view' | 'scroll' | 'play')
 * - created_at (timestamptz, default now())
 *
 * RLS: sesuaikan kebijakan insert (anon) dan select (anon atau via RPC) di dashboard Supabase.
 */

/**
 * Mengambil event dalam jendela waktu untuk dihitung di klien.
 * @param {string} sinceIso
 * @returns {Promise<Array<{ material_slug: string, created_at: string }>>}
 */
async function fetchEventsSince(sinceIso) {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from(LITERACY_EVENTS_TABLE)
    .select('material_slug, created_at')
    .gte('created_at', sinceIso);

  if (error) {
    const message = error.message || '';
    const code = error.code || '';
    // Tangkap error tabel tidak ada (42P01) atau 404 Not Found
    if (code === '42P01' || message.includes('exist') || message.includes('find') || String(error.status) === '404' || code === 'PGRST116') {
      if (!hasWarnedMissingTable) {
        console.warn(
          '[analytics] Tabel public.literacy_events belum tersedia di Supabase. Fitur analitik ditunda sementara.'
        );
        hasWarnedMissingTable = true;
      }
      return [];
    }
    // Jika error lain, jangan sampai crash
    console.warn('[analytics] Info gagal mengambil literacy_events (Abaikan jika tabel belum dibuat):', message);
    return [];
  }
  return data ?? [];
}

function countBySlug(rows, predicate = () => true) {
  const counts = new Map();
  for (const row of rows) {
    if (!row?.material_slug || !predicate(row)) continue;
    const slug = row.material_slug;
    counts.set(slug, (counts.get(slug) || 0) + 1);
  }
  return counts;
}

function topSlugs(counts, limit) {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);
}

/**
 * Agregasi "materi terpopuler" dan "tren" berdasarkan jumlah event (semua action_type).
 * - Terpopuler: peringkat atas dalam jendela `popularWindowDays`.
 * - Trend: peringkat atas dalam jendela `trendWindowDays` yang belum dapat badge Terpopuler.
 *
 * @param {object} [options]
 * @param {number} [options.popularLimit=3]
 * @param {number} [options.trendLimit=3]
 * @param {number} [options.popularWindowDays=30]
 * @param {number} [options.trendWindowDays=7]
 * @returns {Promise<Map<string, 'popular' | 'trend'>>}
 */
export async function getLiteracyHubBadgesByMaterialSlug(options = {}) {
  const popularLimit = options.popularLimit ?? 3;
  const trendLimit = options.trendLimit ?? 3;
  const popularWindowDays = options.popularWindowDays ?? 30;
  const trendWindowDays = options.trendWindowDays ?? 7;

  const supabase = getSupabase();
  if (!supabase) return new Map();

  const now = Date.now();
  const popularSince = new Date(now - popularWindowDays * 86400000).toISOString();
  const trendSince = new Date(now - trendWindowDays * 86400000).toISOString();

  const rows = await fetchEventsSince(popularSince);
  if (!rows.length) return new Map();

  const popularCounts = countBySlug(rows);
  const popularSlugs = topSlugs(popularCounts, popularLimit);
  const popularSet = new Set(popularSlugs);

  const trendCounts = countBySlug(rows, (row) => row.created_at >= trendSince);
  const trendCandidates = topSlugs(trendCounts, trendLimit);

  const badges = new Map();
  for (const slug of popularSet) {
    badges.set(slug, 'popular');
  }
  for (const slug of trendCandidates) {
    if (!badges.has(slug)) {
      badges.set(slug, 'trend');
    }
  }

  return badges;
}
