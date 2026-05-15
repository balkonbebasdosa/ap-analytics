export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface StrategyAnalysis {
  swot: SWOT;
  advices: string[];
}

const STRATEGY_DICTIONARY = {
  low: {
    swot: {
      strengths: ["Masih terdapat celah pasar karena sedikitnya kompetitor serupa."],
      weaknesses: ["Daya beli wilayah rendah dan aksesibilitas lokasi yang sulit dijangkau."],
      opportunities: ["Potensi pengembangan layanan pesan-antar untuk menjangkau area luar."],
      threats: ["Risiko kerugian tinggi akibat biaya operasional tidak sebanding dengan trafik."]
    },
    advices: [
      "Tinjau kembali pemilihan lokasi sebelum menandatangani kontrak sewa.",
      "fokus pada model bisnis 'Ghost Kitchen' untuk menekan biaya sewa.",
      "Lakukan riset pasar lebih mendalam mengenai selera harga warga lokal."
    ]
  },
  medium: {
    swot: {
      strengths: ["Lokasi memiliki trafik yang stabil dan profil pelanggan yang sesuai."],
      weaknesses: ["Tingkat persaingan cukup tinggi dengan bisnis yang sudah mapan."],
      opportunities: ["Kolaborasi dengan komunitas lokal atau event sekitar untuk promosi."],
      threats: ["Perang harga dengan kompetitor lama yang memiliki modal lebih besar."]
    },
    advices: [
      "Ciptakan produk 'Signature' yang tidak dimiliki oleh kompetitor sekitar.",
      "Gunakan program loyalitas (member) untuk menjaga retensi pelanggan.",
      "Optimalkan tampilan fisik toko agar lebih mencolok dibanding pesaing."
    ]
  },
  high: {
    swot: {
      strengths: ["Dominasi lokasi yang strategis dengan akses fasilitas publik yang lengkap."],
      weaknesses: ["Biaya sewa atau pajak di wilayah ini cenderung lebih mahal."],
      opportunities: ["Ekspansi produk ke layanan premium atau pembukaan cabang baru."],
      threats: ["Munculnya kompetitor baru yang mencoba meniru model bisnis sukses Anda."]
    },
    advices: [
      "Maksimalkan efisiensi stok untuk melayani volume pelanggan yang tinggi.",
      "Investasikan pada digital marketing untuk mempertahankan dominasi pasar.",
      "Jaga konsistensi kualitas karena ekspektasi pelanggan di area ini sangat tinggi."
    ]
  }
};

export function getStrategyAnalysis(bviScore: number): StrategyAnalysis {
  if (bviScore < 50) {
    return STRATEGY_DICTIONARY.low;
  } else if (bviScore >= 50 && bviScore <= 75) {
    return STRATEGY_DICTIONARY.medium;
  } else {
    return STRATEGY_DICTIONARY.high;
  }
}
