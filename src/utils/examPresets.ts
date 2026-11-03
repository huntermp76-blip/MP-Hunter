import { ExamPreset } from '../types';

export const examPresets: ExamPreset[] = [
  {
    id: 'ssc-photo',
    name: 'SSC Photo (CGL, CHSL, MTS, GD)',
    nameHindi: 'एसएससी फोटो (CGL, CHSL, GD)',
    category: 'Exam',
    targetSizeKb: 45, // Under 50 KB
    recommendedWidth: 350,
    recommendedHeight: 450,
    format: 'image/jpeg',
    description: '20 KB to 50 KB, 3.5 cm x 4.5 cm JPEG',
    descriptionHindi: '20 KB से 50 KB के बीच, JPEG'
  },
  {
    id: 'ssc-sign',
    name: 'SSC Signature (CGL, CHSL, MTS)',
    nameHindi: 'एसएससी हस्ताक्षर (Sign)',
    category: 'Exam',
    targetSizeKb: 18, // Under 20 KB
    recommendedWidth: 400,
    recommendedHeight: 200,
    format: 'image/jpeg',
    description: '10 KB to 20 KB, 4.0 cm x 2.0 cm JPEG',
    descriptionHindi: '10 KB से 20 KB के बीच, साफ़ सफ़ेद बैकग्राउंड'
  },
  {
    id: 'upsc-photo',
    name: 'UPSC Civil Services / NDA / CDS Photo',
    nameHindi: 'यूपीएससी फोटो (IAS, NDA, CDS)',
    category: 'Exam',
    targetSizeKb: 150,
    recommendedWidth: 550,
    recommendedHeight: 550,
    format: 'image/jpeg',
    description: '20 KB to 300 KB, square or 3:4 ratio',
    descriptionHindi: '20 KB से 300 KB, 3/4 चेहरा दिखना चाहिए'
  },
  {
    id: 'neet-jee-photo',
    name: 'NTA NEET & JEE Main Candidate Photo',
    nameHindi: 'नीट व जेईई मेन फोटो',
    category: 'Exam',
    targetSizeKb: 90,
    recommendedWidth: 400,
    recommendedHeight: 500,
    format: 'image/jpeg',
    description: '10 KB to 200 KB, 80% face coverage',
    descriptionHindi: '10 KB से 200 KB, 80% चेहरा सफ़ेद बैकग्राउंड'
  },
  {
    id: 'bank-photo',
    name: 'IBPS / SBI Bank PO & Clerk Photo',
    nameHindi: 'बैंक पीओ व क्लर्क फोटो (SBI/IBPS)',
    category: 'Exam',
    targetSizeKb: 40,
    recommendedWidth: 200,
    recommendedHeight: 230,
    format: 'image/jpeg',
    description: '20 KB to 50 KB, 200 x 230 pixels',
    descriptionHindi: '20 KB से 50 KB, 200 x 230 पिक्सेल'
  },
  {
    id: 'pan-photo',
    name: 'PAN Card (NSDL / UTIITSL) Photo',
    nameHindi: 'पैन कार्ड फोटो (NSDL / UTI)',
    category: 'Document',
    targetSizeKb: 45,
    recommendedWidth: 213,
    recommendedHeight: 213,
    format: 'image/jpeg',
    description: 'Under 50 KB, 200 DPI, 213 x 213 pixels',
    descriptionHindi: 'अधिकतम 50 KB, 213 x 213 पिक्सेल'
  },
  {
    id: 'pan-sign',
    name: 'PAN Card Signature (NSDL / UTIITSL)',
    nameHindi: 'पैन कार्ड हस्ताक्षर',
    category: 'Document',
    targetSizeKb: 18,
    recommendedWidth: 400,
    recommendedHeight: 200,
    format: 'image/jpeg',
    description: 'Under 20 KB, 200 DPI, clear black ink',
    descriptionHindi: 'अधिकतम 20 KB, काली स्याही'
  },
  {
    id: 'whatsapp-web',
    name: 'WhatsApp & Fast Web Sharing',
    nameHindi: 'व्हाट्सएप व वेबसाइट शेयरिंग',
    category: 'Social',
    targetSizeKb: 250,
    format: 'image/webp',
    description: 'Under 300 KB WebP for ultra-fast load',
    descriptionHindi: '300 KB से कम, बिना किसी क्वालिटी नुकसान'
  }
];
