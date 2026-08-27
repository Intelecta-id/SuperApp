export interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  iconName: string;
  features: string[];
  techStack: string[];
  metrics: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "ai-engineering",
    title: "AI & Machine Learning Engineering",
    category: "Intelligent Systems",
    description:
      "Pengembangan model kecerdasan buatan enterprise, fine-tuning LLM privat, agentic workflow automation, dan sistem analitik prediktif berkecepatan tinggi.",
    iconName: "Cpu",
    features: [
      "Custom Enterprise LLM & Retrieval-Augmented Generation (RAG)",
      "Automated Agentic AI Pipeline & Reasoning Systems",
      "Computer Vision & Predictive Maintenance Engine",
      "Model Governance, Safety & Real-Time Monitoring",
    ],
    techStack: ["PyTorch", "LangChain", "vLLM", "Qdrant", "FastAPI"],
    metrics: "Efisiensi Proses Otomasi +340%",
  },
  {
    id: "cloud-devops",
    title: "Cloud Infrastructure & Modern DevOps",
    category: "High Availability",
    description:
      "Arsitektur cloud multi-region berskala global dengan Kubernetes cluster high-availability, Zero-Downtime CI/CD, dan otomatisasi Infrastructure as Code.",
    iconName: "Cloud",
    features: [
      "Multi-Cloud & Hybrid Cloud Orchestration (AWS, GCP, Azure)",
      "High-Resilience Kubernetes Cluster (EKS/GKE)",
      "Automated Zero-Downtime Deployment & Canary Releases",
      "FinOps Cloud Cost Optimization & Deep Observability",
    ],
    techStack: ["Kubernetes", "Terraform", "Docker", "Prometheus", "ArgoCD"],
    metrics: "Uptime SLA 99.995%",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity & Zero Trust Architecture",
    category: "Mission Critical Security",
    description:
      "Proteksi infrastruktur siber komprehensif, implementasi framework Zero Trust, automated threat detection, dan audit kepatuhan keamanan internasional.",
    iconName: "ShieldCheck",
    features: [
      "Zero Trust Network Access (ZTNA) & Identity Governance",
      "Automated Penetration Testing & Vulnerability Assessment",
      "24/7 Security Operations Center (SOC) & SIEM Integration",
      "Audit Kepatuhan ISO 27001, SOC 2, & UU PDP Indonesia",
    ],
    techStack: ["Wazuh", "Vault", "Cloudflare", "OpenVAS", "WireGuard"],
    metrics: "0 Insiden Pelanggaran Keamanan",
  },
  {
    id: "enterprise-software",
    title: "Enterprise Custom Software & Platforms",
    category: "Scalable Architecture",
    description:
      "Pembangunan ekosistem perangkat lunak terdistribusi, API Gateway berkapasitas jutaan request per detik, dan sistem backend mission-critical.",
    iconName: "Layers",
    features: [
      "Event-Driven Microservices Architecture (Kafka/NATS)",
      "Ultra High-Performance Web & Mobile Distributed Apps",
      "Core Banking & Enterprise Resource Planning Integration",
      "Real-Time Data Streaming & Distributed Cache Optimization",
    ],
    techStack: ["Go", "Next.js", "PostgreSQL", "Redis", "Kafka", "TypeScript"],
    metrics: "Latency Respon < 45ms P99",
  },
];
