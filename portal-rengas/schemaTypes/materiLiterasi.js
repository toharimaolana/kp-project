export default {
  name: 'materiLiterasi',
  title: 'Materi Literasi',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Judul Materi',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'published',
      title: 'Dipublikasikan',
      type: 'boolean',
      description: 'Aktifkan agar materi tampil di halaman Literasi HUB',
      initialValue: true,
    },
    {
      name: 'materialType',
      title: 'Tipe Materi',
      type: 'string',
      options: {
        list: [
          { title: 'Flipbook (PDF)', value: 'flipbook' },
          { title: 'Video (YouTube)', value: 'video' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'grade',
      title: 'Kelas',
      type: 'number',
      options: {
        list: [1, 2, 3, 4, 5, 6],
      },
      validation: (Rule) => Rule.required().min(1).max(6),
    },
    {
      name: 'theme',
      title: 'Tema / Mata Pelajaran',
      type: 'string',
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'durationMinutes',
      title: 'Estimasi Durasi (Menit)',
      type: 'number',
    },
    {
      name: 'sortOrder',
      title: 'Urutan Tampil',
      type: 'number',
      description: 'Angka lebih kecil akan tampil lebih dulu',
    },
    {
      name: 'excerpt',
      title: 'Ringkasan / Deskripsi Singkat',
      type: 'text',
      rows: 3,
    },
    {
      name: 'pdfFile',
      title: 'File PDF',
      type: 'file',
      description: 'Hanya diwajibkan jika Tipe Materi adalah Flipbook',
      hidden: ({ document }) => document?.materialType !== 'flipbook',
    },
    {
      name: 'youtubeUrl',
      title: 'URL YouTube',
      type: 'url',
      description: 'Hanya diwajibkan jika Tipe Materi adalah Video',
      hidden: ({ document }) => document?.materialType !== 'video',
    },
  ],
};
