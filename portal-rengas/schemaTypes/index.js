import materiLiterasi from './materiLiterasi';

export const schemaTypes = [
  materiLiterasi,
  {
    name: 'profil',
    title: 'Profil Sekolah',
    type: 'document',
    fields: [
      {
        name: 'akreditasi',
        title: 'Akreditasi Sekolah',
        type: 'string',
        options: { list: ['A', 'B', 'C', 'Unggul'] }
      },
      {
        name: 'jumlahGuruDanPegawai',
        title: 'Jumlah Guru & Pegawai',
        type: 'number',
      },
      {
        name: 'jumlahSiswa',
        title: 'Jumlah Siswa',
        type: 'number',
      },
    ]
  },
  { 
    name: 'berita', // Field Berita & Kegiatan
    title: 'Berita & Kegiatan',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Judul',
        type: 'string',
        validation: (Rule) => Rule.required()
      },
      {
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        options: { source: 'title' },
        validation: (Rule) => Rule.required()
      },
      {
        name: 'mainImage',
        title: 'Thumbnail',
        type: 'image',
        options: { hotspot: true }
      },
      {
        name: 'publishedAt',
        title: 'Tanggal Publish',
        type: 'datetime'
      },
      {
        name: 'categories',
        title: 'Kategori',
        type: 'array',
        of: [{ type: 'reference', to: [{ type: 'kategori' }] }]
      },
      {
        name: 'excerpt',
        title: 'Ringkasan',
        type: 'text',
        rows: 3
      },
      {
        name: 'body',
        title: 'Konten',
        type: 'array',
        of: [
          { type: 'block' },
          { type: 'image', options: { hotspot: true } }
        ]
      }
    ]
  },
  {
    name: 'guru', // Field Guru & Staf
    title: 'Guru & Staf',
    type: 'document',
    fields: [
      {
        name: 'name',
        title: 'Nama',
        type: 'string',
        validation: (Rule) => Rule.required()
      },
      {
        name: 'photo',
        title: 'Foto',
        type: 'image',
        options: { hotspot: true }
      },
      {
        name: 'position',
        title: 'Jabatan/Mata Pelajaran',
        type: 'string'
      },
    ]
  },
  {
    name: 'galeri', // Field Galeri Foto
    title: 'Galeri Foto',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Judul Foto',
        type: 'string'
      },
      {
        name: 'photo',
        title: 'File Gambar',
        type: 'image',
        options: { hotspot: true }
      },
      {
        name: 'publishedAt',
        title: 'Tanggal Upload',
        type: 'datetime'
      }
    ]
  },
  {
    name: 'kategori',
    title: 'Kategori Berita',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Nama Kategori',
        type: 'string'
      }
    ]
  }
]