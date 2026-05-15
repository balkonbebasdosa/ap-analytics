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

const CATEGORY_MAP: Record<string, string> = {
  "cafe": "F&B",
  "restaurant": "F&B",
  "meal_takeaway": "F&B",
  "bakery": "F&B",
  "bar": "F&B",
  "supermarket": "Retail",
  "convenience_store": "Retail",
  "clothing_store": "Retail",
  "hardware_store": "Retail",
  "pet_store": "Retail",
  "book_store": "Retail",
  "laundry": "Umum",
  "car_repair": "Automotive",
  "car_wash": "Automotive",
  "pharmacy": "Health & Beauty",
  "doctor": "Health & Beauty",
  "dentist": "Health & Beauty",
  "beauty_salon": "Health & Beauty",
  "spa": "Health & Beauty",
  "electronics_store": "Technology",
  "cell_phone_store": "Technology",
  "gym": "Health & Beauty",
  "park": "Umum",
  "stadium": "Umum",
  "movie_theater": "Umum",
  "night_club": "Umum",
  "tourist_attraction": "Umum",
  "gas_station": "Automotive",
  "car_dealer": "Automotive",
  "car_rental": "Automotive",
  "lawyer": "Professional Services",
  "school": "Professional Services",
  "university": "Professional Services"
};

export const STRATEGY_DICTIONARY: Record<string, Record<string, StrategyAnalysis>> = {
  "F&B": {
    low: {
      swot: {
        strengths: ["Modal awal kecil."],
        weaknesses: ["Visibilitas merek sangat rendah."],
        opportunities: ["Masuk ke niche diet khusus."],
        threats: ["Kompetitor harga murah di area sekitar."]
      },
      advices: [
        "Cari lokasi yang lebih dekat dengan pemukiman padat.",
        "Gunakan iklan lokal di media sosial untuk meningkatkan kesadaran.",
        "Audit kembali menu untuk menekan Food Cost."
      ]
    },
    medium: {
      swot: {
        strengths: ["Konsistensi rasa dan kualitas bahan baku yang terjaga."],
        weaknesses: ["Variasi menu yang terbatas dibanding pesaing besar."],
        opportunities: ["Potensi melayani paket katering untuk kantor lokal."],
        threats: ["Fluktuasi harga bahan pokok pangan."]
      },
      advices: [
        "Buat menu spesial mingguan untuk menarik pelanggan tetap.",
        "Jalin kerja sama dengan supplier bahan baku lokal.",
        "Optimalkan jam operasional pada waktu makan sibuk."
      ]
    },
    high: {
      swot: {
        strengths: ["Efisiensi biaya sewa tinggi."],
        weaknesses: ["Ketergantungan pada platform pengiriman."],
        opportunities: ["Ekspansi menu viral."],
        threats: ["Kenaikan biaya komisi aplikasi."]
      },
      advices: [
        "Fokus pada kemasan yang tahan lama untuk pengiriman.",
        "Gunakan skema promo bundling untuk meningkatkan nilai pesanan.",
        "Bangun database pelanggan mandiri via WhatsApp/Web."
      ]
    }
  },
  "Professional Services": {
    low: {
      swot: {
        strengths: ["Biaya konsultasi bisa lebih fleksibel."],
        weaknesses: ["Kurangnya kepercayaan klien di lokasi baru."],
        opportunities: ["Layanan konsultasi online."],
        threats: ["Firma mapan yang mendominasi pasar."]
      },
      advices: [
        "Berikan sesi konsultasi gratis pertama untuk membangun trust.",
        "Aktif dalam seminar atau forum komunitas lokal.",
        "Pertimbangkan lokasi yang dekat dengan pusat pemerintahan/pengadilan."
      ]
    },
    medium: {
      swot: {
        strengths: ["Tim profesional yang kompeten dan berpengalaman."],
        weaknesses: ["Jaringan klien yang belum terlalu luas."],
        opportunities: ["Menawarkan paket konsultasi bulanan untuk UMKM."],
        threats: ["Banyak klien yang memilih firma nama besar."]
      },
      advices: [
        "Gunakan sistem referensi untuk mendapatkan klien baru.",
        "Buat publikasi atau artikel untuk menunjukkan keahlian.",
        "Pastikan respons yang sangat cepat pada prospek klien."
      ]
    },
    high: {
      swot: {
        strengths: ["Kredibilitas lokasi di pusat bisnis."],
        weaknesses: ["Biaya operasional kantor tinggi."],
        opportunities: ["Kemitraan dengan korporasi besar di sekitar."],
        threats: ["Perubahan regulasi yang mendadak."]
      },
      advices: [
        "Fokus pada spesialisasi hukum yang paling dibutuhkan di area tersebut.",
        "Gunakan SEO lokal untuk menarik klien yang mencari layanan terdekat.",
        "Adopsi teknologi legal-tech untuk efisiensi riset."
      ]
    }
  },
  "Retail": {
    low: {
      swot: {
        strengths: ["Biaya operasional relatif rendah."],
        weaknesses: ["Kurangnya daya tarik bagi orang yang sekadar lewat."],
        opportunities: ["Fokus pada produk kebutuhan dasar yang sangat spesifik."],
        threats: ["Kehilangan pelanggan ke minimarket berjejaring."]
      },
      advices: [
        "Fokus pada barang-barang fast-moving yang selalu dicari.",
        "Kurangi stok mati melalui diskon cuci gudang.",
        "Gunakan promosi tebus murah untuk meningkatkan keranjang belanja."
      ]
    },
    medium: {
      swot: {
        strengths: ["Pelanggan komunitas yang stabil."],
        weaknesses: ["Ruang penyimpanan atau display yang terbatas."],
        opportunities: ["Penambahan layanan pesan-antar untuk produk tertentu."],
        threats: ["Promo agresif dari supermarket besar."]
      },
      advices: [
        "Kurasikan produk agar lebih relevan dengan demografi lokal.",
        "Lakukan survei kecil untuk mengetahui barang yang sulit dicari warga.",
        "Jaga kebersihan dan penataan lorong agar nyaman."
      ]
    },
    high: {
      swot: {
        strengths: ["Letak yang sangat strategis dengan lalu lintas kaki tinggi."],
        weaknesses: ["Persediaan barang sangat bergantung pada tren."],
        opportunities: ["Peluncuran produk eksklusif musiman."],
        threats: ["Disrupsi besar dari e-commerce."]
      },
      advices: [
        "Terapkan sistem manajemen inventaris digital yang canggih.",
        "Berikan pengalaman belanja in-store yang tidak didapatkan online.",
        "Maksimalkan visual merchandising di etalase."
      ]
    }
  },
  "Health & Beauty": {
    low: {
      swot: {
        strengths: ["Dapat menyesuaikan layanan dengan harga bersahabat."],
        weaknesses: ["Kesulitan meyakinkan klien tanpa testimoni yang kuat."],
        opportunities: ["Promosi bundling untuk grup atau keluarga."],
        threats: ["Stigma terhadap kualitas layanan berharga murah."]
      },
      advices: [
        "Bagikan portofolio atau before-after di media sosial.",
        "Mulai dengan menawarkan satu layanan unggulan yang tak terkalahkan.",
        "Jaga komunikasi pasca-perawatan untuk membangun relasi."
      ]
    },
    medium: {
      swot: {
        strengths: ["Pelanggan yang kembali secara rutin setiap bulan."],
        weaknesses: ["Kapasitas pelayanan terbatas pada jam sibuk."],
        opportunities: ["Cross-selling produk perawatan untuk digunakan di rumah."],
        threats: ["Sulitnya mempertahankan staf atau terapis terbaik."]
      },
      advices: [
        "Implementasikan sistem reservasi online yang mudah.",
        "Sediakan program paket untuk beberapa kali kunjungan.",
        "Berikan insentif menarik bagi staf berdasarkan kinerja."
      ]
    },
    high: {
      swot: {
        strengths: ["Kualitas pelayanan premium dengan peralatan modern."],
        weaknesses: ["Gaji staf spesialis yang membebani margin."],
        opportunities: ["Menambah paket langganan layanan kecantikan atau kesehatan."],
        threats: ["Ketidakpuasan yang cepat menyebar di ulasan online."]
      },
      advices: [
        "Utamakan standar higienitas dan kenyamanan yang mutlak.",
        "Berikan pelatihan layanan pelanggan secara rutin kepada staf.",
        "Dorong klien puas untuk meninggalkan ulasan bintang lima."
      ]
    }
  },
  "Technology": {
    low: {
      swot: {
        strengths: ["Modal awal untuk perbaikan atau servis relatif kecil."],
        weaknesses: ["Kurangnya suplai sparepart di area sekitar."],
        opportunities: ["Membuka layanan servis panggilan ke rumah."],
        threats: ["Orang lebih memilih beli baru dibanding servis."]
      },
      advices: [
        "Tawarkan garansi uang kembali untuk setiap servis.",
        "Buat konten edukasi ringan mengenai perawatan gadget.",
        "Bekerja sama dengan toko pulsa kecil di sekitar."
      ]
    },
    medium: {
      swot: {
        strengths: ["Mempunyai basis pelanggan loyal untuk servis dan aksesoris."],
        weaknesses: ["Persaingan harga aksesoris dari toko online sangat ketat."],
        opportunities: ["Menerima tukar tambah perangkat bekas."],
        threats: ["Teknologi gadget berkembang terlalu cepat sehingga stok mudah usang."]
      },
      advices: [
        "Jangan menyimpan terlalu banyak stok casing atau aksesoris musiman.",
        "Jalin relasi yang baik agar pelanggan merekomendasikan servis Anda.",
        "Tawarkan pelindung layar atau casing setiap selesai servis."
      ]
    },
    high: {
      swot: {
        strengths: ["Kredibilitas toko sangat baik di mata masyarakat sekitar."],
        weaknesses: ["Sewa tempat di lokasi premium menekan profit penjualan aksesoris."],
        opportunities: ["Menjadi mitra resmi distribusi brand tertentu."],
        threats: ["Perang harga secara langsung dengan ritel teknologi raksasa."]
      },
      advices: [
        "Sediakan layanan cicilan atau paylater untuk memudahkan pelanggan.",
        "Pastikan display toko terang, bersih, dan modern.",
        "Adakan promo tukar tambah besar-besaran secara berkala."
      ]
    }
  },
  "Automotive": {
    low: {
      swot: {
        strengths: ["Biaya layanan fleksibel sesuai kemampuan pelanggan."],
        weaknesses: ["Kurangnya alat diagnostik modern."],
        opportunities: ["Melayani servis darurat di jalan sekitar."],
        threats: ["Pelanggan lebih percaya bengkel resmi."]
      },
      advices: [
        "Berikan layanan jujur dan transparan terkait biaya sparepart.",
        "Cetak kartu nama dan bagikan di pom bensin sekitar.",
        "Sediakan ruang tunggu sederhana dengan minuman gratis."
      ]
    },
    medium: {
      swot: {
        strengths: ["Mekanik yang handal dan sudah dikenal di komunitas."],
        weaknesses: ["Antrean kendaraan sering menumpuk di area terbatas."],
        opportunities: ["Menawarkan layanan antar-jemput kendaraan pelanggan."],
        threats: ["Munculnya bengkel waralaba modern."]
      },
      advices: [
        "Sediakan sistem booking untuk mencegah penumpukan kendaraan.",
        "Tawarkan layanan ekstra seperti cuci gratis setelah servis besar.",
        "Aktifkan pengingat servis bulanan via WhatsApp."
      ]
    },
    high: {
      swot: {
        strengths: ["Fasilitas lengkap dengan ruang tunggu premium."],
        weaknesses: ["Biaya overhead dan gaji teknisi sangat tinggi."],
        opportunities: ["Menjadi bengkel rujukan asuransi."],
        threats: ["Peralihan tren ke kendaraan listrik (EV) yang minim perawatan mekanis."]
      },
      advices: [
        "Segera latih mekanik untuk perawatan dasar kendaraan listrik.",
        "Fokus pada layanan cuci poles premium dengan harga margin tinggi.",
        "Jalin kemitraan dengan klub otomotif elit di kota Anda."
      ]
    }
  },
  "Umum": {
    low: {
      swot: {
        strengths: ["Masih terdapat celah pasar karena sedikitnya kompetitor serupa."],
        weaknesses: ["Daya beli wilayah rendah dan aksesibilitas lokasi yang sulit dijangkau."],
        opportunities: ["Potensi pengembangan layanan pesan-antar untuk menjangkau area luar."],
        threats: ["Risiko kerugian tinggi akibat biaya operasional tidak sebanding dengan trafik."]
      },
      advices: [
        "Tinjau kembali pemilihan lokasi sebelum menandatangani kontrak sewa.",
        "Fokus pada efisiensi operasional untuk menekan biaya tetap.",
        "Lakukan riset pasar mendalam mengenai selera warga lokal."
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
        "Gunakan program loyalitas untuk menjaga retensi pelanggan.",
        "Optimalkan tampilan fisik tempat usaha agar lebih mencolok."
      ]
    },
    high: {
      swot: {
        strengths: ["Dominasi lokasi yang strategis dengan fasilitas publik yang lengkap."],
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
  }
};

export function getDetailedStrategy(category: string, score: number): StrategyAnalysis {
  const parentCategory = CATEGORY_MAP[category] || "Umum";
  const categoryDict = STRATEGY_DICTIONARY[parentCategory] || STRATEGY_DICTIONARY["Umum"];

  if (score < 50) {
    return categoryDict.low;
  } else if (score >= 50 && score <= 75) {
    return categoryDict.medium;
  } else {
    return categoryDict.high;
  }
}
