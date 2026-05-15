export const FEEDBACK_DICTIONARY: Record<string, { low: string; medium: string; high: string }> = {
  "Low-cost / Value": {
    low: "Model harga terjangkau menghadapi hambatan besar di lokasi ini karena persaingan harga yang ketat atau volume pasar yang belum cukup. Anda perlu mengoptimalkan rantai pasok secara agresif dan mempertimbangkan lokasi dengan lalu lintas yang lebih tinggi.",
    medium: "Konsep berbasis nilai memiliki potensi sedang, tetapi margin akan cukup tipis. Keberhasilan bergantung pada perputaran harian yang tinggi dan pengendalian biaya operasional yang ketat.",
    high: "Model harga terjangkau sangat layak di area ini berkat permintaan pasar yang kuat dan indikator demografis yang mendukung. Fokus pada volume penjualan tinggi dan efisiensi operasional untuk memaksimalkan margin dibanding pesaing sekitar."
  },
  "Premium / High-end": {
    low: "Demografi lokal dan kepadatan pasar saat ini belum mendukung strategi harga premium di lokasi ini. Risiko performa rendah cukup besar kecuali Anda beralih ke harga yang lebih terjangkau atau mencari kawasan dengan daya beli lebih tinggi.",
    medium: "Konsep premium masih bisa bertahan di sini jika Anda menawarkan kualitas yang sangat berbeda dan sepadan dengan harga lebih tinggi. Investasi kuat pada pemasaran tertarget dan pengalaman pelanggan akan penting untuk menarik segmen yang tepat.",
    high: "Lokasi ini sangat siap untuk model bisnis premium. Daya tarik lokasi yang tinggi dan indikator daya beli sekitar menunjukkan pelanggan berpotensi membayar lebih untuk kualitas unggul dan eksklusivitas."
  },
  "Fast Service / Quick turnaround": {
    low: "Layanan cepat membutuhkan arus pengunjung yang besar, sementara lokasi ini masih kekurangan hal tersebut. Kepadatan pesaing dan skor permintaan yang rendah menunjukkan model ini akan sulit mencapai volume yang dibutuhkan untuk profitabilitas.",
    medium: "Model layanan cepat cukup layak di sini jika Anda mampu menangkap jam ramai secara efektif. Merampingkan operasional dan menawarkan opsi praktis siap ambil akan menjadi kunci untuk mengungguli pesaing lokal.",
    high: "Kondisi area ini sangat mendukung model layanan cepat dengan lalu lintas tinggi. Profil permintaan menunjukkan kebutuhan kuat terhadap layanan yang cepat dan andal, sehingga lokasi ini ideal untuk memaksimalkan volume transaksi harian."
  },
  "Specialized / Niche": {
    low: "Permintaan pasar untuk konsep yang sangat spesifik masih terlalu rendah di area ini. Tanpa daya tarik yang lebih luas atau basis pelanggan tujuan yang kuat, lokasi ini berisiko membuat bisnis stagnan.",
    medium: "Konsep niche Anda masih punya peluang jika mampu membangun komunitas yang loyal di sekitar penawaran spesifik tersebut. Anda perlu sangat mengandalkan pemasaran digital untuk menarik pelanggan dari luar radius jalan kaki terdekat.",
    high: "Data menunjukkan celah pasar besar yang sangat cocok untuk bisnis spesialis Anda. Minimnya pesaing langsung dan skor keunikan yang tinggi membuat Anda berpeluang cepat mendominasi niche tersebut."
  },
  "Eco-friendly / Sustainable": {
    low: "Meskipun positif, indikator pasar lokal menunjukkan konsumen di sini sangat sensitif terhadap harga dan mungkin belum siap membayar lebih untuk praktik berkelanjutan. Pertimbangkan untuk menonjolkan nilai utama terlebih dahulu agar lebih mudah mendapat traksi.",
    medium: "Keberlanjutan dapat menjadi nilai tambah di pasar ini, tetapi tidak bisa menjadi satu-satunya alasan pembelian. Pastikan kualitas produk inti dan harga tetap kompetitif dibanding bisnis tradisional di sekitar.",
    high: "Area ini menunjukkan kecocokan kuat dengan tren konsumen yang progresif dan peduli lingkungan. Konsep berkelanjutan Anda dapat menjadi pembeda besar dan menarik segmen pelanggan yang siap mendukung inisiatif hijau."
  },
  "Innovative / Tech-driven": {
    low: "Pasar lokal belum menunjukkan karakter early adopter yang dibutuhkan untuk mendukung konsep yang sangat inovatif atau berbasis teknologi. Anda mungkin menghadapi hambatan besar dalam edukasi dan adopsi pelanggan di lokasi ini.",
    medium: "Pendekatan berbasis teknologi dapat merampingkan operasional, tetapi inovasi yang langsung dirasakan pelanggan mungkin butuh waktu untuk diterima. Fokuskan teknologi untuk menurunkan biaya operasional sambil menjaga pengalaman pengguna tetap familiar dan mudah diakses.",
    high: "Demografi lokal sangat terbuka terhadap model bisnis modern berbasis teknologi. Pendekatan inovatif Anda berpotensi mengganggu pesaing tradisional di area ini dan menarik pelanggan modern yang mencari kemudahan."
  },
  "Fallback": {
    low: "Indikator pasar saat ini menunjukkan tantangan besar untuk lokasi ini. Persaingan tinggi atau permintaan rendah berarti Anda perlu mengevaluasi ulang strategi bisnis dengan cermat sebelum melanjutkan.",
    medium: "Lokasi ini menawarkan peluang sedang dengan profil risiko yang cukup seimbang. Keberhasilan akan sangat bergantung pada eksekusi operasional yang kuat dan diferensiasi yang jelas dari pesaing yang sudah ada.",
    high: "Data menunjukkan kondisi yang sangat mendukung untuk bisnis baru di area ini. Permintaan yang kuat dan persaingan yang masih terkendali memberi fondasi baik untuk pertumbuhan dan profitabilitas awal."
  }
};

export function getBusinessFeedback(concept: string, bviScore: number): string {
  const targetConcept = FEEDBACK_DICTIONARY[concept] ? concept : "Fallback";
  const feedbackTier = FEEDBACK_DICTIONARY[targetConcept];

  if (bviScore < 50) {
    return feedbackTier.low;
  } else if (bviScore >= 50 && bviScore <= 75) {
    return feedbackTier.medium;
  } else {
    return feedbackTier.high;
  }
}
