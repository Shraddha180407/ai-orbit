export type DeviceData = {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  manufacturerSlug: string;
  category: string;
  availability: "Available" | "Pre-order" | "Announced" | "Discontinued";
  price: string | null;
  year: string;
  month?: string;
  description: string;
  imageUrl: string;
  images?: string[];
  manufacturerLogoUrl: string;
  mainTask: string;
  mainTaskColor: string;
  formFactor: string | null;
  country: string | null;
  ram: string | null;
  aiFeatures: string[];
  primaryUseCases: string[];
  additionalInfo: string | null;
  buyUrl: string | null;
};

export const DEVICES_DATA: DeviceData[] = [
  {
    id: "cmrkw7rs500745ov3rrpadrat",
    slug: "rabbit-r1",
    name: "Rabbit r1",
    manufacturer: "Rabbit Inc.",
    manufacturerSlug: "rabbit-inc",
    category: "AI Pocket Assistant",
    availability: "Available",
    price: "$199.00",
    year: "2024",
    month: "Jan, 2024",
    description: "A pocket companion device utilizing a Large Action Model (LAM) designed to execute online app actions on your behalf.",
    imageUrl: "https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&q=80",
    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=rabbit.tech",
    mainTask: "Assistant",
    mainTaskColor: "#6E56CF",
    formFactor: "Handheld",
    country: "US",
    ram: "4 GB",
    aiFeatures: ["Large Action Model", "Voice Input", "App Control", "On-device AI"],
    primaryUseCases: ["Productivity", "Automation", "Assistant"],
    additionalInfo: "The Rabbit r1 runs on a Large Action Model (LAM) that can learn how to operate apps on behalf of users. It features a 2.88-inch touchscreen, a 360-degree rotating camera, and a push-to-talk button. The device connects to the cloud to process requests.",
    buyUrl: "https://www.rabbit.tech/rabbit-r1",
  },
  {
    id: "cmrkw7rs500755ov373gur8ua",
    slug: "humane-ai-pin",
    name: "Humane AI Pin",
    manufacturer: "Humane",
    manufacturerSlug: "humane",
    category: "Wearable Projector Pin",
    availability: "Discontinued",
    price: "$699.00",
    year: "2024",
    month: "Apr, 2024",
    description: "A wearable pin that projects digital interface layouts onto the palm of your hand, featuring voice and gesture inputs.",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=humane.com",
    mainTask: "Wearable",
    mainTaskColor: "#E85D4A",
    formFactor: "Wearable Pin",
    country: "US",
    ram: null,
    aiFeatures: ["Voice Assistant", "Gesture Control", "Laser Projection", "On-device AI"],
    primaryUseCases: ["Communication", "Productivity", "Hands-free"],
    additionalInfo: "The Humane AI Pin is a standalone wearable device that clips onto clothing. It uses a laser ink display to project information onto the user's hand. The device runs on its own operating system called Cosmos and includes a Snapdragon processor.",
    buyUrl: null,
  },
  {
    id: "mock-meta-ray-ban",
    slug: "meta-ray-ban-smart-glasses",
    name: "Meta Ray-Ban Smart Glasses",
    manufacturer: "Meta",
    manufacturerSlug: "meta",
    category: "Smart Glasses",
    availability: "Available",
    price: "$299.00",
    year: "2024",
    month: "Sep, 2024",
    description: "AI-powered smart glasses with built-in camera, open-ear speakers, and Meta AI assistant for hands-free interaction.",
    imageUrl: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",

    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=meta.com",
    mainTask: "Wearable",
    mainTaskColor: "#0082FB",
    formFactor: "Eyewear",
    country: "US",
    ram: null,
    aiFeatures: ["Meta AI", "Voice Assistant", "Camera", "Live Translation"],
    primaryUseCases: ["Photography", "Communication", "Navigation"],
    additionalInfo: "The Ray-Ban Meta Smart Glasses feature a 12MP camera, five-microphone array, and open-ear speakers. They connect to the Meta AI assistant for real-time help. The 2024 edition added a live AI view feature that can identify objects and answer questions about what you're seeing.",
    buyUrl: "https://www.meta.com/smart-glasses/",
  },
  {
    id: "mock-apple-vision-pro",
    slug: "apple-vision-pro",
    name: "Apple Vision Pro",
    manufacturer: "Apple",
    manufacturerSlug: "apple",
    category: "Mixed Reality Headset",
    availability: "Available",
    price: "$3,499.00",
    year: "2024",
    month: "Feb, 2024",
    description: "Spatial computing device that blends digital content with the physical world using eye, hand, and voice inputs.",
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh0M-xMVNKOim3tbWKFD18A7LnR-TakTjNAMuZUea7aHi59t-n2Dl8SJ61C8h6zRc8H00_GUybGptIJaojH21cwmYOsvgOaEzi5fAlprcAWNqsSgM5vkWMzAIlMPkU33rd6mbF3sC_dDKZOgTNoGk029rLE9row-adJmAVVKaxNWI9QdzLbvWSSTcUsSPd5/s1629/appple%202.PNG",

    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=apple.com",
    mainTask: "Computing",
    mainTaskColor: "#555555",
    formFactor: "Headset",
    country: "US",
    ram: "16 GB",
    aiFeatures: ["Eye Tracking", "Hand Tracking", "Voice Control", "Spatial Audio", "On-device AI"],
    primaryUseCases: ["Productivity", "Entertainment", "3D Design", "Collaboration"],
    additionalInfo: "Apple Vision Pro features dual micro-OLED displays with 23 million pixels combined. Powered by M2 and R1 chips working in tandem. The R1 chip processes sensor input in 12ms for a seamless mixed reality experience.",
    buyUrl: "https://www.apple.com/apple-vision-pro/",
  },
  {
    id: "mock-google-home-speaker",
    slug: "google-home-speaker",
    name: "Google Home Speaker",
    manufacturer: "Google",
    manufacturerSlug: "google",
    category: "Smart Speaker",
    availability: "Available",
    price: "$99.00",
    year: "2024",
    month: "Jun, 2024",
    description: "Smart home speaker powered by Google Assistant with multi-room audio and smart home control capabilities.",
    imageUrl: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&q=80",

    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=google.com",
    mainTask: "Smart Home",
    mainTaskColor: "#34A853",
    formFactor: "Tabletop",
    country: "US",
    ram: null,
    aiFeatures: ["Google Assistant", "Voice Control", "Smart Home Integration", "Multi-room Audio"],
    primaryUseCases: ["Smart Home", "Music", "Information"],
    additionalInfo: "Google Home Speaker features a 360-degree sound with a high-excursion speaker and two passive radiators. It supports Google Assistant for voice commands and can control thousands of smart home devices.",
    buyUrl: "https://store.google.com/product/google_home",
  },
  {
    id: "mock-oura-ring",
    slug: "oura-ring-4",
    name: "Oura Ring 4",
    manufacturer: "Oura",
    manufacturerSlug: "oura",
    category: "AI Wearable",
    availability: "Available",
    price: "$349.00",
    year: "2024",
    month: "Oct, 2024",
    description: "AI-powered smart ring that continuously monitors health biomarkers, estimates biological age, tracks recovery and longevity metrics.",
    imageUrl: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&q=80",

    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=ouraring.com",
    mainTask: "Health",
    mainTaskColor: "#E85D4A",
    formFactor: "Ring",
    country: "FI",
    ram: null,
    aiFeatures: ["Health Monitoring", "Sleep Tracking", "AI Insights", "Longevity Metrics"],
    primaryUseCases: ["Health", "Sleep", "Fitness", "Recovery"],
    additionalInfo: "Oura Ring 4 features 18 sensors including infrared PPG sensors, an NTC temperature sensor, and a 3D accelerometer. Battery life up to 8 days. The new generation adds improved accuracy and a titanium shell.",
    buyUrl: "https://ouraring.com/product/rings",
  },
  {
    id: "mock-amazon-echo",
    slug: "amazon-echo-show-10",
    name: "Amazon Echo Show 10",
    manufacturer: "Amazon",
    manufacturerSlug: "amazon",
    category: "Smart Display",
    availability: "Available",
    price: "$249.00",
    year: "2023",
    month: "Nov, 2023",
    description: "Smart display with a motorized base that automatically moves to keep you in frame during video calls.",
    imageUrl: "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=400&q=80",

    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=amazon.com",
    mainTask: "Smart Home",
    mainTaskColor: "#FF9900",
    formFactor: "Tabletop Display",
    country: "US",
    ram: null,
    aiFeatures: ["Alexa AI", "Motion Tracking", "Voice Control", "Smart Home Hub"],
    primaryUseCases: ["Smart Home", "Video Calls", "Entertainment", "Cooking"],
    additionalInfo: "The Echo Show 10 features a 10.1-inch HD display with adaptive color and a 13MP camera. The motorized base rotates 350 degrees to follow you around the room during video calls.",
    buyUrl: "https://www.amazon.com/echo-show-10",
  },
  {
    id: "mock-samsung-galaxy-ring",
    slug: "samsung-galaxy-ring",
    name: "Samsung Galaxy Ring",
    manufacturer: "Samsung",
    manufacturerSlug: "samsung",
    category: "AI Wearable",
    availability: "Available",
    price: "$399.00",
    year: "2024",
    month: "Jul, 2024",
    description: "Lightweight titanium smart ring with AI-powered health tracking, sleep analysis, and Samsung Health integration.",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",

    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=samsung.com",
    mainTask: "Health",
    mainTaskColor: "#1428A0",
    formFactor: "Ring",
    country: "KR",
    ram: null,
    aiFeatures: ["AI Health Insights", "Sleep Tracking", "Heart Rate Monitor", "Energy Score"],
    primaryUseCases: ["Health", "Sleep", "Fitness"],
    additionalInfo: "Samsung Galaxy Ring is made from titanium and weighs between 2.3g and 3g depending on size. No subscription required unlike competitors. Battery life up to 7 days.",
    buyUrl: "https://www.samsung.com/global/galaxy/galaxy-ring/",
  },
  {
    id: "mock-msi-edgexpert",
    slug: "msi-edgexpert",
    name: "MSI EdgeXpert",
    manufacturer: "MSI",
    manufacturerSlug: "msi",
    category: "Other",
    availability: "Available",
    price: "$311.00",
    year: "2026",
    month: "2026",
    description: "A compact AI supercomputer based on the NVIDIA DGX Spark GB10 platform, designed for local AI development, inference, and enterprise AI workloads.",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",

    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=msi.com",
    mainTask: "AI Edge",
    mainTaskColor: "#E85D4A",
    formFactor: "Tabletop",
    country: "TW",
    ram: "128 GB LPDDR5x",
    aiFeatures: ["On-device AI", "Cloud AI", "Voice Assistant"],
    primaryUseCases: ["Productivity", "Education"],
    additionalInfo: "Up to 1,000 AI TOPS (FP4); NVIDIA NVLink-C2C CPU-GPU memory interconnect; full-stack AI development platform; designed for local LLM inference and AI agents; supports secure on-premises deployment.",
    buyUrl: null,
  },
  {
    id: "mock-mentra-live",
    slug: "mentra-live",
    name: "Mentra Live",
    manufacturer: "Mentra",
    manufacturerSlug: "mentra",
    category: "Smart Glasses",
    availability: "Available",
    price: "$349.00",
    year: "2024",
    month: "Jun, 2024",
    description: "AI-powered smart glasses with always-on display, camera, and personalized AI assistant for hands-free productivity.",
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&q=80",

    manufacturerLogoUrl: "https://www.google.com/s2/favicons?sz=64&domain=mentra.glass",
    mainTask: "Wearable",
    mainTaskColor: "#6E56CF",
    formFactor: "Eyewear",
    country: "US",
    ram: null,
    aiFeatures: ["Always-on Display", "AI Assistant", "Camera", "Voice Control"],
    primaryUseCases: ["Productivity", "Navigation", "Communication"],
    additionalInfo: "Mentra Live features a 640x400 resolution display visible in daylight. Connects to smartphone via Bluetooth. Supports third-party app integrations through the Mentra SDK.",
    buyUrl: "https://mentra.glass",
  },
];

export function getDeviceBySlug(slug: string): DeviceData | null {
  return DEVICES_DATA.find((d) => d.slug === slug || d.id === slug) || null;
}

export function getSimilarDevices(device: DeviceData, count = 4): DeviceData[] {
  return DEVICES_DATA.filter(
    (d) => d.id !== device.id && d.category === device.category
  ).slice(0, count).length > 0
    ? DEVICES_DATA.filter((d) => d.id !== device.id && d.category === device.category).slice(0, count)
    : DEVICES_DATA.filter((d) => d.id !== device.id).slice(0, count);
}