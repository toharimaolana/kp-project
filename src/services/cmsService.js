import mockData from '../data/mockData.json';

// Simulasi pemanggilan API ke Headless CMS (Sanity/Decap)
export const fetchNews = async () => {
  try {
    // Di produksi, ini akan menjadi: await axios.get('https://cms-url.com/api/news')
    // Untuk demo, kita gunakan setTimeout untuk mensimulasikan loading state
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockData.news);
      }, 800);
    });
  } catch (error) {
    console.error("Gagal mengambil berita:", error);
    throw error;
  }
};

export const fetchFAQ = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData.faq);
    }, 500);
  });
};
