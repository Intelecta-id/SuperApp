export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  department: string;
  avatarPlaceholder: string;
  tagline: string;
  bio: string;
  yearsOfExp: number;
  featuredProjectsCount: number;
  skills: { category: string; items: string[] }[];
  certifications: string[];
  projects: {
    name: string;
    role: string;
    impact: string;
    tech: string[];
  }[];
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

export const teamData: TeamMember[] = [
  {
    slug: "reza-mahendra",
    name: "Dr. Reza Mahendra, S.Kom., M.Sc.",
    role: "Chief Technology Officer & AI Architect",
    department: "AI & Distributed Systems",
    avatarPlaceholder: "RM",
    tagline: "Merancang arsitektur AI enterprise yang tangguh, etis, dan berkecepatan tinggi.",
    bio: "Berpengalaman lebih dari 12 tahun dalam rekayasa sistem terdistribusi dan pembelajaran mesin tingkat lanjut. Menyelesaikan doktoral dalam Computer Science dengan fokus pada Efficient Large Language Model Inference. Memimpin arsitektur inti Intelecta untuk klien sektor perbankan dan telekomunikasi nasional.",
    yearsOfExp: 12,
    featuredProjectsCount: 28,
    skills: [
      { category: "Artificial Intelligence", items: ["Large Language Models", "PyTorch", "vLLM", "RAG Systems", "Vector Search"] },
      { category: "Distributed Systems", items: ["High-Concurrency Go", "Kafka", "Distributed Cache", "gRPC", "Ray Cluster"] },
      { category: "Architecture", items: ["System Design", "Zero Trust", "Fault-Tolerant Patterns", "Performance Optimization"] },
    ],
    certifications: [
      "AWS Certified Solutions Architect – Professional",
      "Google Cloud Certified Fellow – Quantum & AI",
      "NVIDIA Certified Deep Learning Institute Specialist",
    ],
    projects: [
      {
        name: "AI Fraud Detection & Risk Assessment Engine",
        role: "Lead Solution Architect",
        impact: "Menurunkan angka penipuan perbankan sebesar 92.8% dengan latency evaluasi sub-10ms.",
        tech: ["PyTorch", "Apache Flink", "Redis Cluster", "Go"],
      },
      {
        name: "Autonomous Document Intelligence Platform",
        role: "AI Tech Lead",
        impact: "Mengotomatisasi verifikasi 500.000 dokumen kepatuhan per bulan dengan akurasi 99.4%.",
        tech: ["LangChain", "Qdrant", "vLLM", "FastAPI"],
      },
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "reza@intelecta.id",
    },
  },
  {
    slug: "anita-wiratama",
    name: "Anita Wiratama, S.T., M.T.",
    role: "Head of Cloud Infrastructure & DevOps",
    department: "Cloud & Reliability Engineering",
    avatarPlaceholder: "AW",
    tagline: "Menjamin ketersediaan 99.999% dan automasi infrastruktur tanpa kompromi.",
    bio: "Spesialis Cloud Native dan Site Reliability Engineering dengan rekam jejak mengelola ribuan node Kubernetes berkapasitas jutaan request per detik. Ahli dalam implementasi Infrastructure as Code (IaC), GitOps, dan strategi mitigasi bencana multi-cloud.",
    yearsOfExp: 10,
    featuredProjectsCount: 34,
    skills: [
      { category: "Cloud & Orchestration", items: ["Kubernetes (EKS/GKE)", "Terraform", "AWS", "Google Cloud", "Azure"] },
      { category: "CI/CD & GitOps", items: ["ArgoCD", "GitHub Actions", "Canary Deployment", "Helm", "Vault"] },
      { category: "Observability & SRE", items: ["Prometheus", "Grafana", "OpenTelemetry", "Chaos Engineering", "FinOps"] },
    ],
    certifications: [
      "Certified Kubernetes Administrator (CKA)",
      "Certified Kubernetes Security Specialist (CKS)",
      "AWS Certified DevOps Engineer – Professional",
      "HashiCorp Certified Terraform Associate",
    ],
    projects: [
      {
        name: "Modernisasi Multi-Region EKS Logistik Nusantara",
        role: "Lead Cloud Architect",
        impact: "Mengurangi biaya pengeluaran server sebesar 38% dan mencapai uptime 99.998%.",
        tech: ["AWS EKS", "Terraform", "ArgoCD", "Prometheus"],
      },
      {
        name: "Zero-Downtime Migration Core Banking",
        role: "Principal DevOps Engineer",
        impact: "Migrasi 400 microservices tanpa adanya service interruption pada pengguna.",
        tech: ["Kubernetes", "Istio Service Mesh", "Vault", "Docker"],
      },
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "anita@intelecta.id",
    },
  },
  {
    slug: "fauzan-pratama",
    name: "Fauzan Pratama, S.Kom., CISSP",
    role: "Head of Cybersecurity & Defensive Strategy",
    department: "Cybersecurity & Governance",
    avatarPlaceholder: "FP",
    tagline: "Membangun benteng pertahanan digital Zero Trust lapis baja untuk aset nasional.",
    bio: "Pakar keamanan siber bersertifikasi CISSP dan CEH dengan pengalaman lebih dari 9 tahun menangani insiden keamanan kritis dan perancangan arsitektur Zero Trust. Kerap dipercaya sebagai konsultan audit kepatuhan keamanan data sektor keuangan dan institusi publik.",
    yearsOfExp: 9,
    featuredProjectsCount: 22,
    skills: [
      { category: "Defensive Security", items: ["Zero Trust (ZTNA)", "SOC & SIEM", "Wazuh", "Threat Hunting", "EDR"] },
      { category: "Offensive Testing", items: ["Penetration Testing", "Vulnerability Assessment", "Red Teaming", "Web App Security"] },
      { category: "Compliance & Audit", items: ["ISO 27001", "SOC 2 Type II", "UU Perlindungan Data Pribadi (PDP)", "PCI-DSS"] },
    ],
    certifications: [
      "Certified Information Systems Security Professional (CISSP)",
      "Offensive Security Certified Professional (OSCP)",
      "Certified Ethical Hacker (CEH Master)",
    ],
    projects: [
      {
        name: "Transformasi Zero Trust Telekomunikasi Nasional",
        role: "Principal Security Consultant",
        impact: "Mengamankan 45.000 titik akses endpoint dan meraih predikat audit keamanan Grade A+.",
        tech: ["Cloudflare One", "Vault", "Wazuh", "WireGuard"],
      },
      {
        name: "Automated Threat Hunting Platform",
        role: "Security Architect",
        impact: "Mempercepat waktu mitigasi insiden anomali jaringan siber hingga 85%.",
        tech: ["SIEM", "Elasticsearch", "Suricata", "Python"],
      },
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "fauzan@intelecta.id",
    },
  },
  {
    slug: "dimas-adityawarman",
    name: "Dimas Adityawarman, S.Sn.",
    role: "Principal Creative Technologist & Frontend Architect",
    department: "Experience Engineering",
    avatarPlaceholder: "DA",
    tagline: "Menjembatani estetika visual kelas dunia dengan performa interaktif tanpa jeda.",
    bio: "Creative Technologist pemenang penghargaan digital yang menggabungkan keahlian desain interaksi futuristik dengan kode frontend performa tinggi. Berfokus pada Next.js, WebGL/Three.js, dan animasi mikro responsif.",
    yearsOfExp: 8,
    featuredProjectsCount: 40,
    skills: [
      { category: "Creative Development", items: ["Three.js", "React Three Fiber", "GLSL Shaders", "GSAP ScrollTrigger", "Framer Motion"] },
      { category: "Frontend Core", items: ["Next.js 15", "TypeScript", "Tailwind CSS", "Lenis Scroll", "Web Vitals Optimization"] },
      { category: "Design Systems", items: ["Figma to Code", "Micro-Interactions", "Fluid Typography", "Dark Mode UI"] },
    ],
    certifications: [
      "Awwwards Site of the Day Nominee & Winner",
      "FWA of the Day Judge's Choice",
      "Google Web Performance Specialist",
    ],
    projects: [
      {
        name: "Intelecta Corporate Web Showcase",
        role: "Lead Creative Developer",
        impact: "Menciptakan pengalaman web dark-mode interaktif dengan 3D crystal refraction dan skor Lighthouse 98.",
        tech: ["Next.js 15", "React Three Fiber", "Tailwind CSS", "GSAP"],
      },
      {
        name: "Interactive Data Visualization Portal Medika",
        role: "Frontend Architect",
        impact: "Visualisasi 10 juta catatan medis dalam 60fps canvas realtime rendering.",
        tech: ["React", "Three.js", "WebGL", "TypeScript"],
      },
    ],
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "dimas@intelecta.id",
    },
  },
];
