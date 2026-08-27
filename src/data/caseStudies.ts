export interface CaseStudyItem {
  id: string;
  title: string;
  clientIndustry: string;
  year: string;
  summary: string;
  challenge: string;
  solution: string;
  results: { label: string; value: string }[];
  tags: string[];
  imageGradient: string;
}

export const caseStudiesData: CaseStudyItem[] = [
  {
    id: "bank-rakyat-core-ai",
    title: "AI Fraud Detection & Autonomous Risk Assessment Engine",
    clientIndustry: "Financial Services & Banking",
    year: "2025",
    summary:
      "Implementasi arsitektur AI deteksi anomali transaksi real-time pada 12 juta akun aktif dengan latency evaluasi sub-10ms.",
    challenge:
      "Sistem legasi tidak mampu memproses lonjakan 8.000 transaksi/detik pada jam sibuk, menyebabkan false positive deteksi penipuan sebesar 14%.",
    solution:
      "Membangun pipeline event-driven menggunakan Apache Flink dan model Graph Neural Network yang di-deploy pada Kubernetes multi-region.",
    results: [
      { label: "Kecepatan Deteksi", value: "< 8.4 ms" },
      { label: "Penurunan Fraud", value: "92.8%" },
      { label: "False Positive", value: "Turun ke 0.8%" },
    ],
    tags: ["PyTorch", "Kubernetes", "Apache Flink", "Go", "Redis Cluster"],
    imageGradient: "from-zinc-900 via-neutral-900 to-black",
  },
  {
    id: "logistik-nusantara-cloud",
    title: "Modernisasi Cloud Multi-Region & Autonomous Fleet Routing",
    clientIndustry: "Supply Chain & Logistics",
    year: "2025",
    summary:
      "Transformasi infrastruktur on-premise ke hybrid cloud terdistribusi dengan algoritma perutean armada pintar berbasis AI.",
    challenge:
      "Kerapuhan server fisik saat promo belanja nasional dan pemborosan konsumsi bahan bakar armada ekspedisi antar pulau.",
    solution:
      "Migrasi 400+ microservices ke AWS EKS dengan arsitektur auto-scaling dinamis dan algoritma optimasi rute matematis.",
    results: [
      { label: "Penghematan Biaya Cloud", value: "38%" },
      { label: "Uptime Pencapaian", value: "99.998%" },
      { label: "Efisiensi Pengiriman", value: "+27.4%" },
    ],
    tags: ["AWS EKS", "Terraform", "ArgoCD", "Next.js", "PostgreSQL"],
    imageGradient: "from-stone-900 via-zinc-900 to-black",
  },
  {
    id: "telekom-zero-trust",
    title: "Transformasi Keamanan Zero Trust & Unified SOC Integration",
    clientIndustry: "Telecommunications & ISP",
    year: "2024",
    summary:
      "Pengamanan 45.000 titik endpoint internal dan data center nasional melalui enkripsi end-to-end dan identity-aware access.",
    challenge:
      "Ancaman serangan lateral movement dan kebocoran credential yang berpotensi melumpuhkan layanan publik strategis.",
    solution:
      "Penerapan arsitektur Zero Trust Network Access (ZTNA) terintegrasi dengan SIEM real-time monitoring dan automated incident response.",
    results: [
      { label: "Waktu Respon Ancaman", value: "-85%" },
      { label: "Kepatuhan Regulasi", value: "100% ISO 27001" },
      { label: "Audit Keamanan", value: "Grade A+" },
    ],
    tags: ["Zero Trust", "Vault", "Cloudflare One", "Wazuh", "WireGuard"],
    imageGradient: "from-neutral-950 via-zinc-900 to-black",
  },
  {
    id: "medika-data-platform",
    title: "Healthcare Analytics Platform & HIPAA-Compliant Data Lake",
    clientIndustry: "Healthcare & Life Sciences",
    year: "2024",
    summary:
      "Pembangunan platform agregasi rekam medis elektronik terenkripsi quantum-safe untuk 60+ jaringan rumah sakit di Indonesia.",
    challenge:
      "Fragmentasi data pasien antar rumah sakit dan regulasi ketat perlindungan data pribadi kesehatan masyarakat.",
    solution:
      "Arsitektur data lake berbasis Apache Iceberg dengan enkripsi lapis ganda dan interface antarmuka visual performa tinggi.",
    results: [
      { label: "Interoperabilitas RS", value: "60+ Terhubung" },
      { label: "Enkripsi Keamanan", value: "AES-256 + ZK" },
      { label: "Kepuasan Dokter", value: "98.2%" },
    ],
    tags: ["FastAPI", "Apache Iceberg", "React", "Docker", "DuckDB"],
    imageGradient: "from-zinc-900 via-neutral-950 to-black",
  },
];
