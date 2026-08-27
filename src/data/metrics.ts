export interface MetricItem {
  value: string;
  number: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  label: string;
  description: string;
}

export const metricsData: MetricItem[] = [
  {
    value: "99.99%",
    number: 99.99,
    suffix: "%",
    decimals: 2,
    label: "Uptime SLA Rata-rata",
    description: "Keandalan infrastruktur cloud enterprise",
  },
  {
    value: "150+",
    number: 150,
    suffix: "+",
    label: "Proyek Enterprise Deploy",
    description: "Implementasi AI, Cloud & Keamanan",
  },
  {
    value: "< 10ms",
    number: 10,
    prefix: "< ",
    suffix: "ms",
    label: "P99 Latency Response",
    description: "Performa arsitektur microservices terdistribusi",
  },
  {
    value: "0",
    number: 0,
    suffix: "",
    label: "Insiden Keamanan Siber",
    description: "Proteksi standar Zero Trust & ISO 27001",
  },
];

export const clientLogos = [
  { name: "Bank Artha Nusantara", sector: "Banking" },
  { name: "Logistik Prima Express", sector: "Supply Chain" },
  { name: "Telekom Digital Indonesia", sector: "Telco" },
  { name: "Medika Sehat Holdings", sector: "Healthcare" },
  { name: "Energi Mandiri Daya", sector: "Energy" },
  { name: "Aero Dirgantara Raya", sector: "Aviation" },
  { name: "Fintek Global Solusi", sector: "Fintech" },
  { name: "Retailindo Omnichannel", sector: "E-Commerce" },
];
