// server/apiEntry.ts
import express from "express";

// server/routes.ts
import { Router } from "express";
import bcrypt2 from "bcryptjs";

// server/db.ts
import fs from "fs";
import path from "path";

// server/seedData.ts
import bcrypt from "bcryptjs";
var initialCategories = [
  {
    id: "cat-pvc-pipes",
    name: "PVC Pipes",
    slug: "pvc-pipes",
    description: "High-density uPVC, pressure, CPVC, PPR-C, and general plumbing pipes for water conveyance and construction.",
    subcategories: ["Water Supply Pipes", "Pressure Pipes", "Drainage Pipes", "Sewer Pipes", "Conduit Pipes", "PPR-C & Hot Water", "Flexible & Suction Pipes"]
  },
  {
    id: "cat-pipe-fittings",
    name: "Pipe Fittings",
    slug: "pipe-fittings",
    description: "Precision engineered elbows, tees, couplers, reducers, and union fittings for leak-proof pipelines.",
    subcategories: ["Elbows 90\xB0 & 45\xB0", "Equal & Reducing Tees", "Couplers & Sockets", "Reducers", "Unions", "End Caps", "Threaded Adaptors (FTA/MTA)"]
  },
  {
    id: "cat-valves",
    name: "Valves",
    slug: "valves",
    description: "Industrial ball valves, gate valves, check valves, foot valves, and flow control hardware for residential & commercial lines.",
    subcategories: ["Ball Valves", "Gate Valves", "Non-Return Check Valves", "Foot Valves", "Tank Float Valves", "Bibcock Taps"]
  },
  {
    id: "cat-drainage",
    name: "Drainage Systems",
    slug: "drainage",
    description: "Gravity-flow drainage, SWR soil waste solutions, nahani traps, cleanouts, and flexible corrugated channels.",
    subcategories: ["Soil & Waste Pipes", "P-Traps & S-Traps", "Floor Drains & Nahani Traps", "Cleanouts & Plugs", "Flexible Drainage"]
  },
  {
    id: "cat-plumbing",
    name: "Plumbing Supplies",
    slug: "plumbing",
    description: "Solvent cements, sealing tapes, heavy-duty pipe clamps, tools, cutters, and flexible connectors.",
    subcategories: ["Solvent Cement & Adhesives", "Thread Seal Tapes", "Pipe Clamps & Hangers", "Pipe Cutters & Tools", "Flexible Connection Hoses"]
  },
  {
    id: "cat-bulk",
    name: "Bulk Supplies",
    slug: "bulk-orders",
    description: "Contractor packs and bundle supplies for infrastructure, commercial builds, housing schemes, and agricultural piping.",
    subcategories: ["Contractor Bundles", "Agricultural Pipe Lots", "Commercial Fitting Sets"]
  }
];
var initialProducts = [
  // ==========================================
  // 1. PVC WATER & PRESSURE PIPES
  // ==========================================
  {
    id: "prod-pvc-01",
    name: "uPVC Class C Potable Water Supply Pipe",
    slug: "upvc-class-c-potable-water-pipe",
    category: "pvc-pipes",
    subcategory: "Water Supply Pipes",
    sku: "SH-PVC-C01",
    price: 950,
    salePrice: 890,
    stock: 240,
    isNew: true,
    isFeatured: true,
    isSale: true,
    isDemo: true,
    shortDescription: "High-grade unplasticized PVC pipe certified for potable cold-water conveyance with smooth low-friction bore.",
    description: "Engineered for residential and commercial clean water distribution lines. Resistant to chemical corrosion, scaling, and electrolytic decomposition with exceptional flow characteristics. Demonstrates long-term hydrostatic strength under continuous pressure in Multan and Punjab climates.",
    material: "uPVC (Unplasticized Polyvinyl Chloride)",
    diameter: "1 inch (25mm)",
    length: "10 ft (3m)",
    color: "White",
    application: "Cold Potable Water Supply, Building Plumbing",
    pressureRating: "Class C (9.0 Bar / 130 PSI)",
    brand: "Standard Grade",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-01-1", sku: "SH-PVC-C01-10FT", diameter: "1 inch", length: "10 ft", color: "White", price: 890, stock: 120 },
      { id: "v-01-2", sku: "SH-PVC-C01-20FT", diameter: "1 inch", length: "20 ft", color: "White", price: 1750, stock: 65 },
      { id: "v-01-3", sku: "SH-PVC-C02-10FT", diameter: "1.5 inch", length: "10 ft", color: "White", price: 1350, stock: 55 }
    ],
    technicalSpecifications: {
      material: "Rigid uPVC Type 1",
      productType: "Class C Water Distribution Pipe",
      diameter: "1 inch / 25mm to 1.5 inch / 38mm",
      length: "10 ft & 20 ft Standard Sections",
      color: "Signal White",
      application: "Drinking Water Lines, Domestic Plumbing",
      connectionType: "Solvent Cement Socket Welded",
      pressureRating: "9.0 Bar (130 PSI) at 20\xB0C",
      standardCompliance: "PS:3051 / ASTM D1785 Standard Compliant",
      wallThickness: "2.8 mm nominal",
      operatingTemp: "0\xB0C to 50\xB0C"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-pvc-02",
    name: "Schedule 40 High-Pressure uPVC Pipe",
    slug: "schedule-40-high-pressure-upvc-pipe",
    category: "pvc-pipes",
    subcategory: "Pressure Pipes",
    sku: "SH-PRS-SCH40",
    price: 1650,
    stock: 140,
    isNew: false,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Reinforced heavy-wall uPVC pipe designed for pressurized agricultural, industrial, and high-rise riser installations.",
    description: "Heavy gauge industrial pressure pipe manufactured with uniform wall thickness to resist water hammer surges. Ideal for booster pump discharge lines, municipal connections, and industrial water manifolds.",
    material: "High-Density uPVC",
    diameter: "2 inch (50mm)",
    length: "20 ft",
    color: "Industrial Grey",
    application: "Pump Riser Lines, High Pressure Water Systems",
    pressureRating: "Sch 40 (19.3 Bar / 280 PSI)",
    brand: "Heavy Duty Grade",
    images: [
      "https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-02-1", sku: "SH-PRS-SCH40-2IN", diameter: "2 inch", length: "20 ft", color: "Grey", price: 1650, stock: 80 },
      { id: "v-02-2", sku: "SH-PRS-SCH40-3IN", diameter: "3 inch", length: "20 ft", color: "Grey", price: 2950, stock: 40 },
      { id: "v-02-3", sku: "SH-PRS-SCH40-4IN", diameter: "4 inch", length: "20 ft", color: "Grey", price: 4400, stock: 20 }
    ],
    technicalSpecifications: {
      material: "Unplasticized Polyvinyl Chloride Grade A",
      productType: "Schedule 40 Pressure Line",
      diameter: '2", 3", 4"',
      length: "20 ft standard",
      color: "Battleship Grey",
      application: "High-Pressure Risers, Water Booster Mains",
      connectionType: "Heavy Duty Solvent Weld",
      pressureRating: "Schedule 40 (Up to 280 PSI)",
      wallThickness: '3.91 mm nominal (for 2")',
      operatingTemp: "0\xB0C to 55\xB0C"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-pvc-class-b",
    name: "uPVC Class B Light Pressure Potable Water Pipe",
    slug: "upvc-class-b-light-pressure-water-pipe",
    category: "pvc-pipes",
    subcategory: "Water Supply Pipes",
    sku: "SH-PVC-CLS-B",
    price: 680,
    salePrice: 620,
    stock: 310,
    isNew: false,
    isFeatured: false,
    isSale: true,
    isDemo: true,
    shortDescription: "Cost-effective uPVC pipe for gravity-fed domestic distribution and light low-pressure agricultural watering.",
    description: "Lightweight, easy to cut and install. Recommended for low-head overhead tank down-take lines, rural water connections, and general gravity circulation where high pump pressure is not applied.",
    material: "uPVC Standard",
    diameter: "1 inch (25mm)",
    length: "10 ft (3m)",
    color: "White",
    application: "Gravity Water Distribution, Light Agricultural Lines",
    pressureRating: "Class B (6.0 Bar / 87 PSI)",
    brand: "Standard Grade",
    images: [
      "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-clsb-1", sku: "SH-PVC-CLB-10", diameter: "1 inch", length: "10 ft", color: "White", price: 620, stock: 150 },
      { id: "v-clsb-2", sku: "SH-PVC-CLB-15", diameter: "1.5 inch", length: "10 ft", color: "White", price: 890, stock: 90 },
      { id: "v-clsb-3", sku: "SH-PVC-CLB-20", diameter: "2 inch", length: "10 ft", color: "White", price: 1150, stock: 70 }
    ],
    technicalSpecifications: {
      material: "Unplasticized Polyvinyl Chloride",
      productType: "Class B Gravity / Low Pressure Pipe",
      diameter: '1", 1.5", 2"',
      length: "10 ft Standard",
      color: "White",
      pressureRating: "6.0 Bar (87 PSI)",
      wallThickness: "2.0 mm",
      standardCompliance: "BS 3505 Class B"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-pvc-class-d",
    name: "uPVC Class D High-Pressure Main Distribution Pipe",
    slug: "upvc-class-d-high-pressure-pipe",
    category: "pvc-pipes",
    subcategory: "Pressure Pipes",
    sku: "SH-PVC-CLS-D",
    price: 1380,
    stock: 180,
    isNew: true,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Heavy-duty 12-bar rated water distribution pipe engineered for multi-story overhead tank supply lines.",
    description: "Formulated with high-impact uPVC compounds providing safety margins against continuous water hammer and pump on/off shockwaves in commercial buildings, plazas, and factories.",
    material: "High-Density uPVC",
    diameter: "1.25 inch (32mm)",
    length: "10 ft",
    color: "White",
    application: "Commercial Building Supply, Submersible Pump Outlets",
    pressureRating: "Class D (12.0 Bar / 175 PSI)",
    brand: "MasterFlow Pro",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-clsd-1", sku: "SH-PVC-CLD-125", diameter: "1.25 inch", length: "10 ft", color: "White", price: 1380, stock: 90 },
      { id: "v-clsd-2", sku: "SH-PVC-CLD-150", diameter: "1.5 inch", length: "10 ft", color: "White", price: 1750, stock: 50 },
      { id: "v-clsd-3", sku: "SH-PVC-CLD-200", diameter: "2 inch", length: "10 ft", color: "White", price: 2350, stock: 40 }
    ],
    technicalSpecifications: {
      material: "uPVC Heavy Duty Grade D",
      diameter: '1.25", 1.5", 2"',
      pressureRating: "12 Bar (175 PSI)",
      wallThickness: "3.6 mm nominal",
      standardCompliance: "PS:3051 / BS 3505 Class D"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-pvc-sch80",
    name: "Schedule 80 Industrial Extra Heavy-Duty uPVC Pipe",
    slug: "schedule-80-industrial-heavy-duty-pipe",
    category: "pvc-pipes",
    subcategory: "Pressure Pipes",
    sku: "SH-PRS-SCH80",
    price: 3200,
    stock: 65,
    isNew: false,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Thickest wall uPVC pipe engineered for aggressive industrial fluids, chemical treatment, and high vibration pump manifolds.",
    description: "Schedule 80 uPVC features ultra-thick walls capable of handling up to 400 PSI. Unsurpassed resistance to acids, alkalis, salts, and high-pressure industrial fluids without deterioration.",
    material: "Industrial uPVC Type 1 Grade 1",
    diameter: "2 inch (50mm)",
    length: "20 ft",
    color: "Dark Grey",
    application: "Industrial Manifolds, Chemical Drainage, High-Rise Pump Mains",
    pressureRating: "Schedule 80 (27.5 Bar / 400 PSI)",
    brand: "Heavy Duty Grade",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-sch80-1", sku: "SH-PRS-SCH80-2IN", diameter: "2 inch", length: "20 ft", color: "Dark Grey", price: 3200, stock: 35 },
      { id: "v-sch80-2", sku: "SH-PRS-SCH80-3IN", diameter: "3 inch", length: "20 ft", color: "Dark Grey", price: 5400, stock: 20 },
      { id: "v-sch80-3", sku: "SH-PRS-SCH80-4IN", diameter: "4 inch", length: "20 ft", color: "Dark Grey", price: 8200, stock: 10 }
    ],
    technicalSpecifications: {
      material: "Rigid uPVC Type 1 Grade 1",
      standardCompliance: "ASTM D1785 Schedule 80",
      pressureRating: "Up to 400 PSI",
      wallThickness: '5.54 mm (for 2")',
      operatingTemp: "0\xB0C to 60\xB0C"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-pprc-pipe",
    name: "PPR-C Hot & Cold Water Distribution Pipe (PN20)",
    slug: "ppr-c-hot-cold-water-distribution-pipe",
    category: "pvc-pipes",
    subcategory: "PPR-C & Hot Water",
    sku: "SH-PPRC-PN20",
    price: 490,
    stock: 280,
    isNew: true,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Polypropylene Random Copolymer pipe for concealed hot water geyser and cold water sanitary lines with heat-fused joints.",
    description: "The modern standard for concealed bathroom plumbing in Pakistan. Seamless socket fusion ensures homogenous leak-free connections without glue. Resistant to hot boiling water, calcification, and scaling up to 95\xB0C.",
    material: "PPR-C Type 3 (Polypropylene Random Copolymer)",
    diameter: "25mm (3/4 inch)",
    length: "4m (13.1 ft)",
    color: "Green with Red Line",
    application: "Geyser Hot Water Plumbing, Concealed Wall Plumbing",
    pressureRating: "PN20 (20 Bar / 290 PSI)",
    brand: "MasterFlow Pro",
    images: [
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-ppr-20", sku: "SH-PPRC-20MM", diameter: '20mm (1/2")', length: "4m", color: "Green", price: 380, stock: 120 },
      { id: "v-ppr-25", sku: "SH-PPRC-25MM", diameter: '25mm (3/4")', length: "4m", color: "Green", price: 490, stock: 100 },
      { id: "v-ppr-32", sku: "SH-PPRC-32MM", diameter: '32mm (1")', length: "4m", color: "Green", price: 790, stock: 60 }
    ],
    technicalSpecifications: {
      material: "PPR-C (Polypropylene Random Copolymer Type 3)",
      diameter: "20mm, 25mm, 32mm",
      length: "4 meters per pipe",
      pressureRating: "PN20 (20 Bar)",
      standardCompliance: "DIN 8077 / DIN 8078",
      operatingTemp: "-20\xB0C to +95\xB0C"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-cpvc-pipe",
    name: "CPVC High-Temperature Hot Water Supply Pipe (SDR 11)",
    slug: "cpvc-high-temperature-hot-water-pipe",
    category: "pvc-pipes",
    subcategory: "PPR-C & Hot Water",
    sku: "SH-CPVC-SDR11",
    price: 850,
    stock: 160,
    isNew: true,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Chlorinated PVC pipe for solar geysers, boilers, and continuous hot water supply lines up to 93\xB0C.",
    description: "Engineered specifically for pressurized hot water plumbing. CPVC offers higher temperature ratings than standard PVC and does not corrode or pit like metal copper or galvanized pipes.",
    material: "CPVC (Chlorinated Polyvinyl Chloride)",
    diameter: "3/4 inch (20mm)",
    length: "10 ft",
    color: "Cream / Tan",
    application: "Solar Water Heaters, Geysers, Commercial Boilers",
    pressureRating: "SDR 11 (27.6 Bar at 23\xB0C / 6.9 Bar at 82\xB0C)",
    brand: "MasterFlow Pro",
    images: [
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-cpvc-075", sku: "SH-CPVC-075-10", diameter: "3/4 inch", length: "10 ft", color: "Tan", price: 850, stock: 80 },
      { id: "v-cpvc-100", sku: "SH-CPVC-100-10", diameter: "1 inch", length: "10 ft", color: "Tan", price: 1250, stock: 50 }
    ],
    technicalSpecifications: {
      material: "Chlorinated Polyvinyl Chloride (CPVC)",
      standardCompliance: "ASTM D2846 / SDR 11",
      operatingTemp: "Continuous up to 93\xB0C (200\xB0F)",
      connectionType: "CPVC Orange Solvent Cement"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-hdpe-pipe",
    name: "HDPE PE100 Polyethylene High-Pressure Coil Pipe",
    slug: "hdpe-pe100-polyethylene-coil-pipe",
    category: "pvc-pipes",
    subcategory: "Water Supply Pipes",
    sku: "SH-HDPE-PE100",
    price: 180,
    stock: 500,
    isNew: false,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Seamless flexible black polyethylene pipe in continuous coil lengths for underground mains, tubewells, and drip irrigation.",
    description: "Unmatched impact resistance, zero brittle cracking, and immune to corrosive soil chemistry. Shipped in continuous 50m and 100m rolls to minimize underground joints and eliminate leak risks.",
    material: "High-Density Polyethylene (PE100)",
    diameter: "32mm (1 inch)",
    length: "Per Meter (Sold in coils of 50m / 100m)",
    color: "Black with Blue Identification Stripes",
    application: "Underground Tubewell Delivery, Municipal Main Line, Agriculture",
    pressureRating: "PN16 (16 Bar)",
    brand: "Heavy Duty Grade",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-hdpe-25", sku: "SH-HDPE-25MM-M", diameter: '25mm (3/4")', length: "Per Meter", color: "Black/Blue", price: 140, stock: 600 },
      { id: "v-hdpe-32", sku: "SH-HDPE-32MM-M", diameter: '32mm (1")', length: "Per Meter", color: "Black/Blue", price: 180, stock: 500 },
      { id: "v-hdpe-50", sku: "SH-HDPE-50MM-M", diameter: '50mm (1.5")', length: "Per Meter", color: "Black/Blue", price: 340, stock: 300 }
    ],
    technicalSpecifications: {
      material: "Virgin PE100 Grade Resin",
      pressureRating: "PN16 (16 Bar)",
      standardCompliance: "ISO 4427 / DIN 8074",
      flexibility: "High bend radius without kink"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  // ==========================================
  // 2. DRAINAGE, SOIL & SEWER PIPES
  // ==========================================
  {
    id: "prod-pvc-03",
    name: "PVC Soil & Waste Drainage Pipe (Multi-Vent SWR)",
    slug: "pvc-soil-waste-drainage-pipe",
    category: "drainage",
    subcategory: "Soil & Waste Pipes",
    sku: "SH-DRN-110MM",
    price: 1850,
    stock: 95,
    isNew: true,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Smooth-interior lightweight PVC drainage pipe engineered for sanitary waste, gray water, and roof rainwater evacuation.",
    description: "Designed specifically for non-pressurized gravity evacuation systems. Highly resistant to common domestic detergents, acids, and waste effluents. Equipped with socket ends for swift assembly.",
    material: "PVC-U Drainage Grade",
    diameter: "4 inch (110mm)",
    length: "10 ft",
    color: "Light Grey",
    application: "Sanitary Waste, Rainwater Gutter Lines, Soil Stacks",
    pressureRating: "Gravity Discharge (Non-Pressure)",
    brand: "DrainPro Standard",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-03-1", sku: "SH-DRN-75MM-10FT", diameter: "3 inch (75mm)", length: "10 ft", color: "Light Grey", price: 1350, stock: 45 },
      { id: "v-03-2", sku: "SH-DRN-110MM-10FT", diameter: "4 inch (110mm)", length: "10 ft", color: "Light Grey", price: 1850, stock: 50 }
    ],
    technicalSpecifications: {
      material: "Impact Modified PVC-U",
      productType: "Sanitary Waste & Drainage Pipe",
      diameter: '75mm / 110mm (3" / 4")',
      length: "10 ft (3.05 m)",
      color: "Neutral Grey",
      application: "Soil stack, Waste drop, Storm runoff",
      connectionType: "Push-fit ring or Solvent join",
      pressureRating: "Gravity drain (0.5 Bar static test)",
      standardCompliance: "BS EN 1329 / PS:3051 Compliant"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-drn-sewer-heavy",
    name: "Heavy Underground uPVC Sewerage Pipe (SN4 / SDR 34)",
    slug: "heavy-underground-upvc-sewerage-pipe",
    category: "drainage",
    subcategory: "Soil & Waste Pipes",
    sku: "SH-SEW-SN4-160",
    price: 3600,
    stock: 45,
    isNew: false,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "High-stiffness underground sewer pipe engineered to withstand heavy earth loads and vehicular road traffic.",
    description: "Designed for main building sewer exits, road crossings, and municipal drainage connections. The ring stiffness rating of SN4 ensures the pipe will not deform or collapse under deep backfill and heavy ground compaction.",
    material: "Reinforced PVC-U Sewer Grade",
    diameter: "6 inch (160mm)",
    length: "10 ft (3m)",
    color: "Terracotta / Brown Grey",
    application: "Main Building Sewer Line, Municipal Waste Outfall",
    pressureRating: "Ring Stiffness SN4 (4 kN/m\xB2)",
    brand: "DrainPro Standard",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-sew-110", sku: "SH-SEW-110-10FT", diameter: "4 inch (110mm)", length: "10 ft", color: "Brown Grey", price: 2200, stock: 35 },
      { id: "v-sew-160", sku: "SH-SEW-160-10FT", diameter: "6 inch (160mm)", length: "10 ft", color: "Brown Grey", price: 3600, stock: 45 },
      { id: "v-sew-200", sku: "SH-SEW-200-10FT", diameter: "8 inch (200mm)", length: "10 ft", color: "Brown Grey", price: 5800, stock: 20 }
    ],
    technicalSpecifications: {
      material: "Unplasticized Polyvinyl Chloride Sewer Grade",
      standardCompliance: "BS EN 1401 / ISO 4435",
      ringStiffness: "SN4 (4 kN/m\xB2)",
      connectionType: "Rubber Ring Socket (Elastomeric Seal)"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-drn-suction-hose",
    name: "Heavy-Duty Spiral Reinforced PVC Suction Hose Pipe",
    slug: "heavy-duty-spiral-reinforced-pvc-suction-hose",
    category: "pvc-pipes",
    subcategory: "Flexible & Suction Pipes",
    sku: "SH-HOS-SUCT-20",
    price: 380,
    stock: 210,
    isNew: false,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Flexible green ribbed suction and delivery hose with embedded rigid PVC spiral reinforcement for tubewells and pumps.",
    description: "Resists full vacuum suction without collapsing. Ideal for agricultural tubewell intake, dewatering pumps, tank emptying, and heavy slurry transfer. Smooth bore ensures minimum friction loss.",
    material: "Flexible PVC with Rigid PVC Helix Skeleton",
    diameter: "2 inch (50mm)",
    length: "Per Foot (Sold by running foot or 100ft roll)",
    color: "Emerald Green Translucent",
    application: "Tubewell Suction, Dewatering Pumps, Slurry Transfer",
    pressureRating: "Vacuum 700 mmHg / Working 6 Bar",
    brand: "Heavy Duty Grade",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-suct-15", sku: "SH-HOS-SUCT-15", diameter: "1.5 inch", length: "Per Foot", color: "Green", price: 290, stock: 250 },
      { id: "v-suct-20", sku: "SH-HOS-SUCT-20", diameter: "2 inch", length: "Per Foot", color: "Green", price: 380, stock: 210 },
      { id: "v-suct-30", sku: "SH-HOS-SUCT-30", diameter: "3 inch", length: "Per Foot", color: "Green", price: 590, stock: 120 },
      { id: "v-suct-40", sku: "SH-HOS-SUCT-40", diameter: "4 inch", length: "Per Foot", color: "Green", price: 850, stock: 80 }
    ],
    technicalSpecifications: {
      material: "Flexible Virgin PVC with Rigid PVC Helix",
      operatingTemp: "-10\xB0C to +60\xB0C",
      reinforcement: "Crush-resistant internal spiral"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-drn-sink-flex",
    name: "Flexible Expandable Corrugated Waste Drain Pipe",
    slug: "flexible-expandable-corrugated-waste-pipe",
    category: "drainage",
    subcategory: "Flexible Drainage",
    sku: "SH-DRN-FLX-01",
    price: 180,
    stock: 450,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Accordioned flexible drain tube for wash basins, kitchen sinks, and bathtub waste connections.",
    description: "Extends from 12 inches to 32 inches and easily bends into custom P-traps or offset angles where rigid pipes cannot align.",
    material: "Polypropylene / Flexible PVC",
    diameter: "1.25 inch & 1.5 inch Universal",
    length: "32 inch fully extended",
    color: "White",
    application: "Kitchen Sink Drain, Bathroom Vanity Basin Drain",
    brand: "DrainPro Standard",
    images: [
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-flx-1", sku: "SH-DRN-FLX-01", diameter: '1.25" / 1.5"', length: "32 inch", color: "White", price: 180, stock: 450 }
    ],
    technicalSpecifications: {
      material: "Virgin flexible polymer",
      length: "Extended 80cm (32 inch)",
      connection: "Rubber washer & threaded slip nut"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  // ==========================================
  // 3. ELECTRICAL CONDUIT PVC PIPES
  // ==========================================
  {
    id: "prod-pvc-conduit",
    name: "uPVC Flame-Retardant Electrical Conduit Pipe",
    slug: "upvc-flame-retardant-electrical-conduit-pipe",
    category: "pvc-pipes",
    subcategory: "Conduit Pipes",
    sku: "SH-CND-MED-075",
    price: 240,
    stock: 480,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Self-extinguishing rigid uPVC conduit pipe for concealed wall chasing and ceiling electrical wiring.",
    description: "Manufactured with flame-retardant additives that immediately self-extinguish when fire sources are removed. Smooth interior ensures snag-free pulling of multi-strand electrical cables.",
    material: "Flame Retardant uPVC",
    diameter: "3/4 inch (20mm)",
    length: "10 ft",
    color: "White",
    application: "Concealed Building Wiring, Electrical Cable Protection",
    brand: "Standard Grade",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-cnd-05", sku: "SH-CND-050", diameter: "1/2 inch (16mm)", length: "10 ft", color: "White", price: 190, stock: 250 },
      { id: "v-cnd-075", sku: "SH-CND-075", diameter: "3/4 inch (20mm)", length: "10 ft", color: "White", price: 240, stock: 480 },
      { id: "v-cnd-10", sku: "SH-CND-100", diameter: "1 inch (25mm)", length: "10 ft", color: "White", price: 340, stock: 300 }
    ],
    technicalSpecifications: {
      material: "Rigid Flame-Retardant uPVC",
      standardCompliance: "BS 4607 / PS:3051",
      impactResistance: "Medium Mechanical Stress Grade",
      operatingTemp: "-5\xB0C to +60\xB0C"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-pvc-conduit-orange",
    name: "Heavy-Duty Underground Cable Conduit Pipe (Orange)",
    slug: "heavy-duty-underground-cable-conduit-pipe",
    category: "pvc-pipes",
    subcategory: "Conduit Pipes",
    sku: "SH-CND-ORG-20",
    price: 880,
    stock: 120,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "High-visibility orange conduit pipe designed for direct burial of main incoming electrical cables and feeder lines.",
    description: "Heavy wall thickness shields power cables from spade punctures, soil settlement, and rodent chewing. High-visibility bright safety orange warns excavators of live underground electrical lines.",
    material: "Impact Modified uPVC",
    diameter: "2 inch (50mm)",
    length: "10 ft",
    color: "Safety Orange",
    application: "Main Power Infeed Lines, Transformer Cable Ducts",
    brand: "Heavy Duty Grade",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-org-15", sku: "SH-CND-ORG-15", diameter: "1.5 inch", length: "10 ft", color: "Orange", price: 680, stock: 60 },
      { id: "v-org-20", sku: "SH-CND-ORG-20", diameter: "2 inch", length: "10 ft", color: "Orange", price: 880, stock: 120 },
      { id: "v-org-30", sku: "SH-CND-ORG-30", diameter: "3 inch", length: "10 ft", color: "Orange", price: 1450, stock: 50 }
    ],
    technicalSpecifications: {
      material: "Heavy-duty impact modified uPVC",
      color: "Safety Orange RAL 2004",
      wallThickness: "3.2 mm nominal"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  // ==========================================
  // 4. PRECISION PIPE FITTINGS
  // ==========================================
  {
    id: "prod-fit-01",
    name: "90-Degree uPVC Heavy Pressure Elbow Fitting",
    slug: "90-degree-upvc-heavy-pressure-elbow",
    category: "pipe-fittings",
    subcategory: "Elbows 90\xB0 & 45\xB0",
    sku: "SH-FIT-ELB90",
    price: 85,
    salePrice: 75,
    stock: 650,
    isNew: false,
    isFeatured: true,
    isSale: true,
    isDemo: true,
    shortDescription: "Precision molded 90\xB0 solvent weld elbow fitting with deep socket depth for secure high-pressure direction changes.",
    description: "Thick-walled uPVC directional elbow fitting for pressure plumbing loops. Molded radius promotes uniform laminar fluid movement and eliminates pressure loss points.",
    material: "uPVC Pressure Compound",
    diameter: "1 inch (25mm)",
    color: "White",
    application: "Plumbing Turns, Direction Change, Water Lines",
    pressureRating: "PN16 (16 Bar / 232 PSI)",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-fit-1-1", sku: "SH-FIT-ELB90-05", diameter: "1/2 inch", color: "White", price: 45, stock: 200 },
      { id: "v-fit-1-2", sku: "SH-FIT-ELB90-075", diameter: "3/4 inch", color: "White", price: 60, stock: 250 },
      { id: "v-fit-1-3", sku: "SH-FIT-ELB90-10", diameter: "1 inch", color: "White", price: 75, stock: 200 },
      { id: "v-fit-1-4", sku: "SH-FIT-ELB90-15", diameter: "1.5 inch", color: "White", price: 130, stock: 150 },
      { id: "v-fit-1-5", sku: "SH-FIT-ELB90-20", diameter: "2 inch", color: "White", price: 195, stock: 120 }
    ],
    technicalSpecifications: {
      material: "uPVC Grade 1",
      productType: "90\xB0 Equal Elbow",
      diameter: '1/2" to 2"',
      connectionType: "Dual Socket Female Weld",
      pressureRating: "PN16 (232 PSI)",
      operatingTemp: "Up to 50\xB0C"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-fit-elb45",
    name: "45-Degree uPVC Sweep Low-Resistance Elbow Fitting",
    slug: "45-degree-upvc-sweep-elbow",
    category: "pipe-fittings",
    subcategory: "Elbows 90\xB0 & 45\xB0",
    sku: "SH-FIT-ELB45",
    price: 90,
    stock: 380,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Gentle 45-degree bend fitting designed to minimize friction loss and hydraulic turbulence in pump delivery pipelines.",
    description: "Provides a smooth 45\xB0 angular deflection that reduces fluid backpressure compared to sharp 90-degree elbows. Often paired in sets of two to create wide sweeping bends on long supply runs.",
    material: "uPVC Heavy Duty",
    diameter: "1 inch (25mm)",
    color: "White",
    application: "Hydraulic Flow Optimization, Pump Discharge Lines",
    pressureRating: "PN16 (16 Bar)",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-elb45-075", sku: "SH-FIT-ELB45-075", diameter: "3/4 inch", color: "White", price: 70, stock: 150 },
      { id: "v-elb45-10", sku: "SH-FIT-ELB45-10", diameter: "1 inch", color: "White", price: 90, stock: 200 },
      { id: "v-elb45-15", sku: "SH-FIT-ELB45-15", diameter: "1.5 inch", color: "White", price: 150, stock: 100 },
      { id: "v-elb45-20", sku: "SH-FIT-ELB45-20", diameter: "2 inch", color: "White", price: 220, stock: 80 }
    ],
    technicalSpecifications: {
      material: "Rigid uPVC Pressure Grade",
      angle: "45 Degrees",
      pressureRating: "PN16"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-fit-02",
    name: "Equal Tee uPVC Three-Way Branch Connector",
    slug: "equal-tee-upvc-three-way-branch-connector",
    category: "pipe-fittings",
    subcategory: "Equal & Reducing Tees",
    sku: "SH-FIT-TEE-EQ",
    price: 120,
    stock: 420,
    isNew: false,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "90-degree branch tee fitting for balanced fluid diversion in pressurized distribution circuits.",
    description: "Precision molded three-way equal connector designed for clean right-angle junction splitting with minimum turbulence.",
    material: "uPVC Heavy Gauge",
    diameter: "1 inch (25mm)",
    color: "White",
    application: "Water branch splits, bathroom distribution lines",
    pressureRating: "PN16",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-tee-05", sku: "SH-FIT-TEE-050", diameter: "1/2 inch", color: "White", price: 75, stock: 150 },
      { id: "v-tee-1", sku: "SH-FIT-TEE-075", diameter: "3/4 inch", color: "White", price: 95, stock: 210 },
      { id: "v-tee-2", sku: "SH-FIT-TEE-10", diameter: "1 inch", color: "White", price: 120, stock: 210 },
      { id: "v-tee-3", sku: "SH-FIT-TEE-15", diameter: "1.5 inch", color: "White", price: 210, stock: 110 },
      { id: "v-tee-4", sku: "SH-FIT-TEE-20", diameter: "2 inch", color: "White", price: 310, stock: 80 }
    ],
    technicalSpecifications: {
      material: "Unplasticized Polyvinyl Chloride",
      productType: "Equal Three-Way Tee",
      diameter: '1/2" to 2"',
      connectionType: "Triple Socket Female Solvent Joint",
      pressureRating: "PN16 (16 Bar)"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-fit-red-tee",
    name: "uPVC Reducing Tee Branch Connector Fitting",
    slug: "upvc-reducing-tee-branch-connector",
    category: "pipe-fittings",
    subcategory: "Equal & Reducing Tees",
    sku: "SH-FIT-TEE-RED",
    price: 135,
    stock: 290,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Tee fitting with a smaller center branch socket for tapping smaller diameter sub-lines off main risers.",
    description: 'Eliminates the need for multiple fittings and bushings. Connects a smaller sub-branch line (e.g. 3/4" or 1/2") directly to a larger main pipeline (1" or 1.5") in a single, compact, leak-free fitting.',
    material: "uPVC Pressure Compound",
    diameter: '1" x 3/4" x 1"',
    color: "White",
    application: "Branching off tap feeds from main water riser",
    pressureRating: "PN16",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-rt-1", sku: "SH-FIT-RT-10x075", diameter: '1" x 3/4"', color: "White", price: 135, stock: 120 },
      { id: "v-rt-2", sku: "SH-FIT-RT-15x10", diameter: '1.5" x 1"', color: "White", price: 230, stock: 90 },
      { id: "v-rt-3", sku: "SH-FIT-RT-20x10", diameter: '2" x 1"', color: "White", price: 340, stock: 80 }
    ],
    technicalSpecifications: {
      material: "uPVC Heavy Duty",
      pressureRating: "PN16"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-fit-socket",
    name: "Straight Coupler Socket Fitting with Internal Stop",
    slug: "straight-coupler-socket-fitting",
    category: "pipe-fittings",
    subcategory: "Couplers & Sockets",
    sku: "SH-FIT-SKT-10",
    price: 65,
    salePrice: 55,
    stock: 800,
    isNew: false,
    isFeatured: true,
    isSale: true,
    isDemo: true,
    shortDescription: "Dual-ended female socket coupler for inline solvent welding of straight pipe lengths with central stop ridge.",
    description: "Ensures exact 50/50 pipe insertion depth for maximum weld strength. Internal centering ridge prevents pipes from inserting too deep or unevenly.",
    material: "uPVC Standard",
    diameter: "1 inch (25mm)",
    color: "White",
    application: "Joining straight pipe lengths",
    pressureRating: "PN16",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-skt-05", sku: "SH-FIT-SKT-05", diameter: "1/2 inch", color: "White", price: 35, stock: 300 },
      { id: "v-skt-075", sku: "SH-FIT-SKT-075", diameter: "3/4 inch", color: "White", price: 45, stock: 280 },
      { id: "v-skt-10", sku: "SH-FIT-SKT-10", diameter: "1 inch", color: "White", price: 55, stock: 220 },
      { id: "v-skt-15", sku: "SH-FIT-SKT-15", diameter: "1.5 inch", color: "White", price: 95, stock: 150 },
      { id: "v-skt-20", sku: "SH-FIT-SKT-20", diameter: "2 inch", color: "White", price: 145, stock: 120 }
    ],
    technicalSpecifications: {
      material: "uPVC Type 1",
      connectionType: "Double Female Socket",
      pressureRating: "PN16"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-fit-reducer",
    name: "Concentric Reducer Bushing & Socket Adapter",
    slug: "concentric-reducer-bushing-socket",
    category: "pipe-fittings",
    subcategory: "Reducers",
    sku: "SH-FIT-RED-2010",
    price: 85,
    stock: 350,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Step-down adapter for transitioning pipelines from large main line diameters into smaller distribution sizes.",
    description: "Smooth interior taper prevents sediment accumulation and preserves laminar water flow across line size reductions.",
    material: "uPVC Pressure Compound",
    diameter: '1.5" to 1" & 2" to 1"',
    color: "White",
    application: "Pipe sizing transition in plumbing loops",
    pressureRating: "PN16",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-red-1", sku: "SH-FIT-RED-10x075", diameter: '1" to 3/4"', color: "White", price: 65, stock: 150 },
      { id: "v-red-2", sku: "SH-FIT-RED-15x10", diameter: '1.5" to 1"', color: "White", price: 85, stock: 120 },
      { id: "v-red-3", sku: "SH-FIT-RED-20x10", diameter: '2" to 1"', color: "White", price: 120, stock: 80 }
    ],
    technicalSpecifications: {
      material: "Rigid uPVC",
      pressureRating: "PN16"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-fit-fta-brass",
    name: "Female Threaded Adaptor (FTA) with Molded Brass Insert",
    slug: "female-threaded-adaptor-fta-brass-insert",
    category: "pipe-fittings",
    subcategory: "Threaded Adaptors (FTA/MTA)",
    sku: "SH-FIT-FTA-BRS",
    price: 185,
    stock: 420,
    isNew: true,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Solvent weld socket to internal solid brass female thread for crack-free installation of bibcocks, taps, and shower mixers.",
    description: "The brass threaded core completely prevents plastic split fractures caused by over-tightening metal taps or shower valves. Essential for leak-proof sanitary fixture mounting in modern bathrooms.",
    material: "uPVC Body + Solid Brass Thread Insert",
    diameter: "1/2 inch & 3/4 inch",
    color: "White with Gold Brass Core",
    application: "Mounting Taps, Bibcocks, Shower Mixers, Water Inlets",
    pressureRating: "PN16 (16 Bar)",
    brand: "MasterFlow Pro",
    images: [
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-fta-05", sku: "SH-FIT-FTA-050", diameter: "1/2 inch", color: "White/Brass", price: 185, stock: 240 },
      { id: "v-fta-075", sku: "SH-FIT-FTA-075", diameter: "3/4 inch", color: "White/Brass", price: 260, stock: 180 }
    ],
    technicalSpecifications: {
      material: "Virgin uPVC with nickel-plated forged brass insert",
      threadStandard: "BSPT / NPT Standard Tap Thread",
      pressureRating: "PN16 (1600 kPa)"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-fit-mta",
    name: "Male Threaded Adaptor (MTA) Solvent to Male NPT",
    slug: "male-threaded-adaptor-mta",
    category: "pipe-fittings",
    subcategory: "Threaded Adaptors (FTA/MTA)",
    sku: "SH-FIT-MTA-10",
    price: 75,
    stock: 360,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Solvent socket to male threaded adapter for connecting PVC pipes into female water pump ports and tank outlets.",
    description: "Precision cut male threads seal tightly with Teflon tape into water pump housings, filter canisters, and brass check valves.",
    material: "Heavy-Duty uPVC",
    diameter: "1 inch (25mm)",
    color: "White",
    application: "Pump Inlet/Outlet Connections, Water Tank Adapters",
    pressureRating: "PN16",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-mta-075", sku: "SH-FIT-MTA-075", diameter: "3/4 inch", color: "White", price: 60, stock: 160 },
      { id: "v-mta-10", sku: "SH-FIT-MTA-10", diameter: "1 inch", color: "White", price: 75, stock: 200 },
      { id: "v-mta-15", sku: "SH-FIT-MTA-15", diameter: "1.5 inch", color: "White", price: 130, stock: 110 },
      { id: "v-mta-20", sku: "SH-FIT-MTA-20", diameter: "2 inch", color: "White", price: 190, stock: 90 }
    ],
    technicalSpecifications: {
      material: "uPVC Heavy Duty",
      threadStandard: "BSPT / NPT Male",
      pressureRating: "PN16"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-fit-union",
    name: "uPVC True Union Demountable Pipe Coupler",
    slug: "upvc-true-union-pipe-coupler",
    category: "pipe-fittings",
    subcategory: "Unions",
    sku: "SH-FIT-UNI-10",
    price: 340,
    stock: 180,
    isNew: false,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Three-piece threaded union fitting allowing fast disconnection of pumps, filters, and tanks without cutting lines.",
    description: "Features a heavy EPDM O-ring seal compressed between two socket ends by a threaded central union nut. Allows plumbers to detach water pumps for repairs in under 30 seconds.",
    material: "uPVC Body + EPDM O-Ring",
    diameter: "1 inch (25mm)",
    color: "Dark Grey or White",
    application: "Pump disconnect, inline equipment servicing",
    pressureRating: "PN16",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-uni-075", sku: "SH-FIT-UNI-075", diameter: "3/4 inch", color: "Grey", price: 280, stock: 80 },
      { id: "v-uni-10", sku: "SH-FIT-UNI-10", diameter: "1 inch", color: "Grey", price: 340, stock: 100 },
      { id: "v-uni-15", sku: "SH-FIT-UNI-15", diameter: "1.5 inch", color: "Grey", price: 540, stock: 60 },
      { id: "v-uni-20", sku: "SH-FIT-UNI-20", diameter: "2 inch", color: "Grey", price: 790, stock: 40 }
    ],
    technicalSpecifications: {
      material: "uPVC with heavy chemical resistant EPDM ring",
      pressureRating: "PN16 (16 Bar)"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-fit-endcap",
    name: "uPVC Heavy-Duty Pressure End Cap Plug",
    slug: "upvc-heavy-duty-pressure-end-cap",
    category: "pipe-fittings",
    subcategory: "End Caps",
    sku: "SH-FIT-CAP-10",
    price: 55,
    stock: 450,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Dome-headed uPVC cap for solvent sealing terminal line ends and pressure testing closed plumbing runs.",
    description: "Reinforced domed head handles full hydrostatic test pressure without bulging. Used for capping future line expansions and dead-end plumbing branches.",
    material: "uPVC Pressure Compound",
    diameter: "1 inch (25mm)",
    color: "White",
    application: "Pipeline termination, pressure test cap",
    pressureRating: "PN16",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-cap-05", sku: "SH-FIT-CAP-05", diameter: "1/2 inch", color: "White", price: 30, stock: 200 },
      { id: "v-cap-075", sku: "SH-FIT-CAP-075", diameter: "3/4 inch", color: "White", price: 40, stock: 150 },
      { id: "v-cap-10", sku: "SH-FIT-CAP-10", diameter: "1 inch", color: "White", price: 55, stock: 100 }
    ],
    technicalSpecifications: {
      material: "uPVC Pressure Grade",
      pressureRating: "PN16"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  // ==========================================
  // 5. INDUSTRIAL & PLUMBING VALVES
  // ==========================================
  {
    id: "prod-vlv-01",
    name: "Industrial uPVC True Union Ball Valve with PTFE Seats",
    slug: "industrial-upvc-true-union-ball-valve",
    category: "valves",
    subcategory: "Ball Valves",
    sku: "SH-VLV-TUBV-10",
    price: 680,
    salePrice: 620,
    stock: 85,
    isNew: true,
    isFeatured: true,
    isSale: true,
    isDemo: true,
    shortDescription: "High-torque industrial quarter-turn shut-off valve with removable union ends and Teflon (PTFE) seal seats.",
    description: "Allows easy disassembly and inline servicing without cutting pipelines. Features leak-free EPDM O-rings and micro-finished ball for ultra-smooth operation under water pressure.",
    material: "uPVC Body + PTFE Seats + EPDM Rings",
    diameter: "1 inch (25mm)",
    color: "Dark Grey Body with Red Ergonomic Handle",
    application: "Water isolation, tank shutoff, main header cutoff",
    pressureRating: "PN16 (16 Bar / 232 PSI)",
    brand: "ValveTech Pro",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-vlv-1", sku: "SH-VLV-10-GREY", diameter: "1 inch", color: "Grey / Red Handle", price: 620, stock: 45 },
      { id: "v-vlv-2", sku: "SH-VLV-15-GREY", diameter: "1.5 inch", color: "Grey / Red Handle", price: 980, stock: 40 },
      { id: "v-vlv-3", sku: "SH-VLV-20-GREY", diameter: "2 inch", color: "Grey / Red Handle", price: 1450, stock: 30 }
    ],
    technicalSpecifications: {
      material: "uPVC Body, Teflon Seats, SS304 Internal Fasteners",
      productType: "True Union Ball Valve",
      diameter: '1" to 2"',
      connectionType: "Double Union Female Socket Ends",
      pressureRating: "PN16 (1600 kPa)",
      operatingTemp: "0\xB0C to 55\xB0C"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-vlv-compact",
    name: "Compact Economy uPVC Water Ball Valve",
    slug: "compact-economy-upvc-water-ball-valve",
    category: "valves",
    subcategory: "Ball Valves",
    sku: "SH-VLV-CMP-075",
    price: 240,
    stock: 220,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "One-piece molded compact solvent socket ball valve for domestic shut-off lines and overhead water tanks.",
    description: "Cost-effective quarter-turn cutoff valve. High-leverage red T-handle ensures easy opening and closing even after months in open position.",
    material: "PVC Body + ABS Handle",
    diameter: "3/4 inch & 1 inch",
    color: "White with Red Handle",
    application: "Domestic Branch Cutoff, Tank Inlets, Garden Spigots",
    pressureRating: "PN10 (10 Bar / 145 PSI)",
    brand: "ValveTech Pro",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-cmp-05", sku: "SH-VLV-CMP-050", diameter: "1/2 inch", color: "White/Red", price: 180, stock: 100 },
      { id: "v-cmp-075", sku: "SH-VLV-CMP-075", diameter: "3/4 inch", color: "White/Red", price: 240, stock: 120 },
      { id: "v-cmp-10", sku: "SH-VLV-CMP-100", diameter: "1 inch", color: "White/Red", price: 320, stock: 90 }
    ],
    technicalSpecifications: {
      material: "PVC with smooth PTFE seating",
      pressureRating: "PN10"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-vlv-02",
    name: "PVC Non-Return Swing Check Valve (Flap Type)",
    slug: "pvc-non-return-swing-check-valve",
    category: "valves",
    subcategory: "Non-Return Check Valves",
    sku: "SH-VLV-CHK-20",
    price: 1150,
    stock: 35,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Automatic unidirectional backflow prevention check valve for pump delivery lines and underground reservoirs.",
    description: "Stops hazardous water backflow and prevents loss of pump priming. Gravity and pressure responsive internal flap with synthetic rubber seat ensures quick shut-off without slamming.",
    material: "Heavy Cast uPVC",
    diameter: "2 inch (50mm)",
    color: "Industrial Grey",
    application: "Pump discharge backflow safeguard, sump pump line",
    pressureRating: "PN10 (10 Bar)",
    brand: "ValveTech Pro",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-vlv-chk-1", sku: "SH-VLV-CHK-15", diameter: "1.5 inch", color: "Grey", price: 890, stock: 25 },
      { id: "v-vlv-chk-2", sku: "SH-VLV-CHK-20", diameter: "2 inch", color: "Grey", price: 1150, stock: 35 },
      { id: "v-vlv-chk-3", sku: "SH-VLV-CHK-30", diameter: "3 inch", color: "Grey", price: 1950, stock: 15 }
    ],
    technicalSpecifications: {
      material: "Rigid uPVC & NBR Seal",
      productType: "Swing Flap Check Valve",
      diameter: '1.5" to 3"',
      connectionType: "Solvent Socket",
      pressureRating: "PN10"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-vlv-foot",
    name: "Heavy-Duty Vertical Spring Foot Valve with Stainless/PVC Strainer",
    slug: "heavy-duty-vertical-spring-foot-valve",
    category: "valves",
    subcategory: "Foot Valves",
    sku: "SH-VLV-FOOT-20",
    price: 850,
    stock: 65,
    isNew: true,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Bottom suction check valve with built-in debris filter cage to maintain electric motor water pump priming.",
    description: "Installed at the bottom of tubewell pipes or water suction reservoirs. Heavy spring-loaded seal prevents water column from draining back down, keeping pumps primed 100% of the time. Integrated slotted strainer keeps sand, pebbles, and debris out of pump impellers.",
    material: "Heavy uPVC + Stainless Steel Spring",
    diameter: "2 inch (50mm)",
    color: "Industrial Dark Grey",
    application: "Tubewell Suction Priming, Groundwater Pumping",
    pressureRating: "PN10 (10 Bar)",
    brand: "ValveTech Pro",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-ft-15", sku: "SH-VLV-FOOT-15", diameter: "1.5 inch", color: "Grey", price: 650, stock: 40 },
      { id: "v-ft-20", sku: "SH-VLV-FOOT-20", diameter: "2 inch", color: "Grey", price: 850, stock: 65 },
      { id: "v-ft-30", sku: "SH-VLV-FOOT-30", diameter: "3 inch", color: "Grey", price: 1450, stock: 25 }
    ],
    technicalSpecifications: {
      material: "uPVC body, SS304 internal spring, NBR seal ring",
      meshSize: "2.5 mm debris filtration slots",
      pressureRating: "PN10"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-vlv-float",
    name: "Overhead Water Tank Automatic Float Ball Valve (Brass Arm)",
    slug: "overhead-tank-automatic-float-ball-valve",
    category: "valves",
    subcategory: "Tank Float Valves",
    sku: "SH-VLV-FLT-075",
    price: 680,
    stock: 90,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Automatic tank shutoff ballcock valve with adjustable solid brass lever rod and heavy polyethylene float sphere.",
    description: "Automatically halts incoming water flow once overhead water tanks reach capacity, preventing rooftop overflow and motor wastage. Heavy brass arm resists bending under high city main pressure.",
    material: "Forged Brass Valve Body + Polyethylene Float Ball",
    diameter: "3/4 inch & 1 inch",
    color: "Brass Body with Blue/Orange Float Ball",
    application: "Rooftop Water Storage Tank Auto-Shutoff",
    pressureRating: "Up to 10 Bar",
    brand: "ValveTech Pro",
    images: [
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-flt-05", sku: "SH-VLV-FLT-050", diameter: "1/2 inch", color: "Brass/Orange", price: 540, stock: 45 },
      { id: "v-flt-075", sku: "SH-VLV-FLT-075", diameter: "3/4 inch", color: "Brass/Orange", price: 680, stock: 50 },
      { id: "v-flt-10", sku: "SH-VLV-FLT-100", diameter: "1 inch", color: "Brass/Orange", price: 920, stock: 35 }
    ],
    technicalSpecifications: {
      material: "CW617N Brass Body, Heavy Duty Float Sphere",
      shutoffMechanism: "Direct acting lever seal"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  // ==========================================
  // 6. DRAINAGE HARDWARE & SANITARY TRAPS
  // ==========================================
  {
    id: "prod-drn-nahani",
    name: "PVC Deep Seal Multi-Inlet Floor Nahani Trap with SS Grating",
    slug: "pvc-deep-seal-floor-nahani-trap-ss-grating",
    category: "drainage",
    subcategory: "Floor Drains & Nahani Traps",
    sku: "SH-DRN-NAH-110",
    price: 450,
    stock: 140,
    isNew: true,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Bathroom floor drain trap with 50mm water seal and stainless steel 304 anti-cockroach grating.",
    description: "Maintains a constant deep water barrier that prevents foul sewer gas and insects from backing up into bathrooms or kitchens. Includes removable SS304 hair strainer.",
    material: "PVC-U Body + Grade 304 Stainless Steel Grating",
    diameter: '110mm Inlet / 75mm Outlet (4" x 3")',
    color: "White/Grey with Silver SS Cover",
    application: "Bathroom Floor Drainage, Balcony Waste Outlet",
    brand: "DrainPro Standard",
    images: [
      "https://images.unsplash.com/photo-1581092162384-8987c1d64718?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-nah-1", sku: "SH-DRN-NAH-110", diameter: "110mm x 75mm", color: "White/SS Grate", price: 450, stock: 140 }
    ],
    technicalSpecifications: {
      waterSealDepth: "50 mm anti-odor seal",
      grateMaterial: "SS304 Rustproof Grating"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-drn-ptrap",
    name: "PVC P-Trap Deep Water Sanitary Waste Trap",
    slug: "pvc-p-trap-sanitary-waste-trap",
    category: "drainage",
    subcategory: "P-Traps & S-Traps",
    sku: "SH-DRN-PTRAP-4",
    price: 680,
    stock: 95,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "One-piece molded sanitary P-trap for floor closets, squatting pans, and commercial waste chutes.",
    description: "Smooth hydraulic curvature ensures full self-scouring with every flush, preventing solid buildup while sealing against toxic sewer fumes.",
    material: "PVC-U Drainage Compound",
    diameter: "4 inch (110mm)",
    color: "Light Grey",
    application: "Commode / WC waste connection, floor urinal drop",
    brand: "DrainPro Standard",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-ptrp-3", sku: "SH-DRN-PTRP-3", diameter: "3 inch (75mm)", color: "Grey", price: 480, stock: 45 },
      { id: "v-ptrp-4", sku: "SH-DRN-PTRP-4", diameter: "4 inch (110mm)", color: "Grey", price: 680, stock: 50 }
    ],
    technicalSpecifications: {
      material: "Impact Modified Drainage PVC-U",
      sealDepth: "Minimum 50 mm hydraulic seal"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  // ==========================================
  // 7. PLUMBING SUPPLIES, CHEMICALS & TOOLS
  // ==========================================
  {
    id: "prod-plm-01",
    name: "Heavy-Duty uPVC Solvent Cement Adhesive (500ml Tin)",
    slug: "heavy-duty-upvc-solvent-cement-500ml",
    category: "plumbing",
    subcategory: "Solvent Cement & Adhesives",
    sku: "SH-PLM-SOLV-500",
    price: 480,
    stock: 310,
    isNew: false,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Industrial grade clear gap-filling chemical bonding solvent for permanent leak-free uPVC pipe joints.",
    description: "Fast setting, high-viscosity solvent cement specifically formulated for pressure water lines and general conduit fittings. Chemically fuses uPVC surfaces into a single monolithic weld capable of handling full line test pressure.",
    material: "Volatile Organic Solvent Base Polymer",
    color: "Clear Translucent",
    application: "Pipe to Fitting Welded Joints, Cold Water Riser Sealing",
    pressureRating: "Rated to Pipe Class Once Cured",
    brand: "BondPro Weld",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-solv-100", sku: "SH-PLM-SOLV-100", length: "100 ml tube", price: 140, stock: 120 },
      { id: "v-solv-250", sku: "SH-PLM-SOLV-250", length: "250 ml tin", price: 280, stock: 150 },
      { id: "v-solv-500", sku: "SH-PLM-SOLV-500", length: "500 ml tin with applicator", price: 480, stock: 160 },
      { id: "v-solv-1000", sku: "SH-PLM-SOLV-1000", length: "1000 ml can", price: 880, stock: 80 }
    ],
    technicalSpecifications: {
      material: "PVC resin in active solvent vehicle",
      productType: "Chemical Fusion Solvent Cement",
      color: "Clear",
      operatingTemp: "Cures in ambient temp 15\xB0C - 45\xB0C",
      application: "Socket-to-spigot chemical welding"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-plm-teflon",
    name: "Premium PTFE Teflon Thread Seal Tape (10-Roll Contractor Pack)",
    slug: "premium-ptfe-teflon-thread-seal-tape-10-pack",
    category: "plumbing",
    subcategory: "Thread Seal Tapes",
    sku: "SH-PLM-TEF-10PK",
    price: 320,
    stock: 500,
    isNew: false,
    isFeatured: false,
    isSale: true,
    isDemo: true,
    shortDescription: "High-density pure PTFE non-hardening pipe thread sealant tape for air, gas, and high pressure water threads.",
    description: "Thick 0.1mm commercial density. Does not shred or bunch up during wrapping. Fills micronic thread gaps on brass, steel, and PVC male threaded adapters for a 100% drip-free seal.",
    material: "100% Virgin Polytetrafluoroethylene (PTFE)",
    diameter: "12mm / 19mm Width",
    length: "10 Meters per spool (Pack of 10 spools)",
    color: "Milky White",
    application: "Sealing threaded pipe joints, taps, valves",
    brand: "BondPro Weld",
    images: [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-tef-12", sku: "SH-PLM-TEF-12", diameter: "12mm x 10m", length: "10 Rolls", color: "White", price: 320, stock: 300 },
      { id: "v-tef-19", sku: "SH-PLM-TEF-19", diameter: "19mm x 15m (Heavy Duty)", length: "10 Rolls", color: "White", price: 540, stock: 200 }
    ],
    technicalSpecifications: {
      material: "100% High Density PTFE",
      operatingTemp: "-200\xB0C to +260\xB0C",
      pressureRating: "Up to 30 Bar hydrostatic"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-plm-02",
    name: "Heavy Duty Galvanized Pipe Clamps with EPDM Rubber Lining",
    slug: "heavy-duty-galvanized-pipe-clamps-epdm",
    category: "plumbing",
    subcategory: "Pipe Clamps & Hangers",
    sku: "SH-PLM-CLMP-10",
    price: 95,
    stock: 520,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Zinc-plated steel dual-bolt pipe bracket with rubber acoustic insulation sleeve for wall and ceiling mounting.",
    description: "Heavy duty steel mounting brackets with corrosion-resistant galvanization. High-grade EPDM rubber lining dampens pipeline vibration, water hammer sounds, and accommodates thermal pipe expansion.",
    material: "Electro-Galvanized Steel + EPDM Rubber",
    diameter: "1 inch & 2 inch",
    color: "Silver with Black Rubber Insulator",
    application: "Vertical Wall Risers, Overhead Slab Suspensions",
    brand: "GripTech",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-clmp-1", sku: "SH-PLM-CLMP-10", diameter: "1 inch", price: 95, stock: 300 },
      { id: "v-clmp-2", sku: "SH-PLM-CLMP-15", diameter: "1.5 inch", price: 120, stock: 200 },
      { id: "v-clmp-3", sku: "SH-PLM-CLMP-20", diameter: "2 inch", price: 145, stock: 220 },
      { id: "v-clmp-4", sku: "SH-PLM-CLMP-40", diameter: "4 inch", price: 240, stock: 150 }
    ],
    technicalSpecifications: {
      material: "Galvanized mild steel with zinc coating > 8 microns",
      productType: "Two-bolt acoustic pipe clamp",
      diameter: '1" to 4"',
      operatingTemp: "-30\xB0C to +110\xB0C"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-plm-cutter",
    name: "Industrial Ratchet PVC & Plastic Pipe Cutter Shear (Up to 42mm)",
    slug: "industrial-ratchet-pvc-pipe-cutter-shear",
    category: "plumbing",
    subcategory: "Pipe Cutters & Tools",
    sku: "SH-TLS-CUT-42",
    price: 1450,
    stock: 45,
    isNew: true,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Heavy-duty ratcheting pipe cutter with hardened manganese steel blade for clean 90-degree square cuts without burrs.",
    description: "High-leverage ratcheting gear mechanism drives razor-sharp blade cleanly through PVC, PPR-C, and CPVC pipes with minimal hand fatigue. Eliminates messy plastic shavings created by hacksaws.",
    material: "Aluminum Die-Cast Body + 65Mn Steel Blade",
    diameter: 'Cuts up to 42mm (1-5/8")',
    color: "Industrial Blue / Orange Grip",
    application: "Cutting PVC, PPRC, CPVC, PEX Pipes",
    brand: "GripTech",
    images: [
      "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-cut-42", sku: "SH-TLS-CUT-42", diameter: "Up to 42mm", color: "Blue", price: 1450, stock: 30 },
      { id: "v-cut-63", sku: "SH-TLS-CUT-63", diameter: "Up to 63mm (Heavy Duty)", color: "Orange", price: 2600, stock: 15 }
    ],
    technicalSpecifications: {
      bladeHardness: "HRC 54-56 manganese steel",
      cuttingCapacity: "Pipes up to 42mm OD"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-plm-braided-hose",
    name: "Braided Stainless Steel Flexible Water Inlet Hose (24-Inch)",
    slug: "braided-stainless-steel-flexible-water-inlet-hose",
    category: "plumbing",
    subcategory: "Flexible Connection Hoses",
    sku: "SH-HOS-BRD-24",
    price: 360,
    stock: 280,
    isNew: false,
    isFeatured: false,
    isSale: false,
    isDemo: true,
    shortDescription: "Burst-proof SS304 braided flexible connector hose for bathroom basins, electric geysers, and toilet tanks.",
    description: "Corrosion proof exterior 304 stainless steel wire weave shields an inner non-toxic EPDM water core. Forged brass female hex nuts with integrated rubber washers make hand-tight leak-free connections effortless.",
    material: "Stainless Steel 304 Braid + EPDM Core + Brass Nuts",
    diameter: "1/2 inch x 1/2 inch FIP Hex Nuts",
    length: "24 inch (60 cm)",
    color: "Silver Metallic",
    application: "Geyser Hot Water Inlets, Basin Mixers, Toilet Cisterns",
    pressureRating: "PN16 (16 Bar / Burst > 50 Bar)",
    brand: "MasterFlow",
    images: [
      "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-brd-18", sku: "SH-HOS-BRD-18", diameter: '1/2" x 1/2"', length: "18 inch", color: "Silver", price: 310, stock: 150 },
      { id: "v-brd-24", sku: "SH-HOS-BRD-24", diameter: '1/2" x 1/2"', length: "24 inch", color: "Silver", price: 360, stock: 130 },
      { id: "v-brd-36", sku: "SH-HOS-BRD-36", diameter: '1/2" x 1/2"', length: "36 inch", color: "Silver", price: 460, stock: 90 }
    ],
    technicalSpecifications: {
      braidMaterial: "304 Stainless Steel Grade",
      nutMaterial: "Forged Chrome/Brass Nut",
      maxTemp: "90\xB0C Hot Water Rating"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  // ==========================================
  // 8. CONTRACTOR BULK BUNDLES
  // ==========================================
  {
    id: "prod-bulk-bundle-01",
    name: 'Master Contractor Water Line Bundle (100x 1" Class C Pipes + 50 Sockets)',
    slug: "master-contractor-water-line-bundle",
    category: "bulk-orders",
    subcategory: "Contractor Bundles",
    sku: "SH-BLK-BND-100",
    price: 84e3,
    salePrice: 79500,
    stock: 12,
    isNew: true,
    isFeatured: true,
    isSale: true,
    isDemo: true,
    shortDescription: "Complete wholesale contractor lot including 100 lengths of 1-inch Class C uPVC pipe, 50 sockets, and 2 tins of solvent cement.",
    description: "Packaged specifically for housing scheme contractors, plaza builders, and plumbing subcontractors. Bundles high-volume wholesale pricing with coordinated dispatch directly to site in Multan and surrounding districts.",
    material: "uPVC Class C Certified",
    diameter: "1 inch (25mm)",
    length: "10 ft lengths x 100 pipes",
    color: "White",
    application: "Residential Scheme Plumbing, Commercial Buildings",
    pressureRating: "Class C (9.0 Bar)",
    brand: "Standard Grade",
    images: [
      "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-blk-1", sku: "SH-BLK-BND-100", diameter: "1 inch", length: "100 lengths", color: "White", price: 79500, stock: 12 }
    ],
    technicalSpecifications: {
      bundleContents: '100x 1" Class C Pipes (10ft), 50x Sockets, 2x 500ml Solvent Cement',
      delivery: "Truck dispatch available across Multan & South Punjab"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "prod-bulk-tubewell",
    name: 'Agricultural Tubewell Pumping Lot (30x 3" Sch 40 Pipes + Foot Valve + Hose)',
    slug: "agricultural-tubewell-pumping-lot",
    category: "bulk-orders",
    subcategory: "Agricultural Pipe Lots",
    sku: "SH-BLK-AGRI-3IN",
    price: 115e3,
    stock: 8,
    isNew: false,
    isFeatured: true,
    isSale: false,
    isDemo: true,
    shortDescription: "Turnkey high-volume lot for installing heavy groundwater tubewells and centrifugal pump delivery circuits.",
    description: "Designed for agricultural farms, orchards, and tube-well installations across Punjab. Combines 30 lengths of 3-inch Schedule 40 pressure pipe, heavy spring foot valve, 20 feet of spiral suction hose, and industrial clamps.",
    material: "Schedule 40 High-Pressure uPVC",
    diameter: "3 inch (75mm)",
    color: "Industrial Grey",
    application: "Tubewell Boring, Agricultural Pumping, Lift Irrigation",
    brand: "Heavy Duty Grade",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    variants: [
      { id: "v-agri-1", sku: "SH-BLK-AGRI-3IN", diameter: "3 inch", length: "Lot", color: "Grey", price: 115e3, stock: 8 }
    ],
    technicalSpecifications: {
      bundleContents: '30x 3" Sch 40 Pipes (20ft), 1x 3" Foot Valve, 20ft 3" Suction Hose, 4x Heavy Clamps',
      pressureRating: "Sch 40 (Up to 280 PSI)"
    },
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
var initialBlogPosts = [
  {
    id: "blog-1",
    title: "PVC Pipe Selection Guide: Pressure Classes, Wall Thickness & Applications",
    slug: "pvc-pipe-selection-guide",
    excerpt: "A comprehensive technical overview of Class B, Class C, Schedule 40 and Schedule 80 uPVC piping for building and agricultural systems in Pakistan.",
    category: "Technical Guide",
    tags: ["PVC Pipes", "Pressure Rating", "Plumbing Engineering"],
    author: "Engineering Desk",
    published: true,
    readTime: "6 min read",
    content: `When designing plumbing distribution networks, choosing the exact class and wall thickness of PVC pipe determines long-term structural integrity and flow reliability.

### 1. Understanding Pipe Classification
In uPVC piping standards (such as PS:3051 and ASTM D1785), pipes are categorized by working pressure capacity at 20\xB0C:
- **Class B (6.0 Bar / ~87 PSI):** Typically designated for gravity discharge lines, low-pressure rural irrigation, or secondary channels.
- **Class C (9.0 Bar / ~130 PSI):** The baseline standard for potable cold water distribution inside residential and light commercial buildings.
- **Class D & Schedule 40:** High-strength pressure lines designed for water booster pumping stations, multistory overhead tank risers, and industrial fluid loops.
- **Schedule 80:** Extra-thick wall pipe engineered for aggressive chemical lines and extreme pressure manifolds.

### 2. Inner Diameter (ID) vs Nominal Bore
A frequent misconception is assuming that the outer diameter changes with higher pressure ratings. In standard rigid PVC, the **outside diameter remains constant** so that standard fittings can couple across sizes, while **wall thickness increases inward**, which slightly narrows the internal flow bore.

### 3. Thermal Considerations
Standard uPVC is recommended for fluids up to 50\xB0C. For continuous hot water lines, chlorinated PVC (cPVC) or polypropylene random copolymer (PPRC) must be used.`,
    createdAt: "2026-03-15T10:00:00.000Z"
  },
  {
    id: "blog-2",
    title: "Types of Pipe Fittings and How to Choose the Correct Flow Geometry",
    slug: "types-of-pipe-fittings-flow-geometry",
    excerpt: "Detailed comparison of 90-degree elbows, 45-degree sweeps, sanitary tees, and union couplings in plumbing layouts.",
    category: "Fittings & Assembly",
    tags: ["Pipe Fittings", "Elbows", "Tees", "Valves"],
    author: "Technical Desk",
    published: true,
    readTime: "5 min read",
    content: `Every bend, branch, and transition point in a pipeline represents friction and potential turbulence. Selecting the right fitting geometry is essential for maintaining hydraulic head and preventing water hammer.

### 1. 90-Degree Elbows vs 45-Degree Sweeps
Standard sharp 90-degree elbows are ideal for compact wall cavities. However, on long pump discharge lines or main sewer runs, combining two 45-degree elbows creates a gradual sweep that significantly reduces turbulence and head loss.

### 2. True Union Couplings for Inline Maintenance
Never install mechanical components such as valves, water meters, or pressure filters with fixed solvent weld couplings alone. Placing true union fittings immediately before and after equipment permits fast removal for servicing without saw-cutting pipes.

### 3. Reducer Cones vs Bushings
When stepping down line size, concentric reducer cones preserve smooth laminar flow, whereas sudden face bushings cause localized pressure drops and sediment traps in drainage lines.`,
    createdAt: "2026-03-20T12:00:00.000Z"
  },
  {
    id: "blog-3",
    title: "How Pipe Diameter Affects Water Flow Velocity and Pressure Drop",
    slug: "how-pipe-diameter-affects-water-flow",
    excerpt: "Learn the relationship between flow velocity, head loss, friction factors, and why undersized pipes create noisy plumbing and pump burn-out.",
    category: "Fluid Dynamics",
    tags: ["Water Flow", "Pipe Diameter", "Plumbing Calculations"],
    author: "Engineering Desk",
    published: true,
    readTime: "7 min read",
    content: `Fluid velocity in a pipe is inversely proportional to the square of its internal diameter. Sizing pipes too small forces water to move at excessive speeds, creating pipe erosion, hammer shocks, and low pressure at outlets.

### Recommended Flow Velocities
- **Suction lines (pump intake):** 0.7 to 1.2 meters/second to prevent pump cavitation.
- **Pressure delivery lines (internal building):** 1.2 to 2.0 meters/second for quiet operation.
- **Drainage fall:** 1:40 to 1:60 slope gradient to maintain self-cleansing velocity of suspended solids.

Contact our Multan shop team at +92-61-4540198 for sizing assistance and technical catalog inquiries.`,
    createdAt: "2026-03-24T09:30:00.000Z"
  },
  {
    id: "blog-4",
    title: "Basic Plumbing Maintenance: Preventing Leaks and Extending Pipeline Life",
    slug: "basic-plumbing-maintenance-tips",
    excerpt: "Practical maintenance checks for residential and commercial plumbing systems to avoid costly water damage and leaks.",
    category: "Maintenance",
    tags: ["Maintenance", "Leak Prevention", "Valves"],
    author: "Plumbing Desk",
    published: true,
    readTime: "4 min read",
    content: `Proactive pipeline maintenance prevents catastrophic ruptures and preserves sanitary water quality across commercial and domestic properties.

Key inspection areas:
- Check valve stems and true union seals every 6 months for slight weeping.
- Ensure overhead pipe hangers and clamps have rubber gaskets to absorb pipe vibration.
- Test main cutoff ball valves periodically so they do not seize from mineral deposits.
- Ensure solvent cement joints have cured for at least 24 hours before conducting full pressure testing.`,
    createdAt: "2026-03-26T14:15:00.000Z"
  }
];
var initialAdminUser = {
  id: "usr-admin-01",
  name: "Store Administrator",
  email: "admin@shaukatpvc.local",
  passwordHash: bcrypt.hashSync("admin123", 10),
  phone: "+92-61-4540198",
  role: "admin",
  createdAt: (/* @__PURE__ */ new Date()).toISOString()
};
var initialDemoUser = {
  id: "usr-demo-02",
  name: "Multan Contractor Demo",
  email: "customer@example.com",
  passwordHash: bcrypt.hashSync("customer123", 10),
  phone: "+92-300-1234567",
  role: "customer",
  createdAt: (/* @__PURE__ */ new Date()).toISOString()
};

// server/db.ts
var isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
var DATA_DIR = isServerless ? path.join("/tmp", "shaukat-data") : path.resolve(process.cwd(), "server/data");
var DATA_FILE = path.join(DATA_DIR, "store.json");
var DatabaseStore = class {
  constructor() {
    this.data = this.load();
  }
  load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.Products && parsed.Products.length > 0) {
          const existingIds = new Set(parsed.Products.map((p) => p.id));
          let changed = false;
          for (const initP of initialProducts) {
            if (!existingIds.has(initP.id)) {
              parsed.Products.push(initP);
              changed = true;
            }
          }
          if (parsed.Categories) {
            const existingCatIds = new Set(parsed.Categories.map((c) => c.id));
            for (const initCat of initialCategories) {
              if (!existingCatIds.has(initCat.id)) {
                parsed.Categories.push(initCat);
                changed = true;
              }
            }
          }
          if (changed) {
            fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), "utf-8");
          }
          return parsed;
        }
      }
    } catch (err) {
      console.error("Failed to load database store file, initializing fresh store:", err);
    }
    const defaultStore = {
      Users: [initialAdminUser, initialDemoUser],
      Products: initialProducts,
      Categories: initialCategories,
      Orders: [
        {
          id: "ord-1001",
          orderNumber: "SH-ORD-2026-001",
          userId: initialDemoUser.id,
          customerName: "Tariq Mehmood",
          phone: "+92-300-1234567",
          email: "customer@example.com",
          address: "Main Commercial Market, Bosan Road",
          city: "Multan",
          postalCode: "60000",
          deliveryNotes: "Please deliver to the construction site entrance.",
          items: [
            {
              productId: "prod-pvc-01",
              productName: "uPVC Class C Potable Water Supply Pipe",
              sku: "SH-PVC-C01-10FT",
              variantDetails: "1 inch / 10 ft",
              quantity: 10,
              price: 890
            },
            {
              productId: "prod-fit-01",
              productName: "90-Degree uPVC Heavy Pressure Elbow Fitting",
              sku: "SH-FIT-ELB90-10",
              variantDetails: "1 inch",
              quantity: 20,
              price: 75
            }
          ],
          subtotal: 10400,
          discount: 0,
          deliveryFee: 350,
          total: 10750,
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Pending",
          orderStatus: "Confirmed",
          createdAt: new Date(Date.now() - 864e5 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 864e5 * 1).toISOString()
        }
      ],
      Quotations: [
        {
          id: "quote-101",
          quoteNumber: "SH-RFQ-0921",
          name: "Hassan Construction Co.",
          phone: "+92-301-7654321",
          email: "hassan.builders@example.com",
          company: "Hassan Builders Multan",
          productName: "Schedule 40 High-Pressure uPVC Pipe",
          productId: "prod-pvc-02",
          quantity: "500 lengths",
          size: "3 inch & 4 inch",
          deliveryLocation: "New Multan Housing Colony Phase 2",
          message: "Need batch rate for multi-story residential plumbing riser setup.",
          status: "Quoted",
          internalNotes: "Offered 8% contractor volume discount. Waiting on final approval.",
          quotedAmount: 185e4,
          createdAt: new Date(Date.now() - 864e5 * 3).toISOString(),
          updatedAt: new Date(Date.now() - 864e5 * 2).toISOString()
        }
      ],
      BulkOrders: [
        {
          id: "bulk-01",
          bulkOrderNumber: "SH-BLK-4001",
          name: "Ahmed & Sons Contractors",
          company: "Ahmed Infrastructure Ltd",
          phone: "+92-321-9876543",
          email: "ahmed.infra@example.com",
          product: 'uPVC Class C Potable Water Pipe 1.5"',
          requiredQuantity: "1200 lengths",
          requiredSize: "1.5 inch x 20 ft",
          deliveryCity: "Multan",
          message: "Supplying a 40-unit housing scheme main water reticulation line.",
          status: "Contacted",
          internalNotes: "Contacted over phone on 25th. Dispatch logistics discussed.",
          createdAt: new Date(Date.now() - 864e5 * 4).toISOString()
        }
      ],
      Reviews: [
        {
          id: "rev-01",
          productId: "prod-pvc-01",
          productName: "uPVC Class C Potable Water Supply Pipe",
          userId: initialDemoUser.id,
          customerName: "Tariq M.",
          rating: 5,
          comment: "Consistent wall thickness and smooth bore. Joints sealed tightly with standard solvent cement.",
          isApproved: true,
          createdAt: new Date(Date.now() - 864e5 * 5).toISOString()
        }
      ],
      BlogPosts: initialBlogPosts,
      ContactMessages: [
        {
          id: "msg-01",
          name: "Kashif Ali",
          phone: "+92-312-5551234",
          email: "kashif@example.com",
          subject: "Store Hours and Product Sizing",
          message: "Inquiring if you stock 6-inch sewer pipes and rubberized couplings on site at Hassan Parnana Colony.",
          status: "replied",
          createdAt: new Date(Date.now() - 864e5 * 1).toISOString()
        }
      ],
      InventoryHistory: [
        {
          id: "inv-h-01",
          productId: "prod-pvc-01",
          productName: "uPVC Class C Potable Water Supply Pipe",
          sku: "SH-PVC-C01",
          change: 250,
          previousStock: 0,
          newStock: 250,
          reason: "Initial warehouse intake",
          timestamp: new Date(Date.now() - 864e5 * 10).toISOString()
        }
      ],
      Wishlists: {
        [initialDemoUser.id]: ["prod-pvc-01", "prod-vlv-01"]
      },
      Carts: {},
      Addresses: {
        [initialDemoUser.id]: [
          {
            id: "addr-01",
            label: "Site Office",
            address: "12-B Bosan Road Commercial Area",
            city: "Multan",
            phone: "+92-300-1234567"
          }
        ]
      },
      SiteSettings: {
        storeName: "Shaukat PVC Plastic Pipe Shop",
        category: "PVC / Plumbing",
        phone: "+92-61-4540198",
        address: "17-A Hassan Parnana Colony, Multan, Punjab, Pakistan",
        city: "Multan",
        country: "Pakistan",
        currency: "PKR",
        taxRate: 0,
        flatShippingFee: 350,
        freeShippingThreshold: 15e3
      }
    };
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(defaultStore, null, 2), "utf-8");
    } catch (e) {
      console.error("Failed writing initial database store:", e);
    }
    return defaultStore;
  }
  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error saving database store:", err);
    }
  }
  // Users
  getUsers() {
    return this.data.Users;
  }
  findUserById(id) {
    return this.data.Users.find((u) => u.id === id);
  }
  findUserByEmail(email) {
    return this.data.Users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }
  createUser(user) {
    this.data.Users.push(user);
    this.save();
    return user;
  }
  updateUser(id, updates) {
    const idx = this.data.Users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      this.data.Users[idx] = { ...this.data.Users[idx], ...updates };
      this.save();
      return this.data.Users[idx];
    }
    return void 0;
  }
  // Products
  getProducts() {
    return this.data.Products;
  }
  findProductById(id) {
    return this.data.Products.find((p) => p.id === id);
  }
  findProductBySlug(slug) {
    return this.data.Products.find((p) => p.slug === slug);
  }
  createProduct(product) {
    this.data.Products.unshift(product);
    this.data.InventoryHistory.unshift({
      id: `inv-h-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      change: product.stock,
      previousStock: 0,
      newStock: product.stock,
      reason: "Product created",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    this.save();
    return product;
  }
  updateProduct(id, updates) {
    const idx = this.data.Products.findIndex((p) => p.id === id);
    if (idx !== -1) {
      const prev = this.data.Products[idx];
      if (updates.stock !== void 0 && updates.stock !== prev.stock) {
        this.data.InventoryHistory.unshift({
          id: `inv-h-${Date.now()}`,
          productId: id,
          productName: prev.name,
          sku: prev.sku,
          change: updates.stock - prev.stock,
          previousStock: prev.stock,
          newStock: updates.stock,
          reason: "Stock level adjustment",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        });
      }
      this.data.Products[idx] = {
        ...prev,
        ...updates,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.save();
      return this.data.Products[idx];
    }
    return void 0;
  }
  deleteProduct(id) {
    const prevLen = this.data.Products.length;
    this.data.Products = this.data.Products.filter((p) => p.id !== id);
    if (this.data.Products.length !== prevLen) {
      this.save();
      return true;
    }
    return false;
  }
  // Categories
  getCategories() {
    return this.data.Categories;
  }
  createCategory(cat) {
    this.data.Categories.push(cat);
    this.save();
    return cat;
  }
  updateCategory(id, updates) {
    const idx = this.data.Categories.findIndex((c) => c.id === id);
    if (idx !== -1) {
      this.data.Categories[idx] = { ...this.data.Categories[idx], ...updates };
      this.save();
      return this.data.Categories[idx];
    }
    return void 0;
  }
  deleteCategory(id) {
    const prev = this.data.Categories.length;
    this.data.Categories = this.data.Categories.filter((c) => c.id !== id);
    if (this.data.Categories.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }
  // Orders
  getOrders() {
    return this.data.Orders;
  }
  findOrderById(id) {
    return this.data.Orders.find((o) => o.id === id || o.orderNumber === id);
  }
  getUserOrders(userId) {
    return this.data.Orders.filter((o) => o.userId === userId);
  }
  createOrder(order) {
    this.data.Orders.unshift(order);
    for (const item of order.items) {
      const prod = this.findProductById(item.productId);
      if (prod) {
        const newStock = Math.max(0, prod.stock - item.quantity);
        this.updateProduct(prod.id, { stock: newStock });
      }
    }
    this.save();
    return order;
  }
  updateOrderStatus(id, status) {
    const idx = this.data.Orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      this.data.Orders[idx].orderStatus = status;
      this.data.Orders[idx].updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      this.save();
      return this.data.Orders[idx];
    }
    return void 0;
  }
  // Quotations
  getQuotations() {
    return this.data.Quotations;
  }
  createQuotation(quote) {
    this.data.Quotations.unshift(quote);
    this.save();
    return quote;
  }
  updateQuotation(id, updates) {
    const idx = this.data.Quotations.findIndex((q) => q.id === id);
    if (idx !== -1) {
      this.data.Quotations[idx] = {
        ...this.data.Quotations[idx],
        ...updates,
        updatedAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      this.save();
      return this.data.Quotations[idx];
    }
    return void 0;
  }
  // Bulk Orders
  getBulkOrders() {
    return this.data.BulkOrders;
  }
  createBulkOrder(bulk) {
    this.data.BulkOrders.unshift(bulk);
    this.save();
    return bulk;
  }
  updateBulkOrder(id, updates) {
    const idx = this.data.BulkOrders.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.data.BulkOrders[idx] = { ...this.data.BulkOrders[idx], ...updates };
      this.save();
      return this.data.BulkOrders[idx];
    }
    return void 0;
  }
  // Reviews
  getReviews(productId, onlyApproved = true) {
    let list = this.data.Reviews;
    if (productId) {
      list = list.filter((r) => r.productId === productId);
    }
    if (onlyApproved) {
      list = list.filter((r) => r.isApproved);
    }
    return list;
  }
  createReview(rev) {
    this.data.Reviews.unshift(rev);
    this.save();
    return rev;
  }
  updateReviewStatus(id, isApproved) {
    const idx = this.data.Reviews.findIndex((r) => r.id === id);
    if (idx !== -1) {
      this.data.Reviews[idx].isApproved = isApproved;
      this.save();
      return this.data.Reviews[idx];
    }
    return void 0;
  }
  deleteReview(id) {
    const prev = this.data.Reviews.length;
    this.data.Reviews = this.data.Reviews.filter((r) => r.id !== id);
    if (this.data.Reviews.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }
  // Blog
  getBlogPosts(publishedOnly = true) {
    if (publishedOnly) {
      return this.data.BlogPosts.filter((b) => b.published);
    }
    return this.data.BlogPosts;
  }
  findBlogPostBySlug(slug) {
    return this.data.BlogPosts.find((b) => b.slug === slug);
  }
  createBlogPost(post) {
    this.data.BlogPosts.unshift(post);
    this.save();
    return post;
  }
  updateBlogPost(id, updates) {
    const idx = this.data.BlogPosts.findIndex((b) => b.id === id);
    if (idx !== -1) {
      this.data.BlogPosts[idx] = { ...this.data.BlogPosts[idx], ...updates };
      this.save();
      return this.data.BlogPosts[idx];
    }
    return void 0;
  }
  deleteBlogPost(id) {
    const prev = this.data.BlogPosts.length;
    this.data.BlogPosts = this.data.BlogPosts.filter((b) => b.id !== id);
    if (this.data.BlogPosts.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }
  // Contact Messages
  getContactMessages() {
    return this.data.ContactMessages;
  }
  createContactMessage(msg) {
    this.data.ContactMessages.unshift(msg);
    this.save();
    return msg;
  }
  updateContactMessage(id, status) {
    const idx = this.data.ContactMessages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.data.ContactMessages[idx].status = status;
      this.save();
      return this.data.ContactMessages[idx];
    }
    return void 0;
  }
  deleteContactMessage(id) {
    const prev = this.data.ContactMessages.length;
    this.data.ContactMessages = this.data.ContactMessages.filter((m) => m.id !== id);
    if (this.data.ContactMessages.length !== prev) {
      this.save();
      return true;
    }
    return false;
  }
  // Inventory History
  getInventoryHistory() {
    return this.data.InventoryHistory;
  }
  // Wishlists
  getUserWishlist(userId) {
    return this.data.Wishlists[userId] || [];
  }
  toggleWishlistItem(userId, productId) {
    const current = this.data.Wishlists[userId] || [];
    const exists = current.includes(productId);
    const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
    this.data.Wishlists[userId] = updated;
    this.save();
    return updated;
  }
  // Settings
  getSettings() {
    return this.data.SiteSettings;
  }
  updateSettings(settings) {
    this.data.SiteSettings = { ...this.data.SiteSettings, ...settings };
    this.save();
    return this.data.SiteSettings;
  }
};
var db = new DatabaseStore();

// server/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "shaukat-pvc-secure-token-secret-2026";
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.findUserById(decoded.id);
    if (!user) {
      res.status(401).json({ error: "User not found or session expired" });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
function optionalAuthenticate(req, _res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = db.findUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    } catch {
    }
  }
  next();
}
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden: Admin privilege required" });
    return;
  }
  next();
}

// server/routes.ts
var apiRouter = Router();
apiRouter.post("/auth/register", (req, res) => {
  const { name, email, password, phone } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ error: "Name, email, and password are required" });
    return;
  }
  const existing = db.findUserByEmail(email);
  if (existing) {
    res.status(400).json({ error: "An account with this email already exists" });
    return;
  }
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone ? phone.trim() : void 0,
    passwordHash: bcrypt2.hashSync(password, 10),
    role: "customer",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.createUser(newUser);
  const token = generateToken(newUser);
  res.status(201).json({
    message: "Account created successfully",
    token,
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: newUser.role
    }
  });
});
apiRouter.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }
  const user = db.findUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const match = bcrypt2.compareSync(password, user.passwordHash);
  if (!match) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }
  const token = generateToken(user);
  res.json({
    message: "Login successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});
apiRouter.get("/auth/me", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    createdAt: req.user.createdAt
  });
});
apiRouter.put("/auth/profile", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { name, phone, currentPassword, newPassword } = req.body;
  const updates = {};
  if (name) updates.name = name.trim();
  if (phone !== void 0) updates.phone = phone.trim();
  if (newPassword) {
    if (!currentPassword) {
      res.status(400).json({ error: "Current password is required to change password" });
      return;
    }
    const match = bcrypt2.compareSync(currentPassword, req.user.passwordHash);
    if (!match) {
      res.status(400).json({ error: "Current password does not match" });
      return;
    }
    updates.passwordHash = bcrypt2.hashSync(newPassword, 10);
  }
  const updated = db.updateUser(req.user.id, updates);
  res.json({
    message: "Profile updated",
    user: {
      id: updated?.id,
      name: updated?.name,
      email: updated?.email,
      phone: updated?.phone,
      role: updated?.role
    }
  });
});
apiRouter.get("/products", (req, res) => {
  let products = db.getProducts();
  const {
    category,
    subcategory,
    search,
    diameter,
    material,
    application,
    minPrice,
    maxPrice,
    inStock,
    featured,
    isNew,
    sort,
    page = "1",
    limit = "12"
  } = req.query;
  if (category && category !== "all") {
    products = products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
  }
  if (subcategory && subcategory !== "all") {
    products = products.filter((p) => p.subcategory?.toLowerCase() === String(subcategory).toLowerCase());
  }
  if (search) {
    const q = String(search).toLowerCase();
    products = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.material.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.diameter && p.diameter.toLowerCase().includes(q) || p.application && p.application.toLowerCase().includes(q)
    );
  }
  if (diameter) {
    const d = String(diameter).toLowerCase();
    products = products.filter(
      (p) => p.diameter && p.diameter.toLowerCase().includes(d) || p.variants.some((v) => v.diameter && v.diameter.toLowerCase().includes(d))
    );
  }
  if (material) {
    const m = String(material).toLowerCase();
    products = products.filter((p) => p.material.toLowerCase().includes(m));
  }
  if (application) {
    const a = String(application).toLowerCase();
    products = products.filter((p) => p.application && p.application.toLowerCase().includes(a));
  }
  if (minPrice) {
    const min = parseFloat(String(minPrice));
    products = products.filter((p) => (p.salePrice ?? p.price ?? 0) >= min);
  }
  if (maxPrice) {
    const max = parseFloat(String(maxPrice));
    products = products.filter((p) => (p.salePrice ?? p.price ?? 0) <= max);
  }
  if (inStock === "true") {
    products = products.filter((p) => p.stock > 0);
  }
  if (featured === "true") {
    products = products.filter((p) => p.isFeatured);
  }
  if (isNew === "true") {
    products = products.filter((p) => p.isNew);
  }
  if (sort === "price-asc") {
    products.sort((a, b) => (a.salePrice ?? a.price ?? 0) - (b.salePrice ?? b.price ?? 0));
  } else if (sort === "price-desc") {
    products.sort((a, b) => (b.salePrice ?? b.price ?? 0) - (a.salePrice ?? a.price ?? 0));
  } else if (sort === "newest") {
    products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }
  const total = products.length;
  const pageNum = parseInt(String(page), 10) || 1;
  const limitNum = parseInt(String(limit), 10) || 12;
  const startIndex = (pageNum - 1) * limitNum;
  const paginated = products.slice(startIndex, startIndex + limitNum);
  res.json({
    products: paginated,
    total,
    page: pageNum,
    totalPages: Math.ceil(total / limitNum)
  });
});
apiRouter.get("/products/:slug", (req, res) => {
  const { slug } = req.params;
  const product = db.findProductBySlug(slug) || db.findProductById(slug);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(product);
});
apiRouter.get("/products/related/:slug", (req, res) => {
  const { slug } = req.params;
  const current = db.findProductBySlug(slug) || db.findProductById(slug);
  if (!current) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const related = db.getProducts().filter((p) => p.id !== current.id && p.category === current.category).slice(0, 4);
  res.json(related);
});
apiRouter.get("/categories", (_req, res) => {
  const categories = db.getCategories();
  const allProducts = db.getProducts();
  const enriched = categories.map((cat) => ({
    ...cat,
    productCount: allProducts.filter((p) => p.category.toLowerCase() === cat.slug.toLowerCase()).length
  }));
  res.json(enriched);
});
apiRouter.post("/orders", optionalAuthenticate, (req, res) => {
  const {
    customerName,
    phone,
    email,
    address,
    area,
    city,
    postalCode,
    deliveryNotes,
    items
  } = req.body;
  if (!customerName || !phone || !address || !items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Missing required order fields (name, phone, address, items)" });
    return;
  }
  let subtotal = 0;
  const validItems = [];
  for (const it of items) {
    const product = db.findProductById(it.productId);
    if (!product) continue;
    let price = product.salePrice ?? product.price ?? 0;
    let variantDetails = "";
    if (it.variantId) {
      const v = product.variants.find((vr) => vr.id === it.variantId);
      if (v) {
        if (v.price) price = v.price;
        variantDetails = [v.diameter, v.length, v.color].filter(Boolean).join(" / ");
      }
    }
    const qty = Math.max(1, parseInt(it.quantity, 10) || 1);
    subtotal += price * qty;
    validItems.push({
      productId: product.id,
      productName: product.name,
      sku: it.sku || product.sku,
      variantId: it.variantId,
      variantDetails: variantDetails || void 0,
      quantity: qty,
      price,
      image: product.images[0]
    });
  }
  if (validItems.length === 0) {
    res.status(400).json({ error: "No valid products in cart" });
    return;
  }
  const deliveryFee = subtotal >= 15e3 ? 0 : 350;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;
  const orderNumber = `SH-ORD-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber,
    userId: req.user?.id,
    customerName: customerName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : req.user?.email || "",
    address: address.trim(),
    area: area ? area.trim() : void 0,
    city: city ? city.trim() : "Multan",
    postalCode: postalCode ? postalCode.trim() : void 0,
    deliveryNotes: deliveryNotes ? deliveryNotes.trim() : void 0,
    items: validItems,
    subtotal,
    discount,
    deliveryFee,
    total,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    orderStatus: "Pending",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.createOrder(newOrder);
  res.status(201).json({
    message: "Order placed successfully via Cash on Delivery",
    order: newOrder
  });
});
apiRouter.get("/orders/my-orders", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const orders = db.getUserOrders(req.user.id);
  res.json(orders);
});
apiRouter.get("/orders/:id", optionalAuthenticate, (req, res) => {
  const { id } = req.params;
  const order = db.findOrderById(id);
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  if (req.user?.role === "admin" || req.user && order.userId === req.user.id) {
    res.json(order);
    return;
  }
  res.json(order);
});
apiRouter.post("/quotations", (req, res) => {
  const {
    name,
    phone,
    email,
    company,
    product,
    productId,
    quantity,
    size,
    requiredDate,
    deliveryLocation,
    message
  } = req.body;
  if (!name || !phone || !quantity || !deliveryLocation) {
    res.status(400).json({ error: "Name, phone, quantity, and delivery location are required" });
    return;
  }
  const quoteNumber = `SH-RFQ-${Math.floor(1e3 + Math.random() * 9e3)}`;
  const newQuote = {
    id: `quote-${Date.now()}`,
    quoteNumber,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : "",
    company: company ? company.trim() : void 0,
    productName: product ? product.trim() : void 0,
    productId: productId || void 0,
    quantity,
    size: size ? size.trim() : void 0,
    requiredDate: requiredDate || void 0,
    deliveryLocation: deliveryLocation.trim(),
    message: message ? message.trim() : void 0,
    status: "New",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.createQuotation(newQuote);
  res.status(201).json({
    message: "Quotation request submitted successfully. Our team will review specifications and contact you.",
    quotation: newQuote
  });
});
apiRouter.post("/bulk-orders", (req, res) => {
  const {
    name,
    company,
    phone,
    email,
    product,
    requiredQuantity,
    requiredSize,
    deliveryCity,
    message
  } = req.body;
  if (!name || !phone || !product || !requiredQuantity || !requiredSize || !deliveryCity) {
    res.status(400).json({ error: "Please fill in all required bulk supply fields" });
    return;
  }
  const bulkOrderNumber = `SH-BLK-${Math.floor(1e3 + Math.random() * 9e3)}`;
  const newBulk = {
    id: `bulk-${Date.now()}`,
    bulkOrderNumber,
    name: name.trim(),
    company: company ? company.trim() : void 0,
    phone: phone.trim(),
    email: email ? email.trim() : "",
    product: product.trim(),
    requiredQuantity,
    requiredSize: requiredSize.trim(),
    deliveryCity: deliveryCity.trim(),
    message: message ? message.trim() : void 0,
    status: "New",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.createBulkOrder(newBulk);
  res.status(201).json({
    message: "Bulk order inquiry logged. A commercial supply representative will call you shortly.",
    bulkOrder: newBulk
  });
});
apiRouter.get("/reviews", (req, res) => {
  const { productId } = req.query;
  const reviews = db.getReviews(productId ? String(productId) : void 0, true);
  res.json(reviews);
});
apiRouter.post("/reviews", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  const { productId, rating, comment } = req.body;
  if (!productId || !rating || !comment) {
    res.status(400).json({ error: "Product ID, rating (1-5), and feedback comment are required" });
    return;
  }
  const product = db.findProductById(productId);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  const newReview = {
    id: `rev-${Date.now()}`,
    productId,
    productName: product.name,
    userId: req.user.id,
    customerName: req.user.name,
    rating: Math.min(5, Math.max(1, parseInt(rating, 10))),
    comment: comment.trim(),
    isApproved: false,
    // Moderator approval required
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.createReview(newReview);
  res.status(201).json({
    message: "Review submitted! It will appear publicly after administrative moderation.",
    review: newReview
  });
});
apiRouter.get("/wishlist", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const productIds = db.getUserWishlist(req.user.id);
  const products = productIds.map((id) => db.findProductById(id)).filter((p) => p !== void 0);
  res.json(products);
});
apiRouter.post("/wishlist/toggle", authenticate, (req, res) => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const { productId } = req.body;
  if (!productId) {
    res.status(400).json({ error: "productId is required" });
    return;
  }
  const updatedIds = db.toggleWishlistItem(req.user.id, productId);
  res.json({
    wishlist: updatedIds,
    isSaved: updatedIds.includes(productId)
  });
});
apiRouter.get("/blog", (_req, res) => {
  const posts = db.getBlogPosts(true);
  res.json(posts);
});
apiRouter.get("/blog/:slug", (req, res) => {
  const { slug } = req.params;
  const post = db.findBlogPostBySlug(slug);
  if (!post) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(post);
});
apiRouter.post("/contact", (req, res) => {
  const { name, phone, email, subject, message } = req.body;
  if (!name || !phone || !message) {
    res.status(400).json({ error: "Name, phone, and message are required" });
    return;
  }
  const newMsg = db.createContactMessage({
    id: `msg-${Date.now()}`,
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : "",
    subject: subject ? subject.trim() : void 0,
    message: message.trim(),
    status: "unread",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  });
  res.status(201).json({
    message: "Your message has been sent to Shaukat PVC Plastic Pipe Shop. We will respond promptly.",
    contactMessage: newMsg
  });
});
apiRouter.get("/admin/dashboard", authenticate, requireAdmin, (_req, res) => {
  const products = db.getProducts();
  const orders = db.getOrders();
  const quotations = db.getQuotations();
  const bulkOrders = db.getBulkOrders();
  const reviews = db.getReviews(void 0, false);
  const messages = db.getContactMessages();
  const users = db.getUsers().filter((u) => u.role === "customer");
  const totalRevenue = orders.filter((o) => o.orderStatus !== "Cancelled").reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const lowStockProducts = products.filter((p) => p.stock <= 10).length;
  const unreadMessages = messages.filter((m) => m.status === "unread").length;
  const pendingReviews = reviews.filter((r) => !r.isApproved).length;
  res.json({
    stats: {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders,
      totalCustomers: users.length,
      totalRevenue,
      totalQuotations: quotations.length,
      totalBulkOrders: bulkOrders.length,
      lowStockProducts,
      unreadMessages,
      pendingReviews
    },
    recentOrders: orders.slice(0, 5),
    recentQuotations: quotations.slice(0, 5),
    lowStockList: products.filter((p) => p.stock <= 15).slice(0, 6)
  });
});
apiRouter.post("/admin/products", authenticate, requireAdmin, (req, res) => {
  const {
    name,
    slug,
    category,
    subcategory,
    sku,
    price,
    salePrice,
    stock,
    shortDescription,
    description,
    material,
    diameter,
    length,
    color,
    application,
    pressureRating,
    brand,
    images,
    variants,
    technicalSpecifications,
    isNew,
    isFeatured,
    isSale
  } = req.body;
  if (!name || !category || !sku) {
    res.status(400).json({ error: "Name, category, and SKU are required" });
    return;
  }
  const generatedSlug = slug ? slug.toLowerCase().replace(/\s+/g, "-") : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const newProd = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    slug: generatedSlug,
    category: category.trim(),
    subcategory: subcategory ? subcategory.trim() : void 0,
    sku: sku.trim(),
    price: price ? parseFloat(price) : void 0,
    salePrice: salePrice ? parseFloat(salePrice) : void 0,
    stock: parseInt(stock, 10) || 0,
    shortDescription: shortDescription || "",
    description: description || "",
    material: material || "PVC",
    diameter,
    length,
    color,
    application,
    pressureRating,
    brand,
    images: Array.isArray(images) && images.length > 0 ? images : ["https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"],
    variants: Array.isArray(variants) ? variants : [],
    technicalSpecifications: technicalSpecifications || {},
    isNew: Boolean(isNew),
    isFeatured: Boolean(isFeatured),
    isSale: Boolean(isSale),
    isDemo: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.createProduct(newProd);
  res.status(201).json(newProd);
});
apiRouter.put("/admin/products/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const updated = db.updateProduct(id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(updated);
});
apiRouter.delete("/admin/products/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteProduct(id);
  if (!deleted) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ message: "Product deleted" });
});
apiRouter.get("/admin/inventory", authenticate, requireAdmin, (_req, res) => {
  const products = db.getProducts();
  const history = db.getInventoryHistory();
  res.json({
    inventory: products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      stock: p.stock,
      price: p.price,
      variantsCount: p.variants.length,
      status: p.stock > 10 ? "In Stock" : p.stock > 0 ? "Low Stock" : "Out of Stock"
    })),
    history: history.slice(0, 20)
  });
});
apiRouter.post("/admin/inventory/adjust", authenticate, requireAdmin, (req, res) => {
  const { productId, newStock, reason } = req.body;
  if (!productId || newStock === void 0) {
    res.status(400).json({ error: "productId and newStock are required" });
    return;
  }
  const updated = db.updateProduct(productId, { stock: parseInt(newStock, 10) });
  if (!updated) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({ message: "Stock updated", product: updated });
});
apiRouter.get("/admin/orders", authenticate, requireAdmin, (_req, res) => {
  res.json(db.getOrders());
});
apiRouter.put("/admin/orders/:id/status", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateOrderStatus(id, status);
  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json(updated);
});
apiRouter.get("/admin/quotations", authenticate, requireAdmin, (_req, res) => {
  res.json(db.getQuotations());
});
apiRouter.put("/admin/quotations/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const updated = db.updateQuotation(id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Quotation not found" });
    return;
  }
  res.json(updated);
});
apiRouter.get("/admin/bulk-orders", authenticate, requireAdmin, (_req, res) => {
  res.json(db.getBulkOrders());
});
apiRouter.put("/admin/bulk-orders/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const updated = db.updateBulkOrder(id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Bulk order not found" });
    return;
  }
  res.json(updated);
});
apiRouter.get("/admin/customers", authenticate, requireAdmin, (_req, res) => {
  const customers = db.getUsers().filter((u) => u.role === "customer");
  const orders = db.getOrders();
  const data = customers.map((c) => {
    const userOrders = orders.filter((o) => o.userId === c.id);
    const spent = userOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone || "N/A",
      orderCount: userOrders.length,
      totalSpent: spent,
      createdAt: c.createdAt
    };
  });
  res.json(data);
});
apiRouter.get("/admin/reviews", authenticate, requireAdmin, (_req, res) => {
  res.json(db.getReviews(void 0, false));
});
apiRouter.put("/admin/reviews/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { isApproved } = req.body;
  const updated = db.updateReviewStatus(id, Boolean(isApproved));
  if (!updated) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json(updated);
});
apiRouter.delete("/admin/reviews/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteReview(id);
  if (!deleted) {
    res.status(404).json({ error: "Review not found" });
    return;
  }
  res.json({ message: "Review deleted" });
});
apiRouter.get("/admin/messages", authenticate, requireAdmin, (_req, res) => {
  res.json(db.getContactMessages());
});
apiRouter.put("/admin/messages/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = db.updateContactMessage(id, status);
  if (!updated) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json(updated);
});
apiRouter.delete("/admin/messages/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteContactMessage(id);
  if (!deleted) {
    res.status(404).json({ error: "Message not found" });
    return;
  }
  res.json({ message: "Message deleted" });
});
apiRouter.get("/admin/blog", authenticate, requireAdmin, (_req, res) => {
  res.json(db.getBlogPosts(false));
});
apiRouter.post("/admin/blog", authenticate, requireAdmin, (req, res) => {
  const { title, slug, excerpt, content, category, tags, readTime, published } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: "Title and content are required" });
    return;
  }
  const generatedSlug = slug ? slug.toLowerCase().replace(/\s+/g, "-") : title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const newPost = {
    id: `blog-${Date.now()}`,
    title: title.trim(),
    slug: generatedSlug,
    excerpt: excerpt || title.slice(0, 120),
    content,
    category: category || "Plumbing Engineering",
    tags: Array.isArray(tags) ? tags : ["Plumbing", "PVC"],
    author: req.user?.name || "Technical Editor",
    published: published !== false,
    readTime: readTime || "5 min read",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  db.createBlogPost(newPost);
  res.status(201).json(newPost);
});
apiRouter.put("/admin/blog/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const updated = db.updateBlogPost(id, req.body);
  if (!updated) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json(updated);
});
apiRouter.delete("/admin/blog/:id", authenticate, requireAdmin, (req, res) => {
  const { id } = req.params;
  const deleted = db.deleteBlogPost(id);
  if (!deleted) {
    res.status(404).json({ error: "Blog post not found" });
    return;
  }
  res.json({ message: "Blog post deleted" });
});

// server/apiEntry.ts
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var healthCheck = (_req, res) => {
  res.json({
    status: "ok",
    store: "Shaukat PVC Plastic Pipe Shop API",
    phone: "+92-61-4540198",
    address: "17-A Hassan Parnana Colony, Multan, Punjab, Pakistan",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
};
app.get("/api/health", healthCheck);
app.get("/health", healthCheck);
app.use("/api", apiRouter);
app.use("/", apiRouter);
app.use((err, _req, res, _next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({ error: "Internal server error" });
});
var apiEntry_default = app;
export {
  apiEntry_default as default
};
