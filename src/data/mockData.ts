import {
  Product,
  ProductCategory,
  GamingService,
  Banner,
  DeliveryArea,
  Order,
  AppNotification,
  ProductReview,
  NewsArticle,
  LiveOffer,
  FlashDeal,
  Announcement,
  AppSettings,
  AppHomeController,
  AppThemeConfig,
  MediaItem,
  AdminAuditLog
} from '../types';

export const INITIAL_CATEGORIES: ProductCategory[] = [
  { id: 'cat-1', name: 'Gaming Headsets', slug: 'gaming-headsets', iconName: 'Headphones', itemCount: 6 },
  { id: 'cat-2', name: 'Controllers', slug: 'controllers', iconName: 'Gamepad2', itemCount: 5 },
  { id: 'cat-3', name: 'Mobile Controllers', slug: 'mobile-controllers', iconName: 'Smartphone', itemCount: 4 },
  { id: 'cat-4', name: 'Gaming Triggers', slug: 'gaming-triggers', iconName: 'Crosshair', itemCount: 4 },
  { id: 'cat-5', name: 'Cooling Fans', slug: 'cooling-fans', iconName: 'Fan', itemCount: 4 },
  { id: 'cat-6', name: 'Chargers & Power', slug: 'chargers', iconName: 'Zap', itemCount: 4 },
  { id: 'cat-7', name: 'USB Cables', slug: 'usb-cables', iconName: 'Cable', itemCount: 3 },
  { id: 'cat-8', name: 'Power Banks', slug: 'power-banks', iconName: 'BatteryCharging', itemCount: 3 },
  { id: 'cat-9', name: 'Phone Cases', slug: 'phone-cases', iconName: 'Shield', itemCount: 3 },
  { id: 'cat-10', name: 'Screen Protectors', slug: 'screen-protectors', iconName: 'Maximize2', itemCount: 3 },
  { id: 'cat-11', name: 'Gaming Stands', slug: 'gaming-stands', iconName: 'Laptop', itemCount: 2 },
  { id: 'cat-12', name: 'Mobile Accessories', slug: 'mobile-accessories', iconName: 'Sliders', itemCount: 3 }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'SG Viper 7.1 Surround Gaming Headset',
    category: 'Gaming Headsets',
    categorySlug: 'gaming-headsets',
    price: 4999,
    discountPrice: 4299,
    discountPercent: 14,
    stock: 28,
    rating: 4.8,
    reviewCount: 42,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-low latency wireless + wired 3.5mm gaming headset with RGB breathing light, noise-canceling detachable mic, and 50mm neodymium audio drivers tuned for competitive esports.',
    specifications: {
      'Driver Size': '50mm Neodymium',
      'Connectivity': '2.4GHz Wireless + 3.5mm Audio Jack',
      'Battery Life': 'Up to 32 Hours RGB off, 20 Hours RGB on',
      'Microphone': 'Detachable Omnidirectional ENC Mic',
      'Weight': '285 grams',
      'Compatibility': 'Mobile, PC, PS5, Xbox Series X, Nintendo Switch'
    },
    featured: true,
    bestSeller: true,
    active: true,
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'SG CryoFrost MagSafe Mobile Cooling Fan',
    category: 'Cooling Fans',
    categorySlug: 'cooling-fans',
    price: 2499,
    discountPrice: 1999,
    discountPercent: 20,
    stock: 45,
    rating: 4.9,
    reviewCount: 88,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Instant drop of up to 18°C within 60 seconds. Semiconductor Peltier thermoelectric cooling system for uninterrupted PUBG Mobile, COD Mobile, and Genshin Impact sessions.',
    specifications: {
      'Cooling Type': 'Semiconductor Peltier Thermal Block',
      'Fan Speed': '7000 RPM Ultra-Quiet Dual Bearing',
      'Attachment': 'Magnetic MagSafe + Retractable Universal Clamp',
      'Power Input': 'Type-C 5V/2A Fast Power',
      'Lighting': 'Dynamic RGB Cyber Ambient Ring'
    },
    featured: true,
    bestSeller: true,
    active: true,
    createdAt: '2025-01-12T10:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'SG Phantom Elite Wireless Mobile Controller',
    category: 'Controllers',
    categorySlug: 'controllers',
    price: 5999,
    discountPrice: 5299,
    discountPercent: 12,
    stock: 19,
    rating: 4.7,
    reviewCount: 31,
    images: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Hall Effect analog sticks with anti-drift technology, mechanical tactile microswitches, macro back paddles, and ergonomic textured non-slip grips.',
    specifications: {
      'Joysticks': 'Hall Effect Magnetic Sensors (Anti-Drift)',
      'Buttons': 'Microswitch Clicky Mechanical D-Pad & ABXY',
      'Connectivity': 'Bluetooth 5.3 + 2.4G Receiver + Type-C Wired',
      'Battery': '800mAh Rechargeable Li-Ion (18 Hours)',
      'Supported Devices': 'Android 9+, iOS 13+, PC Windows 10/11'
    },
    featured: true,
    newProduct: true,
    active: true,
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'SG PulseStrike Mechanical Gaming Triggers (Pair)',
    category: 'Gaming Triggers',
    categorySlug: 'gaming-triggers',
    price: 1499,
    discountPrice: 1199,
    discountPercent: 20,
    stock: 60,
    rating: 4.6,
    reviewCount: 54,
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Capacitive conduction pulse triggers with 4-finger and 6-finger claw gameplay support. Zero latency instant mechanical click feedback for PUBG Mobile and Free Fire.',
    specifications: {
      'Trigger Mechanism': 'Conductive Alloy Alloy Mechanical Click',
      'Clamping Width': '6.5mm - 11.5mm Thickness phones',
      'Button Count': 'Dual Trigger Buttons per side',
      'No Battery Required': 'Physical Micro-current Conduction'
    },
    bestSeller: true,
    active: true,
    createdAt: '2025-01-18T10:00:00Z'
  },
  {
    id: 'prod-5',
    name: 'SG TurboCharge 90-Degree L-Shaped USB-C Gaming Cable (2M)',
    category: 'USB Cables',
    categorySlug: 'usb-cables',
    price: 999,
    discountPrice: 799,
    discountPercent: 20,
    stock: 85,
    rating: 4.9,
    reviewCount: 96,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Right-angled 90-degree zinc alloy connector allows comfortable gaming while fast charging. Supports 66W / 100W Super Charge and heavy-duty braided Kevlar core.',
    specifications: {
      'Cable Length': '2.0 Meters (6.6 ft)',
      'Power Rating': '100W PD (20V/5A Max)',
      'Angle': '90 Degree Elbow for comfortable finger grip',
      'Material': 'Military-grade Zinc Alloy + Braided Nylon'
    },
    featured: false,
    newProduct: true,
    active: true,
    createdAt: '2025-01-20T10:00:00Z'
  },
  {
    id: 'prod-6',
    name: 'SG HyperVolt 20000mAh 65W Gaming Power Bank',
    category: 'Power Banks',
    categorySlug: 'power-banks',
    price: 7499,
    discountPrice: 6799,
    discountPercent: 9,
    stock: 14,
    rating: 4.8,
    reviewCount: 22,
    images: [
      'https://images.unsplash.com/photo-1609592426861-460b54359e1c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'High-density cyber-styled clear transparent casing power bank capable of 65W PD output. Can charge a smartphone 4 times or power a gaming laptop on the go.',
    specifications: {
      'Capacity': '20,000 mAh (74Wh)',
      'Max Power Output': '65W Power Delivery 3.0 & QC 4.0',
      'Ports': '2x USB-C In/Out + 1x USB-A 22.5W Fast Out',
      'Display': 'OLED Real-Time Wattage & Battery Percentage'
    },
    featured: true,
    bestSeller: false,
    active: true,
    createdAt: '2025-01-22T10:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'SG Apex Grip Ergonomic Mobile Gamepad Case',
    category: 'Mobile Controllers',
    categorySlug: 'mobile-controllers',
    price: 3299,
    discountPrice: 2899,
    discountPercent: 12,
    stock: 32,
    rating: 4.5,
    reviewCount: 19,
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Expandable spring-loaded gaming grip that turns any iPhone or Android phone into an ergonomic handheld console with dual side-charging cutouts.',
    specifications: {
      'Adjustment Range': '130mm - 180mm Phone Length',
      'Features': 'Integrated Foldable Kickstand, Dual Port Access',
      'Grip Texture': 'Sweat-resistant textured matte silicone'
    },
    active: true,
    createdAt: '2025-01-25T10:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'SG TrueWireless Gaming Earbuds low-latency 35ms',
    category: 'Gaming Headsets',
    categorySlug: 'gaming-headsets',
    price: 3999,
    discountPrice: 3499,
    discountPercent: 12,
    stock: 40,
    rating: 4.7,
    reviewCount: 65,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Dedicated Gaming Mode with ultra-low 35ms audio-visual synchronization, dual microphone environmental noise cancelling (ENC), and cyber mecha charging box with neon LEDs.',
    specifications: {
      'Bluetooth': 'V5.3 Ultra-Low Latency',
      'Latency': '35ms in Game Mode',
      'Battery Life': '6 Hours single charge, 28 Hours with Case',
      'Water Resistance': 'IPX5 Splash & Sweat Resistant'
    },
    bestSeller: true,
    active: true,
    createdAt: '2025-01-27T10:00:00Z'
  },
  {
    id: 'prod-9',
    name: 'SG IceArmor Shockproof Gaming Armor Case',
    category: 'Phone Cases',
    categorySlug: 'phone-cases',
    price: 1899,
    discountPrice: 1499,
    discountPercent: 21,
    stock: 50,
    rating: 4.8,
    reviewCount: 38,
    images: [
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Military standard 810G drop protection with built-in metal cooling vent plate compatible with magnetic cooling fans. Available for iPhone, Samsung Galaxy, and Xiaomi.',
    specifications: {
      'Drop Standard': 'MIL-STD-810G 12ft Drop Tested',
      'Backplate': 'Aviation-grade Aluminum Alloy Thermal Conduction Pad',
      'Bumpers': 'Honeycombed Shock-absorbent TPU Corners'
    },
    active: true,
    createdAt: '2025-02-01T10:00:00Z'
  },
  {
    id: 'prod-10',
    name: 'SG Matte Anti-Fingerprint Gaming Glass (2-Pack)',
    category: 'Screen Protectors',
    categorySlug: 'screen-protectors',
    price: 1199,
    discountPrice: 899,
    discountPercent: 25,
    stock: 75,
    rating: 4.9,
    reviewCount: 112,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Silky smooth matte micro-etched surface designed specifically for high-speed flick shots in battle royale games. Zero fingerprint oil residue and 9H scratch resistance.',
    specifications: {
      'Hardness': '9H Tempered Glass',
      'Finish': 'Anti-Glare Micro-Frosted Matte Coating',
      'Touch Response': 'Ultra-slick 0.26mm thickness, 120Hz compatible'
    },
    bestSeller: true,
    active: true,
    createdAt: '2025-02-03T10:00:00Z'
  },
  {
    id: 'prod-11',
    name: 'SG CyberStand Adjustable Aluminum Tablet & Phone Stand',
    category: 'Gaming Stands',
    categorySlug: 'gaming-stands',
    price: 2799,
    discountPrice: 2299,
    discountPercent: 18,
    stock: 25,
    rating: 4.6,
    reviewCount: 29,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Heavy duty dual-axis 360° rotating base for tablets and smartphones. Hollow heatsink cutouts ensure uninhibited airflow during intense gaming tournaments.',
    specifications: {
      'Material': 'Full CNC Machined Anodized Aluminum',
      'Rotation': '360 Degree Smooth Click Ratchet Rotation',
      'Device Support': '4.7 inch phones up to 13 inch iPads/Tablets'
    },
    active: true,
    createdAt: '2025-02-05T10:00:00Z'
  },
  {
    id: 'prod-12',
    name: 'SG GaN 65W Triple-Port Fast Wall Charger',
    category: 'Chargers & Power',
    categorySlug: 'chargers',
    price: 3699,
    discountPrice: 3199,
    discountPercent: 14,
    stock: 35,
    rating: 4.8,
    reviewCount: 47,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Gallium Nitride (GaN III) compact high-efficiency charger with 2x Type-C 65W ports and 1x USB-A port. Pakistani 2-pin EU plug with surge & over-heat protection.',
    specifications: {
      'Technology': 'GaN III Semiconductor',
      'Output': 'C1 65W, C2 30W, USB-A 22.5W',
      'Plug Standard': 'Standard Pakistan / European 2-Pin Plug'
    },
    active: true,
    createdAt: '2025-02-08T10:00:00Z'
  },
  {
    id: 'prod-13',
    name: 'SG Pro Finger Sleeves for Mobile Gaming (6-Pack)',
    category: 'Mobile Accessories',
    categorySlug: 'mobile-accessories',
    price: 699,
    discountPrice: 499,
    discountPercent: 29,
    stock: 120,
    rating: 4.9,
    reviewCount: 150,
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    ],
    description: '24-needle silver fiber seamless breathable thumb sleeves. Eliminates screen friction and prevents fingertip sweating during ranked matches.',
    specifications: {
      'Composition': '80% Superconducting Silver Fiber + 20% Spandex',
      'Sensitivity': '100% Zero Delay Touch Feedback',
      'Package': '6 Pieces in Protective Tin Box'
    },
    bestSeller: true,
    active: true,
    createdAt: '2025-02-10T10:00:00Z'
  },
  {
    id: 'prod-14',
    name: 'SG RGB Desktop Headphone Hanger with USB Hub',
    category: 'Gaming Stands',
    categorySlug: 'gaming-stands',
    price: 3299,
    discountPrice: 2699,
    discountPercent: 18,
    stock: 18,
    rating: 4.6,
    reviewCount: 17,
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Dual headphone stand with 10 dynamic RGB lighting modes, 2x USB 2.0 extension ports, and a non-skid weighted rubberized base.',
    specifications: {
      'Light Modes': '10 Modes (Breathing, Rainbow Flow, Solid)',
      'USB Hub': '2 USB 2.0 Data & Charging Ports',
      'Base': 'Weighted Metal Core with Anti-Slip Base'
    },
    active: true,
    createdAt: '2025-02-12T10:00:00Z'
  },
  {
    id: 'prod-15',
    name: 'SG StormBreeze Dual-Core Tablet Cooler Pad',
    category: 'Cooling Fans',
    categorySlug: 'cooling-fans',
    price: 3999,
    discountPrice: 3499,
    discountPercent: 13,
    stock: 22,
    rating: 4.7,
    reviewCount: 26,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Designed for iPad Mini, iPad Pro and Android gaming tablets. Large-area dual semiconductor cooling engine with live digital temperature display.',
    specifications: {
      'Surface Area': '65cm² oversized cooling plate',
      'Temperature Display': 'Digital LED Realtime Temp Sensor',
      'Power Connector': 'Type-C 9V/3A 27W Max Fast Input'
    },
    featured: true,
    active: true,
    createdAt: '2025-02-14T10:00:00Z'
  },
  {
    id: 'prod-16',
    name: 'SG Titan 6-Finger Tactical Grip & Trigger Combo',
    category: 'Gaming Triggers',
    categorySlug: 'gaming-triggers',
    price: 2199,
    discountPrice: 1799,
    discountPercent: 18,
    stock: 0, // OUT OF STOCK test case
    rating: 4.7,
    reviewCount: 33,
    images: [
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'All-in-one ergonomic gamepad grip with 4 rear physical metal triggers and built-in silent cooling fan. Flip-head 180° design for easy typing.',
    specifications: {
      'Triggers': '4 Alloy Rear Triggers for 6-Finger Operation',
      'Cooler': 'Integrated 4000 RPM Silent Fan (800mAh Battery)',
      'Status': 'Temporarily Out of Stock'
    },
    active: true,
    createdAt: '2025-02-16T10:00:00Z'
  },
  {
    id: 'prod-17',
    name: 'SG Quantum Braided Audio Adapter Type-C to 3.5mm DAC',
    category: 'Mobile Accessories',
    categorySlug: 'mobile-accessories',
    price: 1599,
    discountPrice: 1299,
    discountPercent: 19,
    stock: 45,
    rating: 4.8,
    reviewCount: 51,
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'High-res 32-bit / 384kHz Realtek DAC chip provides crystal clear directional footstep audio in PUBG & Warzone Mobile with zero background hissing.',
    specifications: {
      'DAC Chip': 'Realtek ALC5686 32-bit/384kHz Hi-Fi',
      'Wire': '8-Core Silver-Plated Oxygen Free Copper',
      'Support': 'Microphone call, in-line volume control'
    },
    active: true,
    createdAt: '2025-02-18T10:00:00Z'
  },
  {
    id: 'prod-18',
    name: 'SG Striker Telescopic Mobile Controller for Android & iOS',
    category: 'Mobile Controllers',
    categorySlug: 'mobile-controllers',
    price: 6499,
    discountPrice: 5899,
    discountPercent: 9,
    stock: 12,
    rating: 4.9,
    reviewCount: 39,
    images: [
      'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Direct Type-C plug-in latency-free connection with pass-through charging. Turn your phone into a Nintendo Switch style console with Hall Effect sticks.',
    specifications: {
      'Connection': 'Direct Type-C (Zero Bluetooth Delay)',
      'Pass-Through': 'Simultaneous fast charging while gaming',
      'Supported Apps': 'Xbox Cloud Gaming, GeForce NOW, Native Android Games'
    },
    featured: true,
    newProduct: true,
    active: true,
    createdAt: '2025-02-20T10:00:00Z'
  },
  {
    id: 'prod-19',
    name: 'SG Armor Heavy-Duty Gaming Backpack 17-Inch',
    category: 'Mobile Accessories',
    categorySlug: 'mobile-accessories',
    price: 5499,
    discountPrice: 4799,
    discountPercent: 13,
    stock: 16,
    rating: 4.8,
    reviewCount: 24,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Geometric waterproof hardshell backpack with dedicated compartments for gaming laptops, controllers, handheld consoles, cables, and power banks.',
    specifications: {
      'Shell': 'Waterproof Hard EVA Carbon Fiber Shield',
      'Capacity': '35 Liters with anti-theft hidden zippers',
      'Charging Port': 'External USB Pass-through Port'
    },
    active: true,
    createdAt: '2025-02-22T10:00:00Z'
  },
  {
    id: 'prod-20',
    name: 'SG Nova Gaming Soundbar RGB Dual Drivers',
    category: 'Gaming Headsets',
    categorySlug: 'gaming-headsets',
    price: 4499,
    discountPrice: 3899,
    discountPercent: 13,
    stock: 20,
    rating: 4.7,
    reviewCount: 34,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Compact under-monitor and tabletop Bluetooth 5.3 soundbar with dual passive radiators for deep punchy bass, rhythm-syncing RGB light bars, and AUX input.',
    specifications: {
      'Peak Power': '20W Stereo Dual Magnetic Horns',
      'Modes': 'Bluetooth 5.3, 3.5mm AUX, USB Audio, TF Card',
      'Lighting': '6 Dynamic Spectrum Sound-Reactive RGB Modes'
    },
    featured: true,
    active: true,
    createdAt: '2025-02-24T10:00:00Z'
  }
];

export const INITIAL_SERVICES: GamingService[] = [
  {
    id: 'srv-1',
    title: 'Unity Game Development',
    slug: 'unity-game-development',
    shortDescription: 'Custom 2D/3D games built from concept to production with industry-standard Unity engine.',
    description: 'Comprehensive Unity development pipeline including architectural planning, physics simulations, custom shaders, gameplay mechanics, sound integration, and multi-platform compilation.',
    startingPrice: 45000,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    technologies: ['Unity', 'C#', 'URP/HDRP', 'Blender', 'HLSL Shaders'],
    features: [
      'Clean modular C# architecture',
      '60/120 FPS high performance target',
      'Complete asset integration',
      'Source code ownership included'
    ],
    estimatedTime: '3 - 8 Weeks',
    active: true,
    category: 'Game Development'
  },
  {
    id: 'srv-2',
    title: 'Android Game Development',
    slug: 'android-game-development',
    shortDescription: 'High-performance Android mobile games optimized for all GPU chipsets and screen sizes.',
    description: 'Specialized native & engine-based Android game creation targeting Google Play Store compliance, low memory usage, Android App Bundles, and Google Play Game Services.',
    startingPrice: 35000,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    technologies: ['Android SDK', 'Unity', 'Kotlin', 'Vulkan API', 'Firebase'],
    features: [
      'Broad device compatibility (Android 8 to 15)',
      'Google Play Leaderboards & Achievements',
      'In-App Billing (IAP) & AdMob Ads integration',
      'Low APK/AAB size optimization'
    ],
    estimatedTime: '2 - 6 Weeks',
    active: true,
    category: 'Game Development'
  },
  {
    id: 'srv-3',
    title: 'iOS Game Development',
    slug: 'ios-game-development',
    shortDescription: 'Premium iOS games built for iPhone and iPad with Apple Metal graphics and Game Center.',
    description: 'Flawless iOS gameplay experiences tailored for Retina screens, Apple silicon performance, Game Center leaderboards, StoreKit in-app purchases, and App Store review pass guarantee.',
    startingPrice: 40000,
    image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=800&q=80',
    technologies: ['Swift', 'Unity', 'Metal', 'StoreKit', 'Game Center'],
    features: [
      'App Store guideline compliance guarantee',
      'Haptic feedback & Apple Pencil support',
      'Family Sharing & CloudKit saves',
      'Fluid ProMotion 120Hz display tuning'
    ],
    estimatedTime: '3 - 6 Weeks',
    active: true,
    category: 'Game Development'
  },
  {
    id: 'srv-4',
    title: 'Multiplayer Game Development',
    slug: 'multiplayer-game-development',
    shortDescription: 'Real-time networked multiplayer games with matchmaking, rooms, and authoritative servers.',
    description: 'End-to-end synchronized multiplayer infrastructure supporting PVP, co-op, team deathmatch, and turn-based games with lag compensation and cheat prevention.',
    startingPrice: 65000,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    technologies: ['Photon Quantum', 'Photon Fusion', 'Netcode for GameObjects', 'Node.js', 'WebSockets'],
    features: [
      'Sub-50ms latency synchronization',
      'Smart regional matchmaking (Asia/Europe/Americas)',
      'Server-side validation & anti-cheat hooks',
      'Scalable lobby and friend room systems'
    ],
    estimatedTime: '4 - 12 Weeks',
    active: true,
    category: 'Backend & Cloud'
  },
  {
    id: 'srv-5',
    title: 'FPS Game Development',
    slug: 'fps-game-development',
    shortDescription: 'First-person shooters with realistic weapon recoil, ballistic trajectories, and bots.',
    description: 'Adrenaline-packed FPS combat games featuring customizable gun attachments, raycast/projectile ballistics, advanced bot AI behavior trees, and intense sound staging.',
    startingPrice: 75000,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    technologies: ['Unity FPS Framework', 'C#', 'Procedural Recoil', 'NavMesh AI', 'FMOD Audio'],
    features: [
      'Procedural weapon sway, ADS, and recoil physics',
      'Smart bot AI with combat tactic state machines',
      'Kill cam, hit markers, and dynamic crosshairs',
      'Multi-weapon loadout inventories'
    ],
    estimatedTime: '6 - 14 Weeks',
    active: true,
    category: 'Game Development'
  },
  {
    id: 'srv-6',
    title: 'Battle Royale Development',
    slug: 'battle-royale-development',
    shortDescription: 'Large-scale survival battle royale games with shrinking zones and airdrop loot.',
    description: 'Massive battle royale game systems: safe zone gas/electric ring mechanics, parachuting drop systems, loot tiers, inventory management, spectator cameras, and victory ceremonies.',
    startingPrice: 95000,
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=800&q=80',
    technologies: ['Photon Fusion', 'Unity URP', 'Open World Terrain', 'LOD Streaming'],
    features: [
      'Dynamic shrinking safe zone mechanics',
      'Plane jump and parachute landing physics',
      'Procedural loot crate drops & vehicle driving',
      'Ranked tier match progression'
    ],
    estimatedTime: '8 - 16 Weeks',
    active: true,
    category: 'Game Development'
  },
  {
    id: 'srv-7',
    title: 'Firebase Integration',
    slug: 'firebase-integration',
    shortDescription: 'Cloud Firestore, Auth, Remote Config, Cloud Storage, and Push Notifications.',
    description: 'Seamless backend integration for games: player profile persistence, cross-device cloud saves, real-time dynamic leaderboards, remote game balancing variables, and push notifications.',
    startingPrice: 25000,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    technologies: ['Firebase Auth', 'Cloud Firestore', 'Cloud Functions', 'FCM', 'Remote Config'],
    features: [
      'Secure cross-device player save state sync',
      'Realtime global and friends leaderboards',
      'Live in-game remote parameter tuning',
      'Automated daily reward login trackers'
    ],
    estimatedTime: '1 - 3 Weeks',
    active: true,
    category: 'Backend & Cloud'
  },
  {
    id: 'srv-8',
    title: 'Photon Multiplayer Setup',
    slug: 'photon-multiplayer',
    shortDescription: 'Zero-downtime Photon PUN2 / Fusion / Quantum architecture for instant lobbies.',
    description: 'Expert implementation of Photon cloud networking solutions, custom room properties, custom event messaging, spectator modes, and server migration.',
    startingPrice: 30000,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    technologies: ['Photon PUN2', 'Photon Fusion', 'Photon Voice 2', 'Webhooks'],
    features: [
      'Crystal-clear in-game team voice chat',
      'Room matchmaking with custom game rules',
      'Fast state serialization with minimal network cost',
      'Automated master client handover'
    ],
    estimatedTime: '2 - 4 Weeks',
    active: true,
    category: 'Backend & Cloud'
  },
  {
    id: 'srv-9',
    title: 'Game UI/UX Design',
    slug: 'game-ui-ux',
    shortDescription: 'Futuristic, cyberpunk, fantasy, and mobile-friendly gaming interfaces and HUDs.',
    description: 'Custom tailored game UI kits: main menu screens, HUD gauges, mini-maps, inventory bags, victory screens, particle animations, and sound feedback design.',
    startingPrice: 28000,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    technologies: ['Figma', 'Photoshop', 'Unity UI Toolkit', 'DOTween', 'SVG Vector'],
    features: [
      'Dynamic responsive HUD layout for all aspect ratios',
      'Animated button press micro-interactions',
      'Iconography, typography, and texture atlases',
      'Dark premium cyber game aesthetics'
    ],
    estimatedTime: '2 - 4 Weeks',
    active: true,
    category: 'Design & Art'
  },
  {
    id: 'srv-10',
    title: '3D Game Development',
    slug: '3d-game-development',
    shortDescription: 'Full 3D environments, character rigs, physics interactions, and cinematic cutscenes.',
    description: 'Bespoke 3D game creation incorporating realistic terrain generation, physically-based materials (PBR), Ragdoll physics, inverse kinematics (IK), and dynamic lighting.',
    startingPrice: 55000,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    technologies: ['Unity 3D', 'Blender', 'Substance Painter', 'Cinemachine', 'PhysX'],
    features: [
      'High-poly to low-poly optimized 3D assets',
      'PBR texturing (Albedo, Normal, Metallic, Roughness)',
      'Cinemachine dynamic combat follow cameras',
      'Atmospheric volumetric fog and post-processing'
    ],
    estimatedTime: '5 - 12 Weeks',
    active: true,
    category: 'Game Development'
  },
  {
    id: 'srv-11',
    title: 'Game Optimization & FPS Boost',
    slug: 'game-optimization',
    shortDescription: 'Diagnose frame drops, reduce draw calls, eliminate GC allocations, and fix lag.',
    description: 'Deep profiling utilizing Unity Profiler, RenderDoc, and Memory Profiler. Texture compression (ASTC), mesh draw call batching, LOD setups, and garbage collection zeroing.',
    startingPrice: 20000,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    technologies: ['Unity Profiler', 'RenderDoc', 'Memory Profiler', 'ASTC Compression'],
    features: [
      'Draw call reduction by 50% - 80%',
      'Elimination of GC spikes during intense firefights',
      'App launch time & battery drain optimization',
      'Low-end device (2GB RAM) compatibility fix'
    ],
    estimatedTime: '1 - 2 Weeks',
    active: true,
    category: 'Support & Maintenance'
  },
  {
    id: 'srv-12',
    title: 'Game Bug Fixing & Code Review',
    slug: 'bug-fixing',
    shortDescription: 'Troubleshoot critical crashes, physics glitches, memory leaks, and broken mechanics.',
    description: 'Rapid diagnostic bug fixing service for games facing game-breaking issues, NullReference exceptions, audio desyncs, or store rejection failures.',
    startingPrice: 15000,
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80',
    technologies: ['C# Debugging', 'Git', 'Exception Logging', 'Memory Profiling'],
    features: [
      '48-Hour turnaround for emergency release bugs',
      'Comprehensive root-cause audit report',
      'Refactored clean code with zero regression',
      'Git pull request with detailed annotations'
    ],
    estimatedTime: '3 - 7 Days',
    active: true,
    category: 'Support & Maintenance'
  },
  {
    id: 'srv-13',
    title: 'Game Publishing & Store ASO',
    slug: 'game-publishing',
    shortDescription: 'Google Play & Apple App Store submission, keystore signing, and App Store Optimization.',
    description: 'Complete publishing management: digital certificate keystore generation, privacy policy creation, target SDK compliance, screenshot mockups, promotional video, and ASO keyword ranking.',
    startingPrice: 18000,
    image: 'https://images.unsplash.com/photo-1556742049-0a67e5572293?auto=format&fit=crop&w=800&q=80',
    technologies: ['Google Play Console', 'App Store Connect', 'ASO Tools', 'Keystore'],
    features: [
      'Guaranteed store acceptance and review clearance',
      'High-converting screenshots & feature graphic design',
      'Keyword optimized metadata in English & Urdu',
      'Data safety questionnaire & rating certification'
    ],
    estimatedTime: '5 - 10 Days',
    active: true,
    category: 'Support & Maintenance'
  },
  {
    id: 'srv-14',
    title: 'Long-term Game Maintenance',
    slug: 'game-maintenance',
    shortDescription: 'Monthly updates, seasonal battle pass content, new weapons, and OS compatibility.',
    description: 'Ongoing technical maintenance contracts ensuring your live game remains compatible with new iOS/Android versions, seasonal events, balance updates, and continuous player retention.',
    startingPrice: 35000,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    technologies: ['Continuous Delivery', 'Git', 'Cloud Backups', 'LiveOps'],
    features: [
      'Monthly OS compliance & security patch updates',
      'Seasonal battle pass and event content drops',
      '24/7 Server uptime monitoring & alert response',
      'Priority bug fixes and feature development'
    ],
    estimatedTime: 'Monthly Retainer',
    active: true,
    category: 'Support & Maintenance'
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    title: 'Build Your Next Game',
    subtitle: 'From Concept to Google Play & App Store by SG Maker Studio',
    badge: 'GAMING STUDIO',
    ctaText: 'Explore Studio Services',
    ctaLink: 'services',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    active: true
  },
  {
    id: 'ban-2',
    title: 'Pro Gaming Accessories',
    subtitle: 'Cooling Fans, Hall Effect Controllers & Capacitive Triggers',
    badge: 'HOT GEAR',
    ctaText: 'Shop Accessories',
    ctaLink: 'shop',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1200&q=80',
    active: true
  },
  {
    id: 'ban-3',
    title: 'Professional Game Development',
    subtitle: 'Multiplayer, Battle Royale, FPS & Firebase Cloud Systems',
    badge: 'INDUSTRY GRADE',
    ctaText: 'Request Quotation',
    ctaLink: 'services',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    active: true
  },
  {
    id: 'ban-4',
    title: 'New Gaming Arrivals',
    subtitle: 'CryoFrost MagSafe Coolers & 35ms Low Latency Earbuds',
    badge: 'NEW ARRIVALS',
    ctaText: 'View New Products',
    ctaLink: 'shop',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
    active: true
  },
  {
    id: 'ban-5',
    title: 'Express Pakistan Delivery',
    subtitle: 'Cash on Delivery in 24-48 Hours across major cities',
    badge: 'FAST DISPATCH',
    ctaText: 'Shop with COD',
    ctaLink: 'shop',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80',
    active: true
  }
];

export const INITIAL_DELIVERY_AREAS: DeliveryArea[] = [
  {
    id: 'area-1',
    country: 'Pakistan',
    province: 'Punjab',
    city: 'Lahore',
    area: 'Gulberg & DHA (Fast Track)',
    deliveryFee: 150,
    estimatedDays: '1-2 Days',
    active: true
  },
  {
    id: 'area-2',
    country: 'Pakistan',
    province: 'Sindh',
    city: 'Karachi',
    area: 'Clifton, DHA & Gulshan',
    deliveryFee: 180,
    estimatedDays: '2-3 Days',
    active: true
  },
  {
    id: 'area-3',
    country: 'Pakistan',
    province: 'Federal',
    city: 'Islamabad',
    area: 'F & G Sectors, Blue Area',
    deliveryFee: 160,
    estimatedDays: '1-2 Days',
    active: true
  },
  {
    id: 'area-4',
    country: 'Pakistan',
    province: 'Punjab',
    city: 'Rawalpindi',
    area: 'Saddar & Bahria Town',
    deliveryFee: 170,
    estimatedDays: '2-3 Days',
    active: true
  },
  {
    id: 'area-5',
    country: 'Pakistan',
    province: 'Punjab',
    city: 'Faisalabad',
    area: 'People\'s Colony & D-Ground',
    deliveryFee: 190,
    estimatedDays: '2-4 Days',
    active: true
  },
  {
    id: 'area-6',
    country: 'Pakistan',
    province: 'KPK',
    city: 'Peshawar',
    area: 'University Town & Hayatabad',
    deliveryFee: 200,
    estimatedDays: '2-4 Days',
    active: true
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'all',
    title: 'Welcome to SG Maker!',
    message: 'Pakistan\'s premier Gaming Studio and Mobile Esports Accessories store is now live with Cash on Delivery.',
    type: 'system',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'notif-2',
    userId: 'all',
    title: 'Flash Sale: 20% OFF MagSafe Coolers',
    message: 'Keep your smartphone ice-cold during competitive ranked matches with the CryoFrost cooler.',
    type: 'promo',
    read: false,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  }
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userId: 'usr-demo-1',
    userUid: 'usr-demo-1',
    userName: 'Usman Tariq',
    userHandle: 'gamer_pro_pk',
    userPhoto: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'Exceptional 7.1 audio clarity for competitive PUBG Mobile footstep tracking! The RGB breathing lights look stealthy and the detachable noise-cancelling microphone eliminates mechanical keyboard click sounds during Discord calls.',
    createdAt: '2025-02-12T12:00:00Z',
    verifiedPurchase: true,
    orderId: 'SGM-ORD-91204',
    helpfulCount: 14
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userId: 'usr-buyer-2',
    userUid: 'usr-buyer-2',
    userName: 'Hamza Khan',
    userHandle: 'hamza_esports',
    userPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'Best headset in Pakistan under 5k PKR. Delivered in Lahore via Cash on Delivery in less than 24 hours. The earcups are super breathable memory foam.',
    createdAt: '2025-02-18T16:20:00Z',
    verifiedPurchase: true,
    orderId: 'SGM-ORD-88120',
    helpfulCount: 9
  },
  {
    id: 'rev-3',
    productId: 'prod-1',
    userId: 'usr-buyer-3',
    userUid: 'usr-buyer-3',
    userName: 'Zaid Farooq',
    userHandle: 'zaid_valorant',
    userPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    rating: 4,
    comment: 'Very solid build with braided audio cable. Wireless 2.4G dongle connected immediately to my phone via OTG adapter without latency.',
    createdAt: '2025-02-25T19:40:00Z',
    verifiedPurchase: true,
    orderId: 'SGM-ORD-79401',
    helpfulCount: 5
  },
  {
    id: 'rev-4',
    productId: 'prod-4',
    userId: 'usr-demo-1',
    userUid: 'usr-demo-1',
    userName: 'Usman Tariq',
    userHandle: 'gamer_pro_pk',
    userPhoto: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'The mechanical microswitch clicks feel just like a competitive mouse click! Zero input lag and fits securely on my phone with case on. Immediate Conqueror rank boost.',
    createdAt: '2025-02-15T10:15:00Z',
    verifiedPurchase: true,
    orderId: 'SGM-ORD-91204',
    helpfulCount: 12
  },
  {
    id: 'rev-5',
    productId: 'prod-2',
    userId: 'usr-buyer-4',
    userUid: 'usr-buyer-4',
    userName: 'Bilal Riaz',
    userHandle: 'bilal_pubg',
    userPhoto: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'My phone used to thermal throttle from 90 FPS down to 45 FPS in hot summer rooms. With this MagSafe CryoFrost cooler it maintains 19°C icy surface and locked 90 FPS continuous!',
    createdAt: '2025-02-14T15:30:00Z',
    verifiedPurchase: true,
    orderId: 'SGM-ORD-77122',
    helpfulCount: 18
  },
  {
    id: 'rev-6',
    productId: 'prod-3',
    userId: 'usr-buyer-5',
    userUid: 'usr-buyer-5',
    userName: 'Shahzaib Malik',
    userHandle: 'shahzaib_apex',
    userPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    comment: 'Hall effect joysticks are insane, zero stick drift after 3 weeks of intensive testing. Connected smoothly via Bluetooth to iOS and Android.',
    createdAt: '2025-02-20T08:00:00Z',
    verifiedPurchase: true,
    orderId: 'SGM-ORD-65290',
    helpfulCount: 7
  }
];

export const INITIAL_NEWS: NewsArticle[] = [
  {
    id: 'news-1',
    newsId: 'sgm-news-101',
    title: 'SG Maker Announces Unreal Engine 5 Mobile Esports Project "Shadow Protocol"',
    shortDescription: 'Our in-house studio has begun production on a tactical 5v5 mobile hero shooter optimized for Snapdragon 8 Gen 3 and Dimensity 9300.',
    fullDescription: 'SG Maker Game Studio is thrilled to officially unveil "Shadow Protocol", our upcoming flagship title running on custom optimized Unreal Engine 5 mobile pipelines with lumen lighting baked for high-refresh 120 FPS performance on flagship Android and iOS hardware.\n\nThe project integrates Photon Quantum for deterministic peer-to-peer latency reduction, dedicated rollback netcode, and low-latency audio engine. Beta sign-ups for players in Pakistan and South Asia will open in Q3 2025.\n\nKey highlights include:\n- Native 120 FPS high-refresh mode on compatible mobile displays\n- Full support for SG Maker wireless controllers and tactile triggers\n- Competitive anti-cheat kernel protections with server-side validation\n- Custom tournament matchmaking brackets for regional gaming clans.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    category: 'SG Maker',
    author: 'Sufiyan (Founder & Lead Dev)',
    publishedAt: '2025-02-24T12:00:00Z',
    active: true,
    featured: true,
    priority: 1,
    readTimeMinutes: 4,
    tags: ['Unreal Engine 5', 'Mobile Esports', 'Game Dev', 'Pakistan Gaming']
  },
  {
    id: 'news-2',
    newsId: 'sgm-news-102',
    title: 'Thermal Throttling Solved: How Magnetic Semiconductor Cooling Extends Phone Battery Life',
    shortDescription: 'In-depth laboratory benchmark showing why active TEC cooling maintains peak 90 FPS in PUBG Mobile without battery degradation.',
    fullDescription: 'Modern flagship processors like the Snapdragon 8 Gen 2/3 and Apple A17 Pro throttle GPU clock speeds by up to 45% when internal junction temperatures cross 42°C.\n\nOur engineering team stress-tested the SG CryoFrost MagSafe cooler across 3-hour continuous gameplay sessions in ambient 34°C Pakistan summer conditions. With semiconductor cooling engaged, frame stability scored 99.4% with zero micro-stuttering and phone surface temperature stayed below 21°C.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    category: 'Technology',
    author: 'Hardware Labs',
    publishedAt: '2025-02-20T09:30:00Z',
    active: true,
    featured: false,
    priority: 2,
    readTimeMinutes: 5,
    tags: ['Cooling', 'FPS Benchmark', 'Hardware']
  },
  {
    id: 'news-3',
    newsId: 'sgm-news-103',
    title: 'Unity 6 Multiplayer Infrastructure: Why We Migrated To Distributed Cloud Servers',
    shortDescription: 'A technical deep-dive on how SG Maker builds scalable backend architectures for multiplayer Android and iOS games.',
    fullDescription: 'Scaling an online mobile game from 100 concurrent players to 50,000 requires stateless matchmaking, distributed session managers, and real-time state synchronization.\n\nIn our latest studio client project, we deployed Google Cloud Run containers paired with Firestore for instant player inventory reconciliation and WebSocket game lobbies. Explore our full client services for your upcoming studio titles.',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    category: 'Game Development',
    author: 'SG Maker Dev Team',
    publishedAt: '2025-02-18T14:15:00Z',
    active: true,
    featured: false,
    priority: 3,
    readTimeMinutes: 6,
    tags: ['Unity 6', 'Cloud Backend', 'Multiplayer']
  },
  {
    id: 'news-4',
    newsId: 'sgm-news-104',
    title: 'Nationwide Cash on Delivery Expansion to Over 150 Cities Across Pakistan',
    shortDescription: 'Orders placed before 4:00 PM are now dispatched on the same day via Leopards & TCS Express with real-time SMS tracking.',
    fullDescription: 'We are proud to announce our upgraded logistics partnership with Pakistan\'s leading courier networks. All major tech items and gaming accessories are packed in tamper-proof bubble armor and dispatched directly from our central fulfillment center.\n\nFree delivery is automatically applied on all orders exceeding Rs. 5,000 nationwide.',
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80',
    category: 'Updates',
    author: 'Logistics Operations',
    publishedAt: '2025-02-12T08:00:00Z',
    active: true,
    featured: false,
    priority: 4,
    readTimeMinutes: 3,
    tags: ['Shipping', 'COD', 'Pakistan Delivery']
  }
];

export const INITIAL_OFFERS: LiveOffer[] = [
  {
    id: 'off-1',
    offerId: 'sgm-off-mega25',
    title: 'Ramadan Gaming Arena: Flat 25% OFF',
    description: 'Enjoy 25% instant discount on all pro gaming headsets, controllers, and cooling fans using coupon code SGM25 at checkout.',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80',
    discountType: 'percentage',
    discountValue: 25,
    productIds: ['prod-1', 'prod-2', 'prod-3', 'prod-4'],
    couponCode: 'SGM25',
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-04-30T23:59:59Z',
    active: true,
    featured: true,
    terms: 'Valid on accessories above Rs. 2,000. One redemption per registered customer.'
  },
  {
    id: 'off-2',
    offerId: 'sgm-off-firstorder',
    title: 'New Player Welcome: Rs. 500 Flat Off',
    description: 'Get Rs. 500 discount on your first accessories order across Pakistan with promo code WELCOME500.',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1000&q=80',
    discountType: 'fixed',
    discountValue: 500,
    productIds: [],
    couponCode: 'WELCOME500',
    startDate: '2025-01-01T00:00:00Z',
    endDate: '2025-12-31T23:59:59Z',
    active: true,
    featured: true,
    terms: 'Minimum order amount Rs. 3,500 required.'
  },
  {
    id: 'off-3',
    offerId: 'sgm-off-bogo-sleeves',
    title: 'Buy 1 Get 1 Free: Carbon Fiber Finger Sleeves',
    description: 'Buy any 4-pack of SG Tactile Silver Fiber finger sleeves and receive an extra 4-pack absolutely free!',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
    discountType: 'bogo',
    discountValue: 100,
    productIds: ['prod-7'],
    couponCode: 'BOGOSLEEVE',
    startDate: '2025-02-10T00:00:00Z',
    endDate: '2025-03-31T23:59:59Z',
    active: true,
    featured: false,
    terms: 'Add 2 sleeves to cart to activate discount automatically.'
  },
  {
    id: 'off-4',
    offerId: 'sgm-off-gamedev-15',
    title: 'Studio Launch: 15% OFF Game Development Services',
    description: 'Special 15% promotional quote discount for indie developers and content creators commissioning custom 3D mobile games.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
    discountType: 'percentage',
    discountValue: 15,
    productIds: [],
    couponCode: 'STUDIO15',
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-06-30T23:59:59Z',
    active: true,
    featured: false,
    terms: 'Applicable upon quotation agreement.'
  }
];

export const INITIAL_FLASH_DEALS: FlashDeal[] = [
  {
    id: 'flash-1',
    dealId: 'sgm-flash-headset',
    productId: 'prod-1',
    title: 'Viper 7.1 Wireless Gaming Headset Flash Sale',
    productName: 'SG Viper 7.1 Surround Gaming Headset',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    oldPrice: 6999,
    salePrice: 4299,
    discountPercent: 38,
    stockRemaining: 7,
    maxStock: 25,
    startDate: new Date(Date.now() - 3600000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 48 hours from now
    active: true,
    category: 'Gaming Headsets'
  },
  {
    id: 'flash-2',
    dealId: 'sgm-flash-cooler',
    productId: 'prod-2',
    title: 'CryoFrost MagSafe Phone Cooler 24h Lightning Deal',
    productName: 'SG CryoFrost MagSafe Mobile Cooling Fan',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    oldPrice: 3299,
    salePrice: 1999,
    discountPercent: 39,
    stockRemaining: 12,
    maxStock: 50,
    startDate: new Date(Date.now() - 7200000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 1.5).toISOString(),
    active: true,
    category: 'Cooling Fans'
  },
  {
    id: 'flash-3',
    dealId: 'sgm-flash-controller',
    productId: 'prod-3',
    title: 'Apex Hall-Effect Mobile Grip Controller',
    productName: 'SG Apex Wireless Mobile Game Controller',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
    oldPrice: 5999,
    salePrice: 3899,
    discountPercent: 35,
    stockRemaining: 4,
    maxStock: 20,
    startDate: new Date(Date.now() - 1800000).toISOString(),
    endDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    active: true,
    category: 'Controllers'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    announcementId: 'sgm-ann-welcome',
    text: '⚡ Free Express Shipping Across Pakistan on Orders Over Rs. 5,000 | Cash on Delivery Available',
    icon: 'Truck',
    priority: 'high',
    active: true,
    type: 'Delivery notice',
    linkAction: 'shop'
  },
  {
    id: 'ann-2',
    announcementId: 'sgm-ann-studio',
    text: '🎮 Studio Bookings Open: Custom Unity & Unreal Engine Mobile Game Development for Global Clients',
    icon: 'Sparkles',
    priority: 'normal',
    active: true,
    type: 'Important announcement',
    linkAction: 'services'
  }
];

export const INITIAL_APP_SETTINGS: AppSettings = {
  appName: 'SG Maker',
  tagline: 'Gaming. Development. Technology.',
  logo: 'SG MAKER',
  supportPhone: '+92 300 1234567',
  supportEmail: 'support@sgmaker.com',
  currency: 'PKR',
  currencySymbol: 'Rs.',
  defaultCountry: 'Pakistan',
  maintenanceMode: false,
  maintenanceMessage: 'SG Maker is temporarily under scheduled maintenance to enhance gaming servers and inventory systems. We will be back online shortly!',
  minimumAppVersion: '1.0.0',
  latestVersion: '1.2.0',
  forceUpdate: false,
  updateMessage: 'A new version of SG Maker is available with enhanced flash deals and live studio project tracking.',
  updateUrl: 'https://sgmaker.com/download',
  freeDeliveryThreshold: 5000,
  defaultDeliveryFee: 150,
  minimumOrder: 500,
  codAvailable: true
};

export const INITIAL_HOME_CONTROLLER: AppHomeController = {
  sections: [
    { id: 'banners', label: 'Hero Banners Slider', visible: true, order: 1 },
    { id: 'announcements', label: 'Top Announcement Bar', visible: true, order: 2 },
    { id: 'flashDeals', label: 'Live Flash Deals (Countdown)', visible: true, order: 3 },
    { id: 'offers', label: 'Promotional Offers & Coupons', visible: true, order: 4 },
    { id: 'categories', label: 'Category Quick Scroller', visible: true, order: 5 },
    { id: 'gamingStudio', label: 'Gaming Studio Spotlight Callout', visible: true, order: 6 },
    { id: 'newProducts', label: 'New Arrivals', visible: true, order: 7 },
    { id: 'news', label: 'Latest Gaming & Tech News', visible: true, order: 8 },
    { id: 'featuredProducts', label: 'Featured Accessories', visible: true, order: 9 },
    { id: 'services', label: 'Studio Game Dev Services', visible: true, order: 10 }
  ]
};

export const INITIAL_THEME: AppThemeConfig = {
  primaryColor: '#10b981', // Emerald 500
  secondaryColor: '#06b6d4', // Cyan 500
  accentColor: '#8b5cf6', // Violet 500
  buttonStyle: 'rounded',
  cardRadius: 'large',
  mode: 'dark',
  homeBackground: 'cyber-dark',
  logo: 'SG MAKER',
  appIcon: 'Gamepad2'
};

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    title: 'Viper 7.1 Headset Studio Shot',
    url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    category: 'product',
    size: '180 KB',
    createdAt: '2025-01-10T10:00:00Z'
  },
  {
    id: 'med-2',
    title: 'CryoFrost MagSafe Cooler Thermal Test',
    url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    category: 'product',
    size: '220 KB',
    createdAt: '2025-01-12T11:00:00Z'
  },
  {
    id: 'med-3',
    title: 'Apex Controller Ergonomic Grip',
    url: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80',
    category: 'product',
    size: '260 KB',
    createdAt: '2025-01-15T14:30:00Z'
  },
  {
    id: 'med-4',
    title: 'Hero Banner: Cyberpunk Esports Arena',
    url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    category: 'banner',
    size: '410 KB',
    createdAt: '2025-01-05T09:00:00Z'
  },
  {
    id: 'med-5',
    title: 'Game Studio Workstation & Code',
    url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    category: 'service',
    size: '340 KB',
    createdAt: '2025-01-08T16:20:00Z'
  },
  {
    id: 'med-6',
    title: 'Express Delivery Logistics',
    url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=1200&q=80',
    category: 'banner',
    size: '290 KB',
    createdAt: '2025-01-09T12:10:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-1',
    adminId: 'SGM-DEV-001',
    adminName: 'Sufiyan (Developer)',
    action: 'Published News Article',
    targetType: 'News',
    targetId: 'sgm-news-101',
    timestamp: '2025-02-24T12:05:00Z',
    details: 'Published Unreal Engine 5 Mobile project announcement'
  },
  {
    id: 'log-2',
    adminId: 'SGM-DEV-001',
    adminName: 'Sufiyan (Developer)',
    action: 'Created Live Flash Deal',
    targetType: 'FlashDeal',
    targetId: 'sgm-flash-headset',
    timestamp: '2025-02-24T10:30:00Z',
    details: 'Viper 7.1 Headset 38% OFF with 7 remaining units'
  },
  {
    id: 'log-3',
    adminId: 'SGM-DEV-001',
    adminName: 'Sufiyan (Developer)',
    action: 'Updated App Settings',
    targetType: 'Settings',
    targetId: 'global-settings',
    timestamp: '2025-02-23T18:45:00Z',
    details: 'Set free delivery threshold to Rs. 5,000 across Pakistan'
  },
  {
    id: 'log-4',
    adminId: 'SGM-DEV-001',
    adminName: 'Sufiyan (Developer)',
    action: 'Created Promotional Offer',
    targetType: 'Offer',
    targetId: 'sgm-off-mega25',
    timestamp: '2025-02-22T14:10:00Z',
    details: 'Launched Ramadan 25% coupon SGM25'
  }
];
