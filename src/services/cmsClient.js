import { createClient } from '@sanity/client';

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID;
const rawSanityToken = import.meta.env.VITE_SANITY_TOKEN;
const sanityToken =
  typeof rawSanityToken === 'string' && rawSanityToken.startsWith('sk')
    ? rawSanityToken
    : undefined;

export const client = projectId
  ? createClient({
      projectId,
      dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
      useCdn: import.meta.env.VITE_SANITY_USE_CDN === 'true',
      apiVersion: '2024-01-01',
      // Avoid invalid token values in browser env (common source of 401 "Session not found").
      token: sanityToken,
    })
  : null;

export const isCMSConfigured = !!projectId;

const newsFields = `
  _id,
  title,
  "slug": slug.current,
  "thumbnail": mainImage.asset->url,
  publishedAt,
  categories[]->{title},
  body,
  excerpt
`;

const teacherFields = `
  _id,
  name,
  "image": photo.asset->url,
  position,
  subject,
  order
`;

const galleryFields = `
  _id,
  title,
  "imageUrl": photo.asset->url,
  "caption": photo.caption,
  publishedAt
`;

const literacyMaterialFields = `
  _id,
  title,
  "slug": slug.current,
  materialType,
  grade,
  theme,
  "thumbnail": thumbnail.asset->url,
  durationMinutes,
  sortOrder,
  excerpt
`;

const literacyMaterialDetailFields = `
  ${literacyMaterialFields},
  "pdfUrl": pdfFile.asset->url,
  youtubeUrl,
  body
`;

export const getBerita = async () => {
  if (!client) return [];
  try {
    const query = `*[_type == "berita"] | order(publishedAt desc) {${newsFields}}`;
    const result = await client.fetch(query);
    return result.map(item => ({
      id: item._id,
      title: item.title,
      slug: item.slug,
      thumbnail: item.thumbnail,
      date: item.publishedAt,
      category: item.categories?.[0]?.title || 'Berita',
      excerpt: item.excerpt || '',
      content: item.body,
    }));
  } catch (error) {
    console.error('Error fetching berita:', error);
    return [];
  }
};

export const getBeritaBySlug = async (slug) => {
  if (!client) return null;
  try {
    const query = `*[_type == "berita" && slug.current == $slug][0] {${newsFields}}`;
    const result = await client.fetch(query, { slug });
    if (!result) return null;
    return {
      id: result._id,
      title: result.title,
      slug: result.slug,
      thumbnail: result.thumbnail,
      date: result.publishedAt,
      category: result.categories?.[0]?.title || 'Berita',
      excerpt: result.excerpt || '',
      content: result.body,
    };
  } catch (error) {
    console.error('Error fetching berita by slug:', error);
    return null;
  }
};

export const getGuru = async () => {
  if (!client) return [];
  try {
    const query = `*[_type == "guru"] | order(order asc) {${teacherFields}}`;
    const result = await client.fetch(query);
    return result.map(item => ({
      id: item._id,
      name: item.name,
      image: item.image,
      position: item.position || '',
      subject: item.subject || '',
      order: item.order || 0,
    }));
  } catch (error) {
    console.error('Error fetching guru:', error);
    return [];
  }
};

export const getGaleri = async () => {
  if (!client) return [];
  try {
    const query = `*[_type == "galeri"] | order(publishedAt desc) {${galleryFields}}`;
    const result = await client.fetch(query);
    return result.map(item => ({
      id: item._id,
      title: item.title,
      imageUrl: item.imageUrl,
      caption: item.caption,
      date: item.publishedAt,
    }));
  } catch (error) {
    console.error('Error fetching galeri:', error);
    return [];
  }
};

// Fetch profil sekolah (akreditasi & statistik)
// Catatan: schema Sanity bisa saja memiliki nama field yang berbeda.
// Query ini dibuat generik agar mengambil data jika field tersebut tersedia.
/**
 * @param {number | null} grade - Filter kelas 1–6, atau null untuk semua.
 */
export const getMateriLiterasi = async (grade = null) => {
  if (!client) return [];
  try {
    const baseFilter = '_type == "materiLiterasi" && published == true';
    const gradeFilter =
      grade !== null && grade !== undefined && Number.isFinite(Number(grade))
        ? ' && grade == $grade'
        : '';
    const query = `*[${baseFilter}${gradeFilter}] | order(coalesce(sortOrder, 999) asc, title asc) {${literacyMaterialFields}}`;
    const params =
      grade !== null && grade !== undefined && Number.isFinite(Number(grade))
        ? { grade: Number(grade) }
        : {};
    const result = await client.fetch(query, params);
    return result.map((item) => ({
      id: item._id,
      title: item.title,
      slug: item.slug,
      materialType: item.materialType,
      grade: item.grade,
      theme: item.theme || '',
      thumbnail: item.thumbnail,
      durationMinutes: item.durationMinutes,
      sortOrder: item.sortOrder,
      excerpt: item.excerpt || '',
    }));
  } catch (error) {
    console.error('Error fetching materi literasi:', error);
    return [];
  }
};

export const getMateriLiterasiBySlug = async (slug) => {
  if (!client) return null;
  try {
    const query = `*[ _type == "materiLiterasi" && slug.current == $slug && published == true ][0] {${literacyMaterialDetailFields}}`;
    const result = await client.fetch(query, { slug });
    if (!result) return null;
    return {
      id: result._id,
      title: result.title,
      slug: result.slug,
      materialType: result.materialType,
      grade: result.grade,
      theme: result.theme || '',
      thumbnail: result.thumbnail,
      durationMinutes: result.durationMinutes,
      sortOrder: result.sortOrder,
      excerpt: result.excerpt || '',
      pdfUrl: result.pdfUrl,
      youtubeUrl: result.youtubeUrl,
      body: result.body,
    };
  } catch (error) {
    console.error('Error fetching materi literasi by slug:', error);
    return null;
  }
};

export const getProfilSekolah = async () => {
  if (!client) return null;
  try {
    // Schema Sanity saat ini: _type === "profil"
    // - akreditasi
    // - jumlahGuruDanPegawai
    // - jumlahSiswa
    const query = `*[_type == "profil"] | order(_createdAt desc)[0]{
      "akreditasi": coalesce(akreditasi, statusAkreditasi, akreditasiSekolah),
      "jumlahGuruPegawai": coalesce(jumlahGuruDanPegawai, jumlahGuruPegawai),
      "jumlahSiswa": coalesce(jumlahSiswa)
    }`;

    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching profil sekolah:', error);
    return null;
  }
};