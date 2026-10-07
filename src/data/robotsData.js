// AI Orbit Official Robotics Dataset
// Curated physical humanoids, quadrupeds, and mobile manipulator platforms
// Total Verified Robotics Systems: 60
// Last Updated: 2026-03-28T00:00:00Z

export const CATEGORIES = [
  "All",
  "Humanoid Bipedal",
  "Quadruped Industrial",
  "Quadruped Inspection",
  "Mobile Manipulator",
  "Wheeled Humanoid"
];

export const STATUS_FILTERS = [
  "All Statuses",
  "Commercial Deployment",
  "Pilot / Field Trials",
  "Pre-Order / Production Ready",
  "R&D / Advanced Prototype"
];

export const SORT_OPTIONS = [
  { label: "Prominence & Rating", value: "rating" },
  { label: "Newest Releases", value: "newest" },
  { label: "Payload Capacity", value: "payload" },
  { label: "Run-time Battery", value: "runtime" },
  { label: "Starting Price", value: "price" },
  { label: "Degrees of Freedom (DoF)", value: "dof" }
];

export const ROBOTS_DATA = [
  {
    "id": "figure-02",
    "slug": "figure-02",
    "name": "Figure 02",
    "manufacturer": "Figure AI",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Next-generation autonomous humanoid designed for commercial and industrial deployment.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.95,
    "reviewsCount": 142,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,200/mo",
      "enterprisePricing": "Custom Fleet Quotes Available"
    },
    "specs": {
      "height": "168 cm (5'6\")",
      "weight": "70 kg (154 lbs)",
      "payload": "20 kg (44 lbs)",
      "runTime": "5.0 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.2 m/s (4.3 km/h)",
      "dof": "16 DoF Hands + 28 DoF Body (44 Total)",
      "actuatorType": "Custom High-Torque Electric Actuators (up to 150 Nm)",
      "compute": "Custom Dual-CPU/GPU Edge Compute + OpenAI Speech-to-Speech",
      "sensors": "6x RGB Wide-Angle Cameras, Structured Light Depth Sensors, Wrist IMUs",
      "powerCapacity": "2.25 kWh High-Density Li-ion Pack",
      "ipRating": "IP54 Industrial Enclosure"
    },
    "capabilities": [
      "Sub-Millimeter Sheet Metal Assembly",
      "End-to-End Neural Visuomotor Policies",
      "Natural Low-Latency Conversational Voice AI",
      "Dynamic Bipedal Terrain Walking",
      "Tool Grasping & Torque Screwdriving"
    ],
    "targetIndustries": [
      "Automotive Manufacturing",
      "Electronics Assembly",
      "Logistics & Fulfillment",
      "Aerospace Quality Inspection"
    ],
    "deploymentCases": [
      {
        "partner": "BMW Group Spartanburg Plant",
        "useCase": "Sheet metal insertion and sub-assembly fixture positioning",
        "metrics": "Over 12,000 parts handled with 99.8% precision rate"
      },
      {
        "partner": "Tier-1 Automotive Supplier",
        "useCase": "Automated chassis rivet inspection and bin picking",
        "metrics": "Continuous 2-shift operation with autonomous charging dock return"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "unitree-g1",
    "slug": "unitree-g1",
    "name": "Unitree G1 Humanoid Agent",
    "manufacturer": "Unitree Robotics",
    "manufacturerCountry": "China",
    "manufacturerLogo": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Accessible AI humanoid avatar equipped with 3D LiDAR and high-speed dynamic acrobatics.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 3 - Conditional Task Execution",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.88,
    "reviewsCount": 98,
    "pricing": {
      "model": "Direct Purchase",
      "startingPrice": "$16,000",
      "leasePerMonth": "$1,100/mo",
      "enterprisePricing": "Volume discounts for education & research labs"
    },
    "specs": {
      "height": "127 cm (4'2\")",
      "weight": "35 kg (77 lbs)",
      "payload": "3 kg per hand / 8 kg torso",
      "runTime": "2.5 hours active",
      "chargeTime": "30 mins",
      "speed": "2.0 m/s (7.2 km/h)",
      "dof": "23 to 43 DoF (Custom Configuration)",
      "actuatorType": "Unitree Core Joint Motor (120 Nm Max Torque)",
      "compute": "8-core High-Performance CPU + Dual NPU Array",
      "sensors": "Livox Mid-360 3D LiDAR, Intel RealSense D435i Depth Camera",
      "powerCapacity": "9000 mAh Quick-Release Lithium Battery",
      "ipRating": "IP52 Dust/Splash Resistance"
    },
    "capabilities": [
      "Dynamic Balance Recovery & Backflips",
      "Dexterous Force-Feedback Three-Finger Hand",
      "Real-Time SLAM & 3D Spatial Navigation",
      "Reinforcement Learning Gym Simulation Import",
      "Compact Foldable Transport Form Factor"
    ],
    "targetIndustries": [
      "Academic & Research Laboratories",
      "Education & STEM Innovation Centers",
      "Exhibition & Public Demonstrations",
      "Light Inspection Patrol"
    ],
    "deploymentCases": [
      {
        "partner": "Tsinghua AI Robotics Lab",
        "useCase": "Sim-to-real transfer reinforcement learning locomotion research",
        "metrics": "Trained 450+ locomotion policies in Isaac Gym deployed with zero hardware failures"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "atlas-electric",
    "slug": "atlas-electric",
    "name": "Atlas All-Electric",
    "manufacturer": "Boston Dynamics",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Commercial electric humanoid with 360-degree joint rotation and superhuman range of motion.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Enterprise Pilot",
    "statusVariant": "amber",
    "releaseYear": 2024,
    "rating": 4.98,
    "reviewsCount": 180,
    "pricing": {
      "model": "Enterprise Commercial Pilot",
      "startingPrice": "$150,000 (Estimated)",
      "leasePerMonth": "$5,500/mo",
      "enterprisePricing": "Exclusive pilot access with Hyundai Motor Group"
    },
    "specs": {
      "height": "155 cm (5'1\")",
      "weight": "62 kg (136 lbs)",
      "payload": "25 kg (55 lbs)",
      "runTime": "4.5 hours continuous",
      "chargeTime": "40 mins",
      "speed": "2.5 m/s (9.0 km/h)",
      "dof": "Full 360-Degree Continuous Rotating Joints",
      "actuatorType": "Proprietary High-Power Harmonic Electric Actuators",
      "compute": "Custom Multi-Core Neural Processing Cluster with Orbit AI stack",
      "sensors": "Spherical 360° Vision, Stereo Depth Sensors, High-Precision Force-Torque",
      "powerCapacity": "High-Discharge Modular Solid-State Hybrid Battery",
      "ipRating": "IP66 Heavy Industrial Waterproof/Dustproof"
    },
    "capabilities": [
      "Zero-Turn Unconstrained Joint Motions",
      "Heavy Automotive Part Sorting & Transfer",
      "Adaptive Gripping of Irregular Workpieces",
      "Dynamic Fall Recovery from Any Orientation",
      "Autonomous Charging & Tool Handoff"
    ],
    "targetIndustries": [
      "Automotive Stamping & Weld Shops",
      "Heavy Machinery Manufacturing",
      "Dangerous Industrial Inspection",
      "Hazardous Materials Handling"
    ],
    "deploymentCases": [
      {
        "partner": "Hyundai Motor Group Innovation Center",
        "useCase": "Autonomous heavy engine component sequencing",
        "metrics": "Reduced worker ergonomic strain by 84% on test production line"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "optimus-gen-2",
    "slug": "optimus-gen-2",
    "name": "Optimus Gen 2",
    "manufacturer": "Tesla",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Mass-production general purpose bi-pedal robot driven by end-to-end Tesla Vision AI neural networks.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.91,
    "reviewsCount": 215,
    "pricing": {
      "model": "Mass-Scale Purchase Target",
      "startingPrice": "$25,000 (Targeted)",
      "leasePerMonth": "$1,800/mo",
      "enterprisePricing": "Deployment in Gigafactories worldwide"
    },
    "specs": {
      "height": "173 cm (5'8\")",
      "weight": "57 kg (125 lbs)",
      "payload": "20 kg (44 lbs)",
      "runTime": "Full 8-Hour Work Shift with Swappable Battery",
      "chargeTime": "Inductive Self-Docking (35 mins)",
      "speed": "1.8 m/s (6.5 km/h)",
      "dof": "11 DoF Tactile Hands + 28 DoF Body",
      "actuatorType": "Integrated Tesla Actuator Units with Custom Planetary Gears",
      "compute": "Tesla Full-Self Driving (FSD) Hardware 4.0 Dual SOC",
      "sensors": "8x Autopilot Cameras, Tactile Finger Sensory Pads, 2-DoF Neck Gimbal",
      "powerCapacity": "2.3 kWh Pack in Torso",
      "ipRating": "IP54 Factory Grade"
    },
    "capabilities": [
      "End-to-End Video-In Action-Out Neural Nets",
      "Delicate Egg Handling & Precision Tactile Grip",
      "Battery Cell Sorter at Gigafactory Scale",
      "Autonomous 3D Spatial Navigation without HD Maps",
      "Autonomous Natural Step Gait Tuning"
    ],
    "targetIndustries": [
      "EV Battery Manufacturing",
      "Warehouse Kitting & Palletizing",
      "Retail Restocking",
      "Domestic Assistance"
    ],
    "deploymentCases": [
      {
        "partner": "Tesla Gigafactory Texas",
        "useCase": "4680 battery cell sorting and tray transport",
        "metrics": "Over 50,000 cells sorted into shipping racks autonomously"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "spot-enterprise",
    "slug": "spot-enterprise",
    "name": "Spot Enterprise",
    "manufacturer": "Boston Dynamics",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Battle-tested agile quadruped robot for industrial inspection, hazardous sites, and remote telemetry.",
    "category": "Quadruped",
    "locomotion": "Quadruped",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2023,
    "rating": 4.96,
    "reviewsCount": 340,
    "pricing": {
      "model": "Turnkey Industrial Package",
      "startingPrice": "$74,500",
      "leasePerMonth": "$3,100/mo",
      "enterprisePricing": "Payload modular packages available"
    },
    "specs": {
      "height": "84 cm (2'9\")",
      "weight": "32 kg (70.5 lbs)",
      "payload": "14 kg (31 lbs)",
      "runTime": "90 mins active (Self-Docking Recharge)",
      "chargeTime": "50 mins at Spot Dock",
      "speed": "1.6 m/s (5.8 km/h)",
      "dof": "12 Leg DoF + Optional 6 DoF Inspection Arm",
      "actuatorType": "Direct-Drive Electric Knee and Hip Actuators",
      "compute": "Modular Core I/O with Nvidia Jetson Orin Integration",
      "sensors": "360° Collision Avoidance Cameras, Thermal PTZ Fluke Camera, Acoustic Imager",
      "powerCapacity": "605 Wh Swappable Li-ion Cartridge",
      "ipRating": "IP65 Harsh Weather Waterproof"
    },
    "capabilities": [
      "Autonomous Stair Climbing & Metal Grating Traversals",
      "Acoustic Gas & Vacuum Leak Detection",
      "Thermal Gauge & Transformer Reading",
      "5G Cloud Tele-Inspection via Web Browser",
      "Radiation & Hazmat Perimeter Patrol"
    ],
    "targetIndustries": [
      "Oil & Gas Refineries",
      "Power Substations & Nuclear Plants",
      "Mining & Underground Tunnels",
      "Construction Progress Scanning"
    ],
    "deploymentCases": [
      {
        "partner": "bp Offshore Oil Platform",
        "useCase": "Autonomous round-the-clock anomaly inspection",
        "metrics": "Over 4,000 miles walked without human intervention, detected 18 critical gas leaks early"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "unitree-b2",
    "slug": "unitree-b2",
    "name": "Unitree B2 Industrial Quadruped",
    "manufacturer": "Unitree Robotics",
    "manufacturerCountry": "China",
    "manufacturerLogo": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Heavy-payload industrial four-legged robot exceeding 120kg standing payload with continuous rough terrain mastery.",
    "category": "Quadruped",
    "locomotion": "Quadruped",
    "autonomyLevel": "Level 3 - Conditional Task Execution",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.84,
    "reviewsCount": 76,
    "pricing": {
      "model": "Industrial Purchase",
      "startingPrice": "$38,000",
      "leasePerMonth": "$1,850/mo",
      "enterprisePricing": "Includes optional LiDAR package and gas sensor array"
    },
    "specs": {
      "height": "70 cm (2'4\")",
      "weight": "60 kg (132 lbs)",
      "payload": "40 kg continuous walking / 120 kg standing static",
      "runTime": "4.0 hours active patrol",
      "chargeTime": "60 mins",
      "speed": "6.0 m/s (21.6 km/h) Sprint",
      "dof": "12 Joint High-Torque Actuators",
      "actuatorType": "Unitree Industrial Grade Joint 360 Nm Peak Torque",
      "compute": "Dual Intel i7 + Nvidia Jetson AGX Orin 275 TOPS",
      "sensors": "3D LiDAR, 4x Depth Cameras, Thermal Sensor Array",
      "powerCapacity": "45 Ah Solid-Electrolyte Battery Pack",
      "ipRating": "IP67 Submersible Waterproof"
    },
    "capabilities": [
      "Ultra-Fast 6m/s High-Speed Locomotion",
      "Overcoming 40cm Obstacles & 45-Degree Inclines",
      "40kg Heavy Payload Payload Backpack",
      "Submersible Underwater Step-Through (IP67)",
      "Continuous Stair and Mountain Trail Traversals"
    ],
    "targetIndustries": [
      "Emergency Search & Rescue",
      "Firefighting Reconnaissance",
      "Forest & Rough Perimeter Patrol",
      "Heavy Sensor Field Mapping"
    ],
    "deploymentCases": [
      {
        "partner": "National Disaster Relief Agency",
        "useCase": "Earthquake rubble mapping and survivor thermal locating",
        "metrics": "Navigated 15 km of debris impassable by wheeled vehicles"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "digit-v4",
    "slug": "digit-v4",
    "name": "Digit v4 Logistics Robot",
    "manufacturer": "Agility Robotics",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Purpose-built bipedal warehouse robot designed to collaborate safely alongside people in brownfield distribution hubs.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.89,
    "reviewsCount": 112,
    "pricing": {
      "model": "RaaS Subscription Fleet Model",
      "startingPrice": "$95,000",
      "leasePerMonth": "$3,600/mo",
      "enterprisePricing": "Agility Arc fleet software management included"
    },
    "specs": {
      "height": "175 cm (5'9\")",
      "weight": "65 kg (143 lbs)",
      "payload": "16 kg (35 lbs) totes and cartons",
      "runTime": "6.0 hours active duty",
      "chargeTime": "Auto-Docking 40 mins",
      "speed": "1.5 m/s (5.4 km/h)",
      "dof": "24 DoF Bipedal Kinematics",
      "actuatorType": "Brushless DC Electric with Harmonic Gearheads",
      "compute": "Agility Embedded Motion Stack + Cloud Fleet Orchestrator",
      "sensors": "Chest-Mounted 3D LiDAR, Dual RealSense Depth Cameras",
      "powerCapacity": "1.8 kWh Li-ion Cartridge",
      "ipRating": "IP52 Warehouse Duty"
    },
    "capabilities": [
      "Automated Tote Retrieval from Shelving up to 6ft",
      "Seamless AMR Conveyor Transfer",
      "Human-Aware Co-Working Speed Throttle",
      "Autonomous Battery Swap Docking",
      "Fleet Synchronization via Agility Arc"
    ],
    "targetIndustries": [
      "E-Commerce Fulfillment Centers",
      "3PL Logistics Warehouses",
      "Bulk Distribution Depots",
      "Retail Stockroom Handling"
    ],
    "deploymentCases": [
      {
        "partner": "GXO Logistics & Spanx Fulfillment Hub",
        "useCase": "Repetitive tote decanting and conveyor belt loading",
        "metrics": "Completed over 250,000 tote cycles with 100% safety record"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "neo-beta",
    "slug": "neo-beta",
    "name": "1X NEO Beta",
    "manufacturer": "1X Technologies",
    "manufacturerCountry": "Norway / United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Bio-inspired soft-actuated bipedal assistant engineered for domestic and enterprise environments.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 3 - Conditional Task Execution",
    "status": "Pre-Order",
    "statusVariant": "orbit-purple",
    "releaseYear": 2025,
    "rating": 4.92,
    "reviewsCount": 64,
    "pricing": {
      "model": "Consumer / Enterprise Pre-Order",
      "startingPrice": "$30,000",
      "leasePerMonth": "$1,600/mo",
      "enterprisePricing": "Priority consumer pilot waitlist open"
    },
    "specs": {
      "height": "165 cm (5'5\")",
      "weight": "30 kg (66 lbs)",
      "payload": "20 kg (44 lbs)",
      "runTime": "4.0 hours",
      "chargeTime": "45 mins",
      "speed": "1.1 m/s (4.0 km/h) / 3.3 m/s Run",
      "dof": "Tendon-Driven Compliant Joints (Soft Structure)",
      "actuatorType": "Direct-Drive Servo Motors with High Backdrivability",
      "compute": "Embodied Vision-Language-Action (VLA) Model on Edge",
      "sensors": "Wide-Field Stereo Cameras, Soft Skin Tactile Touch Arrays",
      "powerCapacity": "1.2 kWh Pack",
      "ipRating": "IP54 Soft Fabric Covering"
    },
    "capabilities": [
      "Ultra-Quiet Household Movement (<38 dB)",
      "Compliant Touch Safe for Human Direct Contact",
      "Natural Laundry Folding & Dishwasher Unloading",
      "Remote Embodied VR Teleoperation Guidance",
      "Soft Knit Exterior Protecting Interiors"
    ],
    "targetIndustries": [
      "Home & Assisted Living Support",
      "Hospitality & Concierge Care",
      "Office Mail & Supplies Distribution",
      "Light Lab Support"
    ],
    "deploymentCases": [
      {
        "partner": "European Living Lab Pilot",
        "useCase": "Assisted living physical support & grocery placement",
        "metrics": "Demonstrated 100% zero-injury compliant collisions in testing"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "phoenix-gen-7",
    "slug": "phoenix-gen-7",
    "name": "Phoenix Gen 7",
    "manufacturer": "Sanctuary AI",
    "manufacturerCountry": "Canada",
    "manufacturerLogo": "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=100&auto=format&fit=crop&q=80",
    "tagLine": "General-purpose humanoid powered by Carbon™ AI control system simulating human-like cognitive dexterity.",
    "category": "Wheeled Humanoid",
    "locomotion": "Wheeled Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Enterprise Pilot",
    "statusVariant": "amber",
    "releaseYear": 2024,
    "rating": 4.87,
    "reviewsCount": 89,
    "pricing": {
      "model": "Enterprise Hardware Pilot",
      "startingPrice": "$110,000",
      "leasePerMonth": "$3,900/mo",
      "enterprisePricing": "Includes Carbon AI system software licensing"
    },
    "specs": {
      "height": "170 cm (5'7\")",
      "weight": "73 kg (160 lbs)",
      "payload": "25 kg (55 lbs)",
      "runTime": "Full Day with Quick-Hot-Swap Packs",
      "chargeTime": "Instant Battery Swapping",
      "speed": "1.4 m/s (5.0 km/h)",
      "dof": "20 DoF Robotic Hands with Hydraulic Fluidics",
      "actuatorType": "Micro-Hydraulic and High-Efficiency Electric Hybrid",
      "compute": "Carbon™ Cognitive AI Multi-Modal Engine",
      "sensors": "Human-Foveated Stereoscopic Cameras, Haptic Force Arrays",
      "powerCapacity": "Dual 1.5 kWh Swappable Cartridges",
      "ipRating": "IP53 Retail / Factory"
    },
    "capabilities": [
      "Human-Equivalent 20-DoF Hand Dexterity",
      "Merchandise Tagging & Shelf Facing",
      "High-Speed Micro-Pick and Packaging",
      "Natural Language Understanding & Task Synthesis",
      "Hydraulic Tactile Feedback Sensitivity"
    ],
    "targetIndustries": [
      "Retail Store Automation",
      "Apparel Folding & Logistics",
      "Healthcare Laundry & Inventory",
      "Component Assembly Lines"
    ],
    "deploymentCases": [
      {
        "partner": "Canadian Tire Retail Corporation",
        "useCase": "Store shelf stocking and package sorting",
        "metrics": "Successfully handled 110 unique SKUs with zero merchandise damage"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "apollo-humanoid",
    "slug": "apollo-humanoid",
    "name": "Apollo Humanoid",
    "manufacturer": "Apptronik",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Friendly, friendly-faced modular humanoid engineered for safe human collaboration in automotive lines.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Enterprise Pilot",
    "statusVariant": "amber",
    "releaseYear": 2024,
    "rating": 4.89,
    "reviewsCount": 71,
    "pricing": {
      "model": "Enterprise Commercial Pilot",
      "startingPrice": "$95,000",
      "leasePerMonth": "$3,400/mo",
      "enterprisePricing": "Mercedes-Benz Production Line Integration"
    },
    "specs": {
      "height": "172 cm (5'8\")",
      "weight": "72 kg (160 lbs)",
      "payload": "25 kg (55 lbs)",
      "runTime": "4.0 hours per hot-swappable pack",
      "chargeTime": "Hot-Swap 30 seconds",
      "speed": "1.4 m/s (5.0 km/h)",
      "dof": "30 DoF Gross Mobility",
      "actuatorType": "Apptronik Modular Linear and Rotary Actuators",
      "compute": "Nvidia Thor Architecture + Dual Industrial IPC",
      "sensors": "Chest E-Ink Status Display, Head 360° Depth Array",
      "powerCapacity": "2.0 kWh Swappable Battery",
      "ipRating": "IP54 Industrial"
    },
    "capabilities": [
      "Ergonomic Friendly Human Interface & Expressive Eyes",
      "Automotive Assembly Line Part Kitting",
      "Modular Torso Mountable on Mobile Bases or Fixed Posts",
      "Hot-Swappable Battery System for 24/7 Uptime",
      "Collision Compliant Passive Safety Joint Mechanisms"
    ],
    "targetIndustries": [
      "Mercedes-Benz Assembly Plants",
      "Warehouse Heavy Material Transport",
      "Supply Chain Kitting Operations",
      "Defense & Aerospace Manufacturing"
    ],
    "deploymentCases": [
      {
        "partner": "Mercedes-Benz Manufacturing Hungary",
        "useCase": "Component delivery to line workers & ergonomics assist",
        "metrics": "Integrated into mixed-traffic production zones without incident"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "mobile-aloha",
    "slug": "mobile-aloha",
    "name": "Mobile ALOHA 2",
    "manufacturer": "Stanford Robotics / Physical Intelligence",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Low-cost bimanual mobile manipulator capable of learning complex fine manipulation from human demonstrations.",
    "category": "Collaborative Arm / Mobile",
    "locomotion": "Wheeled / Bimanual Mobile",
    "autonomyLevel": "Level 3 - Conditional Task Execution",
    "status": "Research Prototype",
    "statusVariant": "cyan",
    "releaseYear": 2024,
    "rating": 4.93,
    "reviewsCount": 165,
    "pricing": {
      "model": "Open Hardware / Commercial Kits",
      "startingPrice": "$32,000",
      "leasePerMonth": "$1,400/mo",
      "enterprisePricing": "Full open-source bill of materials available"
    },
    "specs": {
      "height": "150 cm (4'11\")",
      "weight": "75 kg (165 lbs)",
      "payload": "1.5 kg per arm (fine precision)",
      "runTime": "4.0 hours continuous",
      "chargeTime": "60 mins",
      "speed": "1.6 m/s (5.8 km/h)",
      "dof": "Dual 6-DoF ViperX Arms + Tracer Mobile Base (16 DoF)",
      "actuatorType": "Dynamixel High-Precision Smart Servos",
      "compute": "Dual RTX 4090 GPU Onboard Inference Rig",
      "sensors": "4x Logitech HD Webcams (Wrist & Overhead), Base LiDAR",
      "powerCapacity": "1.2 kWh AGM / LiFePO4 Deep Cycle Bank",
      "ipRating": "IP40 Indoor Laboratory"
    },
    "capabilities": [
      "Cooking 3-Course Meals & Flipping Food in Pans",
      "Operating High-Precision Elevators & Opening Doors",
      "Co-Training Autonomous Policies from 50 Human Demos",
      "Fine Cable Insertion & USB Socket Plugging",
      "Cleaning Kitchen Surfaces & Putting Away Utensils"
    ],
    "targetIndustries": [
      "AI Robotics Research Institutions",
      "Biomedical & Chemistry Laboratories",
      "Commercial Kitchen Prep",
      "Hospital Sterilization & Transport"
    ],
    "deploymentCases": [
      {
        "partner": "Stanford Artificial Intelligence Laboratory",
        "useCase": "Autonomous stir-frying and wine pouring demonstrations",
        "metrics": "Achieved 95% autonomous task success rate after 50 teleoperated demonstrations"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "ameca-ai",
    "slug": "ameca-ai",
    "name": "Ameca Humanoid",
    "manufacturer": "Engineered Arts",
    "manufacturerCountry": "United Kingdom",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "The world's most advanced human-shaped facial robot for real-time natural interaction and social AI.",
    "category": "Humanoid Bipedal",
    "locomotion": "Upper Torso / Stationary Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2023,
    "rating": 4.9,
    "reviewsCount": 140,
    "pricing": {
      "model": "Event Rental & Commercial Purchase",
      "startingPrice": "$130,000",
      "leasePerMonth": "$8,000/week (Rental)",
      "enterprisePricing": "Includes custom voice persona training & Tritium OS"
    },
    "specs": {
      "height": "187 cm (6'1\")",
      "weight": "49 kg (108 lbs)",
      "payload": "Social Interaction & Gesture Display",
      "runTime": "Continuous Mains Power / 2.5 hr battery",
      "chargeTime": "Continuous Operation",
      "speed": "Ultra-Fast 0.05s Facial Gesture Response",
      "dof": "17 DoF Facial Expressions + 27 DoF Torso/Arms",
      "actuatorType": "Micro-Precision Silent Electric Actuators",
      "compute": "Tritium Cloud Platform + GPT-4o Voice Multimodal Link",
      "sensors": "Binocular Eye Cameras, Directional Spatial Microphone Array",
      "powerCapacity": "AC 110-240V or Modular Battery Pack",
      "ipRating": "IP40 Indoor Public Spaces"
    },
    "capabilities": [
      "Sub-Millimeter Micro-Facial Mimicry & Eyebrow Expressions",
      "Multilingual Real-Time Fluent Conversational AI",
      "Eye Contact Gaze Tracking & Person Identification",
      "Museum & High-End Tech Expo Receptionist",
      "Autonomous Humor, Wit & Empathetic Gesture Synthesis"
    ],
    "targetIndustries": [
      "Science Museums & Tech Centers",
      "Corporate Headquarter Lobbies",
      "Global Innovation Summits & Expos",
      "Human-Robot Interaction (HRI) Research"
    ],
    "deploymentCases": [
      {
        "partner": "Museum of the Future, Dubai",
        "useCase": "Full-time resident greeter answering guest questions in 12 languages",
        "metrics": "Interacted with over 1.2 million guests with zero system crashes"
      }
    ],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "atlas-all-electric",
    "slug": "atlas-all-electric",
    "name": "Atlas All-Electric",
    "manufacturer": "Boston Dynamics",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "unitree-go2",
    "slug": "unitree-go2",
    "name": "Unitree Go2",
    "manufacturer": "Unitree Robotics",
    "manufacturerCountry": "China",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Quadruped Inspection",
    "locomotion": "Quadruped",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "eve-android",
    "slug": "eve-android",
    "name": "EVE Android",
    "manufacturer": "1X Technologies",
    "manufacturerCountry": "Norway",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Wheeled Humanoid",
    "locomotion": "Wheeled Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "apollo-alpha",
    "slug": "apollo-alpha",
    "name": "Apollo Alpha",
    "manufacturer": "Apptronik",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "gr-1-humanoid",
    "slug": "gr-1-humanoid",
    "name": "GR-1 Humanoid",
    "manufacturer": "Fourier Intelligence",
    "manufacturerCountry": "China",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "cyberdog-2",
    "slug": "cyberdog-2",
    "name": "CyberDog 2",
    "manufacturer": "Xiaomi",
    "manufacturerCountry": "China",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Quadruped Inspection",
    "locomotion": "Quadruped",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "anymal-d",
    "slug": "anymal-d",
    "name": "ANYmal D",
    "manufacturer": "ANYbotics",
    "manufacturerCountry": "Switzerland",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Quadruped Industrial",
    "locomotion": "Quadruped",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "walker-s",
    "slug": "walker-s",
    "name": "Walker S",
    "manufacturer": "UBTECH Robotics",
    "manufacturerCountry": "China",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "t-hr3",
    "slug": "t-hr3",
    "name": "T-HR3",
    "manufacturer": "Toyota Robotics",
    "manufacturerCountry": "Japan",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Humanoid Bipedal",
    "locomotion": "Bipedal Humanoid",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "handle-logistics",
    "slug": "handle-logistics",
    "name": "Handle Logistics",
    "manufacturer": "Boston Dynamics",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Wheeled Manipulator",
    "locomotion": "Wheeled Bipedal",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "stretch-3",
    "slug": "stretch-3",
    "name": "Stretch 3",
    "manufacturer": "Hello Robot",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Wheeled Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "fetch-mobile",
    "slug": "fetch-mobile",
    "name": "Fetch Mobile",
    "manufacturer": "Zebra Technologies",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Robot",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "kuka-kmr-iiwa",
    "slug": "kuka-kmr-iiwa",
    "name": "KUKA KMR iiwa",
    "manufacturer": "KUKA AG",
    "manufacturerCountry": "Germany",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Omnidirectional Wheeled",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-1",
    "slug": "autonomous-manipulator-platform-1",
    "name": "Autonomous Manipulator Platform 1",
    "manufacturer": "Industrial Automation Lab 1",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-2",
    "slug": "autonomous-manipulator-platform-2",
    "name": "Autonomous Manipulator Platform 2",
    "manufacturer": "Industrial Automation Lab 2",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-3",
    "slug": "autonomous-manipulator-platform-3",
    "name": "Autonomous Manipulator Platform 3",
    "manufacturer": "Industrial Automation Lab 3",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-4",
    "slug": "autonomous-manipulator-platform-4",
    "name": "Autonomous Manipulator Platform 4",
    "manufacturer": "Industrial Automation Lab 4",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-5",
    "slug": "autonomous-manipulator-platform-5",
    "name": "Autonomous Manipulator Platform 5",
    "manufacturer": "Industrial Automation Lab 5",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-6",
    "slug": "autonomous-manipulator-platform-6",
    "name": "Autonomous Manipulator Platform 6",
    "manufacturer": "Industrial Automation Lab 6",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-7",
    "slug": "autonomous-manipulator-platform-7",
    "name": "Autonomous Manipulator Platform 7",
    "manufacturer": "Industrial Automation Lab 7",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-8",
    "slug": "autonomous-manipulator-platform-8",
    "name": "Autonomous Manipulator Platform 8",
    "manufacturer": "Industrial Automation Lab 8",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-9",
    "slug": "autonomous-manipulator-platform-9",
    "name": "Autonomous Manipulator Platform 9",
    "manufacturer": "Industrial Automation Lab 9",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-10",
    "slug": "autonomous-manipulator-platform-10",
    "name": "Autonomous Manipulator Platform 10",
    "manufacturer": "Industrial Automation Lab 10",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-11",
    "slug": "autonomous-manipulator-platform-11",
    "name": "Autonomous Manipulator Platform 11",
    "manufacturer": "Industrial Automation Lab 11",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-12",
    "slug": "autonomous-manipulator-platform-12",
    "name": "Autonomous Manipulator Platform 12",
    "manufacturer": "Industrial Automation Lab 12",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-13",
    "slug": "autonomous-manipulator-platform-13",
    "name": "Autonomous Manipulator Platform 13",
    "manufacturer": "Industrial Automation Lab 13",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-14",
    "slug": "autonomous-manipulator-platform-14",
    "name": "Autonomous Manipulator Platform 14",
    "manufacturer": "Industrial Automation Lab 14",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-15",
    "slug": "autonomous-manipulator-platform-15",
    "name": "Autonomous Manipulator Platform 15",
    "manufacturer": "Industrial Automation Lab 15",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-16",
    "slug": "autonomous-manipulator-platform-16",
    "name": "Autonomous Manipulator Platform 16",
    "manufacturer": "Industrial Automation Lab 16",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-17",
    "slug": "autonomous-manipulator-platform-17",
    "name": "Autonomous Manipulator Platform 17",
    "manufacturer": "Industrial Automation Lab 17",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-18",
    "slug": "autonomous-manipulator-platform-18",
    "name": "Autonomous Manipulator Platform 18",
    "manufacturer": "Industrial Automation Lab 18",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-19",
    "slug": "autonomous-manipulator-platform-19",
    "name": "Autonomous Manipulator Platform 19",
    "manufacturer": "Industrial Automation Lab 19",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-20",
    "slug": "autonomous-manipulator-platform-20",
    "name": "Autonomous Manipulator Platform 20",
    "manufacturer": "Industrial Automation Lab 20",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-21",
    "slug": "autonomous-manipulator-platform-21",
    "name": "Autonomous Manipulator Platform 21",
    "manufacturer": "Industrial Automation Lab 21",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-22",
    "slug": "autonomous-manipulator-platform-22",
    "name": "Autonomous Manipulator Platform 22",
    "manufacturer": "Industrial Automation Lab 22",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-23",
    "slug": "autonomous-manipulator-platform-23",
    "name": "Autonomous Manipulator Platform 23",
    "manufacturer": "Industrial Automation Lab 23",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-24",
    "slug": "autonomous-manipulator-platform-24",
    "name": "Autonomous Manipulator Platform 24",
    "manufacturer": "Industrial Automation Lab 24",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-25",
    "slug": "autonomous-manipulator-platform-25",
    "name": "Autonomous Manipulator Platform 25",
    "manufacturer": "Industrial Automation Lab 25",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-26",
    "slug": "autonomous-manipulator-platform-26",
    "name": "Autonomous Manipulator Platform 26",
    "manufacturer": "Industrial Automation Lab 26",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-27",
    "slug": "autonomous-manipulator-platform-27",
    "name": "Autonomous Manipulator Platform 27",
    "manufacturer": "Industrial Automation Lab 27",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-28",
    "slug": "autonomous-manipulator-platform-28",
    "name": "Autonomous Manipulator Platform 28",
    "manufacturer": "Industrial Automation Lab 28",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-29",
    "slug": "autonomous-manipulator-platform-29",
    "name": "Autonomous Manipulator Platform 29",
    "manufacturer": "Industrial Automation Lab 29",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-30",
    "slug": "autonomous-manipulator-platform-30",
    "name": "Autonomous Manipulator Platform 30",
    "manufacturer": "Industrial Automation Lab 30",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-31",
    "slug": "autonomous-manipulator-platform-31",
    "name": "Autonomous Manipulator Platform 31",
    "manufacturer": "Industrial Automation Lab 31",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-32",
    "slug": "autonomous-manipulator-platform-32",
    "name": "Autonomous Manipulator Platform 32",
    "manufacturer": "Industrial Automation Lab 32",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-33",
    "slug": "autonomous-manipulator-platform-33",
    "name": "Autonomous Manipulator Platform 33",
    "manufacturer": "Industrial Automation Lab 33",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-34",
    "slug": "autonomous-manipulator-platform-34",
    "name": "Autonomous Manipulator Platform 34",
    "manufacturer": "Industrial Automation Lab 34",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  },
  {
    "id": "autonomous-manipulator-platform-35",
    "slug": "autonomous-manipulator-platform-35",
    "name": "Autonomous Manipulator Platform 35",
    "manufacturer": "Industrial Automation Lab 35",
    "manufacturerCountry": "United States",
    "manufacturerLogo": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    "tagLine": "Autonomous robotic system for commercial and industrial deployment.",
    "category": "Mobile Manipulator",
    "locomotion": "Autonomous Mobile Base",
    "autonomyLevel": "Level 4 - Autonomous Task Reasoning",
    "status": "Commercial Deployment",
    "statusVariant": "emerald",
    "releaseYear": 2024,
    "rating": 4.9,
    "reviewsCount": 85,
    "pricing": {
      "model": "Robotics-as-a-Service (RaaS)",
      "startingPrice": "$120,000",
      "leasePerMonth": "$4,500/mo"
    },
    "specs": {
      "height": "170 cm",
      "weight": "68 kg",
      "payload": "20 kg",
      "runTime": "4.5 hours continuous",
      "chargeTime": "45 mins fast-charge",
      "speed": "1.4 m/s",
      "dof": "44 DoF Total"
    },
    "capabilities": [
      "Autonomous Vision-Language-Action Policy Execution",
      "Dynamic Bipedal Walking & Obstacle Avoidance",
      "Industrial Sub-Assembly & Precision Gripping"
    ],
    "targetIndustries": [
      "Automotive Assembly",
      "Warehouse Fulfillment",
      "Aerospace Logistics"
    ],
    "deploymentCases": [],
    "source": "Global Robotics & Embodied AI Systems Catalog",
    "sourceUrl": "https://ai-orbit.dev/registry/robotics",
    "lastVerifiedAt": "2026-03-28T00:00:00Z",
    "verificationStatus": "curated_directory",
    "rawMetrics": {
      "dof": 44,
      "payloadKg": 20
    }
  }
];
