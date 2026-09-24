export const packageGroups = [
  {
    id: 'paket-pengobatan',
    title: 'Paket Pengobatan',
    description: 'Pilihan kombinasi terapi untuk kebutuhan pengobatan. Konsultasikan kondisi dan pilihan layanan dengan terapis sebelum reservasi.',
    items: [
      { name: 'Paket Pengobatan (Bekam Sunnah + TMD + Akupunktur)', duration: '60 menit', price: 200000 },
      { name: 'Akupunktur Pre/Pasca Stroke + TMD + Bekam', duration: '60 menit', price: 200000 },
      { name: 'TMD + Akupresur Pengobatan + Bekam', duration: '60 menit', price: 200000 }
    ]
  },
  {
    id: 'paket-perawatan',
    title: 'Paket Perawatan',
    description: 'Rangkaian layanan untuk relaksasi, kebugaran, dan perawatan diri. Pilih kombinasi yang sesuai setelah berkonsultasi dengan terapis.',
    items: [
      { name: 'Paket Relaksasi (Pijat Tradisional, Refleksi, Totok Kepala & Herbal Drink)', duration: '90 menit', price: 150000 },
      { name: 'Bekam Sunnah, Bekam Relaksasi & TMD', duration: '60 menit', price: 175000 },
      { name: 'Akupunktur Kesehatan, Akupresur Relaksasi & Kebugaran', duration: '60 menit', price: 175000 },
      { name: 'TMD, Akupresur & Bekam', duration: '60 menit', price: 175000 }
    ]
  },
  {
    id: 'paket-spesialis',
    title: 'Paket Spesialis',
    description: 'Pilihan paket dengan fokus kebutuhan khusus, termasuk promil, kecantikan, dan kebugaran. Detail layanan dapat dikonsultasikan terlebih dahulu.',
    items: [
      { name: 'Paket Stroke (Akupunktur, Akupresur, Stimulasi Saraf, Infrared, Pijat Tuina/Mobilisasi Sendi, Bekam Medis bila diperlukan, Fisioterapi Ringan, Herbal Support & Edukasi Gaya Hidup)', duration: '90 menit', price: 200000 },
      { name: 'Paket Saraf Kejepit (Akupunktur, Akupresur, Deep Tissue Massage & Infrared)', duration: '90 menit', price: 200000 },
      { name: 'Paket Nyeri (Pain Relief: Akupunktur, Akupresur, Infrared & Herbal Drink)', duration: '90 menit', price: 175000 },
      { name: 'Paket Promil Basic (Akupunktur, Akupunktur Telinga/TMD, Pijat Relaksasi & Terapi Herbal)', duration: '60 menit', price: 275000 },
      { name: 'Paket Promil Advance (Akupunktur, Akupunktur Telinga/TMD, Pijat Relaksasi, Terapi Herbal & Bekam)', duration: '90 menit', price: 375000 },
      { name: 'Paket Promil Intensive (Akupunktur, Akupunktur Telinga/TMD, Pijat Relaksasi, Bekam, Moksibusi & Terapi Herbal)', duration: '120 menit', price: 475000 },
      { name: 'Paket Promil Couple (Akupunktur, Bekam, Pijat Relaksasi & Terapi Herbal untuk pasangan)', duration: '120 menit', price: 650000 },
      { name: 'Paket Glow Up (Totok Meridian Aura Wajah, Facial Basic, Bekam Estetika & Akupunktur Estetika)', duration: '90 menit', price: 250000 },
      { name: 'Paket Pre Wedding (Totok Meridian Aura Wajah, Akupunktur Estetika/Anti-aging, Akupresur Relaksasi, Refleksi & Facial Basic)', duration: '120 menit', price: 400000 },
      { name: 'Paket Slimming Hit (Totok Sikut Perut, Moksibusi Pelangsingan, Akupunktur Slimming, Akupunktur Telinga & Bekam)', duration: '100 menit', price: 350000 },
      { name: 'Paket Kebugaran (Pijat Tradisional, Bekam, Refleksi, Totok Kepala & Herbal Drink)', duration: '120 menit', price: 225000 },
      { name: 'Paket VIP Holistik', duration: '150 menit', price: 350000 }
    ]
  },
  {
    id: 'paket-basic',
    title: 'Paket Basic',
    description: 'Pilihan awal untuk mengenal layanan bekam dan terapi dasar Rumah Terapi Asy-Syifa.',
    items: [
      { name: 'Paket Basic (Healthy Start: Konsultasi, Akupresur, Refleksi Kaki & Herbal Drink)', duration: '60 menit', price: 100000 },
      { name: 'Paket Bekam Sunnah', duration: '75 menit', price: 125000 },
      { name: 'Paket Bekam Sunnah (Bekam Sunnah, Pijat Relaksasi & Herbal Drink)', duration: '75 menit', price: 125000 },
      { name: 'Paket Wajah (Facial Rejuvenation, Akupunktur Wajah, Totok Wajah & Facial Basic)', duration: '90 menit', price: 250000 },
      { name: 'Paket Diabetes (Akupunktur, Akupresur & Bekam Ringan)', duration: '90 menit', price: 175000 },
      { name: 'Paket Hipertensi (Akupunktur, Akupresur & Bekam)', duration: '90 menit', price: 175000 }
    ]
  }
];

export const priceGroups = [
  {
    id: 'bekam',
    title: 'Bekam',
    items: [
      { name: 'Paket Bekam Sunnah (Bekam Basah, Bekam Kering, Pijat Relaksasi, Konsultasi Kesehatan & Herbal Drink)', duration: '60 menit', price: 200000 },
      { name: 'Bekam Sunnah', duration: '45 menit', price: 100000 },
      { name: 'Bekam Relaksasi (moving)', duration: '25 menit', price: 50000 },
      { name: 'Bekam Kering', duration: '30 menit', price: 75000 },
      { name: 'Bekam Api', duration: '30 menit', price: 75000 },
      { name: 'Bekam Kepala', duration: '30 menit', price: 75000 },
      { name: 'Bekam Estetika', duration: '45 menit', price: 90000 }
    ]
  },
  {
    id: 'akupunktur',
    title: 'Akupunktur',
    items: [
      { name: 'Akupunktur Kesehatan', duration: '45 menit', price: 100000 },
      { name: 'Akupunktur Pre/Pasca Stroke', duration: '60 menit', price: 120000 },
      { name: 'Akupunktur Kasus Khusus', duration: '60 menit', price: 120000 },
      { name: 'Akupunktur Estetika', duration: '60 menit', price: 150000 },
      { name: 'Akupunktur Promil Pasutri', duration: '90 menit', price: 250000 },
      { name: 'Akupunktur Telinga', duration: '30 menit', price: 75000 },
      { name: 'Akupunktur Moksibusi (Moxa)', duration: '30 menit', price: 75000 },
      { name: 'Akupunktur ABK', duration: '45 menit', price: 150000 }
    ]
  },
  {
    id: 'akupresur',
    title: 'Akupresur',
    items: [
      { name: 'Akupresur Relaksasi & Kebugaran', duration: '45 menit', price: 80000 },
      { name: 'Akupresur Pengobatan', duration: '45 menit', price: 90000 },
      { name: 'TMD', duration: '30 menit', price: 50000 },
      { name: 'Totok Meridian Aura Wajah', duration: '30 menit', price: 75000 },
      { name: 'Akupresur Telinga', duration: '30 menit', price: 60000 },
      { name: 'Pijat Syaraf & Refleksi', duration: '45 menit', price: 85000 }
    ]
  },
  {
    id: 'beauty-care',
    title: 'Beauty Care',
    items: [
      { name: 'Facial Basic', duration: '', price: 85000 },
      { name: 'Facial Acne', duration: '', price: 125000 },
      { name: 'Facial Whitening', duration: '', price: 150000 },
      { name: 'Facial Brightening', duration: '', price: 175000 },
      { name: 'Facial Oxy Acne', duration: '', price: 200000 },
      { name: 'Facial Oxy Flek', duration: '', price: 200000 },
      { name: 'Facial Gua Sha', duration: '', price: 175000 }
    ]
  }
];
