import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB, { closeDB } from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Address from '../models/Address.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

dotenv.config();

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Address.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();

    console.log('Seeding Royal Users...');
    const adminUser = await User.create({
      name: 'Princess Gayatri Devi',
      email: 'admin@aureliajewels.com',
      password: 'Admin@123',
      phone: '+91 98765 43210',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    });

    const customerUser = await User.create({
      name: 'Ananya Singhania',
      email: 'customer@aureliajewels.com',
      password: 'Customer@123',
      phone: '+91 98111 22334',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    });

    console.log('Seeding Categories...');
    const categoriesData = [
      {
        name: 'Necklaces',
        slug: 'necklaces',
        description: 'Majestic chokers, layered rani haars, and delicate diamond pendants crafted in pure gold and polki.',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 1,
      },
      {
        name: 'Earrings',
        slug: 'earrings',
        description: 'Exquisite jhumkis, chandbalis, drop studs, and modern solitaire earrings.',
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 2,
      },
      {
        name: 'Rings',
        slug: 'rings',
        description: 'From imperial Mughal solitaires to minimalist rose gold diamond eternity bands.',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 3,
      },
      {
        name: 'Bangles',
        slug: 'bangles',
        description: 'Intricately carved temple kadas, diamond tennis cuffs, and meenakari bangles.',
        image: 'https://images.unsplash.com/photo-1611591475155-426462719543?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 4,
      },
      {
        name: 'Bridal Jewellery',
        slug: 'bridal-jewellery',
        description: 'Grand royal trousseau sets featuring uncut polki diamonds, rubies, and Basra pearls.',
        image: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 5,
      },
      {
        name: 'Traditional Jewellery',
        slug: 'traditional-jewellery',
        description: 'Timeless Indian heritage masterworks including Temple, Kundan, and antique South Indian pieces.',
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 6,
      },
      {
        name: 'Modern Jewellery',
        slug: 'modern-jewellery',
        description: 'Sleek, contemporary diamond and rose gold designs curated for everyday poise.',
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 7,
      },
      {
        name: 'Fashion Accessories',
        slug: 'fashion-accessories',
        description: 'Royal maang tikkas, ornate waist kamarbandhs, and diamond brooches.',
        image: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&w=800&q=80',
        bannerImage: 'https://images.unsplash.com/photo-1611591475155-426462719543?auto=format&fit=crop&w=1600&q=80',
        displayOrder: 8,
      },
    ];

    const categories = await Category.insertMany(categoriesData);
    const catMap = {};
    categories.forEach((c) => {
      catMap[c.slug] = c._id;
    });

    console.log('Seeding Fine Jewellery Products...');
    const productsData = [
      {
        name: 'The Maharani Imperial Polki Choker',
        slug: 'the-maharani-imperial-polki-choker',
        sku: 'AUR-NK-101',
        description: 'Handcrafted in 22 Karat antique gold, this masterwork features radiant syndicate uncut Polki diamonds complemented by natural Colombian emerald droplets and South Sea pearl tumbles. Fit for royalty.',
        category: catMap['necklaces'],
        categoryName: 'Necklaces',
        subCategory: 'Bridal',
        price: 185000,
        compareAtPrice: 215000,
        metalType: '22K Yellow Gold',
        purity: '22 Karat (91.6% Pure Hallmarked Gold)',
        grossWeight: '46.80 g',
        netWeight: '38.20 g',
        diamondWeight: '8.40 cts Uncut Syndicate Polki',
        gemstone: 'Zambian Emerald Drops & Basra Pearls',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80', alt: 'Imperial Polki Choker Front', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80', alt: 'Choker Craftsmanship Detail', isPrimary: false },
        ],
        stock: 4,
        variants: [{ name: 'Adjustable Dori Length', options: ['Standard 14-18 inch', 'Extended 16-20 inch'] }],
        tags: ['choker', 'polki', 'bridal', 'emerald', 'traditional', '22k'],
        isFeatured: true,
        isBestseller: true,
        isBridal: true,
        isFestive: true,
        rating: 5.0,
        numReviews: 12,
        specifications: {
          dimensions: 'Choker Band Width: 3.2 cm | Hanging drops: 4.5 cm',
          claspType: 'Handwoven pure zari gold cord with sliding bead',
          occasion: 'Weddings, Receptions, Grand Milestones',
          warranty: 'BIS Hallmarked with Lifetime Complimentary Cleaning & Certificate of Authenticity',
        },
      },
      {
        name: 'Aurelia Solitaire Diamond Drop Earrings',
        slug: 'aurelia-solitaire-diamond-drop-earrings',
        sku: 'AUR-ER-202',
        description: 'Immaculately cut VVS1 brilliant diamonds cascading in 18 Karat white and rose gold. Designed to catch light with every turn of the head.',
        category: catMap['earrings'],
        categoryName: 'Earrings',
        subCategory: 'Modern',
        price: 74500,
        compareAtPrice: 88000,
        metalType: '18K Rose Gold',
        purity: '18 Karat (75.0% Fine Gold)',
        grossWeight: '8.60 g',
        netWeight: '8.10 g',
        diamondWeight: '1.25 cts (VVS-VS Clarity, E-F Color)',
        gemstone: 'Natural Conflict-free Diamonds',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80', alt: 'Diamond Drop Earrings', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80', alt: 'Earring Profile View', isPrimary: false },
        ],
        stock: 8,
        variants: [{ name: 'Metal Color', options: ['Rose Gold', 'White Gold', 'Yellow Gold'] }],
        tags: ['earrings', 'diamond', 'modern', 'solitaire', 'cocktail'],
        isFeatured: true,
        isNewArrival: true,
        rating: 4.9,
        numReviews: 8,
        specifications: {
          dimensions: 'Length: 4.2 cm | Width: 0.8 cm',
          claspType: 'Secure Omega Back with Push Lock',
          occasion: 'Evening Soirées, Cocktail Parties, Luxury Gifting',
          warranty: 'IGI Certified Diamonds & Lifetime Free Polishing',
        },
      },
      {
        name: 'Noor Jahan Royal Kundan Meenakari Jhumkas',
        slug: 'noor-jahan-royal-kundan-meenakari-jhumkas',
        sku: 'AUR-ER-203',
        description: 'Traditional heritage Rajasthani craftsmanship featuring intricate enamel peacock motifs on reverse and tiered pearl drops suspended from 22K gold domes.',
        category: catMap['earrings'],
        categoryName: 'Earrings',
        subCategory: 'Traditional',
        price: 62000,
        compareAtPrice: 72000,
        metalType: '22K Yellow Gold',
        purity: '22 Karat (91.6% Pure Gold)',
        grossWeight: '24.30 g',
        netWeight: '21.50 g',
        diamondWeight: '2.10 cts Kundan Jadau',
        gemstone: 'Basra Seed Pearls & Pink Tourmalines',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80', alt: 'Kundan Jhumkas', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=80', alt: 'Meenakari Detail', isPrimary: false },
        ],
        stock: 5,
        variants: [{ name: 'Enamel Shade', options: ['Imperial Red & Green', 'Midnight Blue & Gold'] }],
        tags: ['jhumka', 'kundan', 'meenakari', 'traditional', 'festive'],
        isBestseller: true,
        isFestive: true,
        rating: 4.9,
        numReviews: 14,
        specifications: {
          dimensions: 'Length: 6.5 cm | Dome Diameter: 2.8 cm',
          claspType: 'Bombay Screw Back with Safety Latch',
          occasion: 'Diwali, Sangeet, Festive Celebrations',
          warranty: 'BIS Hallmarked Gold with Lifetime Authentication',
        },
      },
      {
        name: 'The Crown Solitaire Diamond Ring',
        slug: 'the-crown-solitaire-diamond-ring',
        sku: 'AUR-RG-301',
        description: 'A 1.5 carat cushion-cut solitaire diamond embraced by a crown of pavé set round diamonds on an 18K solid yellow gold band. A statement of timeless love.',
        category: catMap['rings'],
        categoryName: 'Rings',
        subCategory: 'Modern',
        price: 142000,
        compareAtPrice: 165000,
        metalType: '18K Yellow Gold',
        purity: '18 Karat Hallmarked Gold',
        grossWeight: '5.40 g',
        netWeight: '4.95 g',
        diamondWeight: '1.80 cts Total (1.5 ct Center + 0.3 ct Pavé)',
        gemstone: 'Triple Excellent Cut Natural Diamond',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80', alt: 'Crown Solitaire Ring', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80', alt: 'Crown Ring Angle', isPrimary: false },
        ],
        stock: 6,
        variants: [{ name: 'Ring Size (Indian)', options: ['12', '14', '16', '18', '20'] }],
        tags: ['ring', 'solitaire', 'diamond', 'engagement', 'modern'],
        isFeatured: true,
        isBestseller: true,
        rating: 5.0,
        numReviews: 19,
        specifications: {
          dimensions: 'Band Width: 2.2 mm | Center Setting: 8 mm high',
          claspType: '6-Prong Royal Crown Setting',
          occasion: 'Engagement, Anniversary, Luxury Milestone',
          warranty: 'GIA / IGI Laser Inscribed Certificate & Lifetime Resizing',
        },
      },
      {
        name: 'Padmavati Heritage Antique Temple Kada',
        slug: 'padmavati-heritage-antique-temple-kada',
        sku: 'AUR-BG-401',
        description: 'Sculpted in pure 22K gold by hereditary Chettinad artisans, this antique kada features the divine motifs of Goddess Lakshmi flanked by sacred elephants.',
        category: catMap['bangles'],
        categoryName: 'Bangles',
        subCategory: 'Traditional',
        price: 135000,
        compareAtPrice: 155000,
        metalType: '22K Yellow Gold',
        purity: '22 Karat (91.6% Pure Gold)',
        grossWeight: '38.50 g',
        netWeight: '37.80 g',
        diamondWeight: 'None',
        gemstone: 'Burmese Pigeon Blood Rubies',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1611591475155-426462719543?auto=format&fit=crop&w=1000&q=80', alt: 'Antique Temple Kada', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1000&q=80', alt: 'Temple Carving Detail', isPrimary: false },
        ],
        stock: 3,
        variants: [{ name: 'Bangle Size', options: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'] }],
        tags: ['bangle', 'kada', 'temple', 'antique', '22k', 'traditional'],
        isFeatured: true,
        isBridal: true,
        rating: 4.8,
        numReviews: 7,
        specifications: {
          dimensions: 'Width: 2.4 cm | Hand-chiseled high relief',
          claspType: 'Hinged Opening with Screw Pin Lock',
          occasion: 'Weddings, Temple Poojas, Cultural Milestones',
          warranty: 'Lifetime Gold Purity Assurance & Free Polish',
        },
      },
      {
        name: 'Celestial Diamond Tennis Bracelet',
        slug: 'celestial-diamond-tennis-bracelet',
        sku: 'AUR-BG-402',
        description: 'A continuous river of sixty-four round brilliant diamonds meticulously prong-set in lustrous 18 Karat white gold. Fluid, comfortable, and eternal.',
        category: catMap['bangles'],
        categoryName: 'Bangles',
        subCategory: 'Modern',
        price: 168000,
        compareAtPrice: 195000,
        metalType: '18K White Gold',
        purity: '18 Karat Fine Gold',
        grossWeight: '14.20 g',
        netWeight: '12.80 g',
        diamondWeight: '4.50 cts (VS Clarity, F-G Color)',
        gemstone: 'Conflict-Free Natural Diamonds',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&w=1000&q=80', alt: 'Diamond Tennis Bracelet', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1611591475155-426462719543?auto=format&fit=crop&w=1000&q=80', alt: 'Tennis Bracelet Clasp', isPrimary: false },
        ],
        stock: 7,
        variants: [{ name: 'Wrist Length', options: ['6.5 inches', '7.0 inches', '7.5 inches'] }],
        tags: ['bracelet', 'diamond', 'modern', 'tennis', 'white gold'],
        isNewArrival: true,
        isFeatured: true,
        rating: 5.0,
        numReviews: 11,
        specifications: {
          dimensions: 'Width: 3.5 mm | Length: 7.0 inches',
          claspType: 'Double Safety Box Lock with Side Latches',
          occasion: 'Daily Luxury, Black Tie Galas, Anniversary Gifts',
          warranty: 'Diamond Grading Certificate & Free Yearly Inspection',
        },
      },
      {
        name: 'The Royal Rajputana Bridal Trousseau Set',
        slug: 'the-royal-rajputana-bridal-trousseau-set',
        sku: 'AUR-BD-501',
        description: 'The crowning glory for any royal bride. A magnificent ensemble comprising a majestic multi-tier Polki necklace, matching chandbali earrings, an ornate maang tikka, and a delicate nose ring.',
        category: catMap['bridal-jewellery'],
        categoryName: 'Bridal Jewellery',
        subCategory: 'Bridal',
        price: 495000,
        compareAtPrice: 580000,
        metalType: '22K Yellow Gold',
        purity: '22 Karat (91.6% Pure Gold)',
        grossWeight: '142.50 g',
        netWeight: '118.20 g',
        diamondWeight: '22.80 cts Syndicate Polki & Rose Cuts',
        gemstone: 'Fine Basra Pearls & Russian Emerald Beads',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1000&q=80', alt: 'Complete Rajputana Bridal Set', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?auto=format&fit=crop&w=1000&q=80', alt: 'Bridal Set Box Presentation', isPrimary: false },
        ],
        stock: 2,
        variants: [{ name: 'Gemstone Drop Choice', options: ['Zambian Emerald Drops', 'Kashmiri Ruby Drops', 'Basra Pearl Bunches'] }],
        tags: ['bridal', 'trousseau', 'polki', 'royal', 'set', 'wedding'],
        isFeatured: true,
        isBridal: true,
        isBestseller: true,
        rating: 5.0,
        numReviews: 6,
        specifications: {
          dimensions: 'Includes Grand Choker + Long Haar + Matching Earrings + Maang Tikka',
          claspType: 'Handmade pure zari adjustable cords with gem finials',
          occasion: 'Wedding Day, Royal Gala',
          warranty: 'Lifetime Exchange, Dedicated Concierge, Insured Armored Delivery',
        },
      },
      {
        name: 'Kasu Mala Antique Gold Temple Long Necklace',
        slug: 'kasu-mala-antique-gold-temple-long-necklace',
        sku: 'AUR-TR-601',
        description: 'An ancient South Indian heritage treasure adorned with embossed gold coins depicting Goddess Lakshmi, alternating with cabochon rubies and finished in antique nagas technique.',
        category: catMap['traditional-jewellery'],
        categoryName: 'Traditional Jewellery',
        subCategory: 'Traditional',
        price: 210000,
        compareAtPrice: 240000,
        metalType: '22K Yellow Gold',
        purity: '22 Karat (91.6% Pure Gold)',
        grossWeight: '58.00 g',
        netWeight: '55.20 g',
        diamondWeight: 'None',
        gemstone: 'Natural Unheated Burma Rubies',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=1000&q=80', alt: 'Kasu Mala Antique Gold', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=80', alt: 'Coin Detail', isPrimary: false },
        ],
        stock: 5,
        variants: [{ name: 'Chain Length', options: ['24 inches', '28 inches'] }],
        tags: ['kasu mala', 'temple', 'antique', 'traditional', 'south indian', '22k'],
        isBestseller: true,
        isFestive: true,
        rating: 4.9,
        numReviews: 10,
        specifications: {
          dimensions: 'Total Length: 26 inches | Coin diameter: 18 mm',
          claspType: 'Heavy Traditional S-Hook',
          occasion: 'Weddings, Temple Festivities, Varalakshmi Vratham',
          warranty: 'BIS Hallmarked Gold Certificate',
        },
      },
      {
        name: 'The Modern Lumina Station Diamond Pendant',
        slug: 'the-modern-lumina-station-diamond-pendant',
        sku: 'AUR-MD-701',
        description: 'Sleek, minimalist and sophisticated. Seven bezel-set round brilliant diamonds gently float on an ultra-delicate 18K rose gold cable chain for understated everyday opulence.',
        category: catMap['modern-jewellery'],
        categoryName: 'Modern Jewellery',
        subCategory: 'Modern',
        price: 38500,
        compareAtPrice: 46000,
        metalType: '18K Rose Gold',
        purity: '18 Karat Rose Gold',
        grossWeight: '4.80 g',
        netWeight: '4.65 g',
        diamondWeight: '0.65 cts (VS-SI Clarity, G Color)',
        gemstone: 'Natural Diamonds',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80', alt: 'Lumina Diamond Station Pendant', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=80', alt: 'Chain Close Up', isPrimary: false },
        ],
        stock: 14,
        variants: [{ name: 'Chain Length', options: ['16 inch + 2 inch extender', '18 inch + 2 inch extender'] }],
        tags: ['necklace', 'pendant', 'modern', 'rose gold', 'diamond', 'everyday'],
        isNewArrival: true,
        isFeatured: true,
        rating: 4.8,
        numReviews: 9,
        specifications: {
          dimensions: 'Chain thickness: 1.1 mm | Diamond bezels: 4.2 mm',
          claspType: 'Lobster Claw with Hallmarked Tag',
          occasion: 'Executive Office Wear, Casual Brunches, Gifting',
          warranty: '1 Year Warranty on Chain & Lifetime Authenticity',
        },
      },
      {
        name: 'Chandrika Royal Jadau Polki Maang Tikka',
        slug: 'chandrika-royal-jadau-polki-maang-tikka',
        sku: 'AUR-AC-801',
        description: 'An ethereal crescent-shaped forehead jewel featuring uncut polki diamonds encircled by natural freshwater pearls and ruby beads. Complements festive braids and elegant bridal buns.',
        category: catMap['fashion-accessories'],
        categoryName: 'Fashion Accessories',
        subCategory: 'Bridal',
        price: 45000,
        compareAtPrice: 52000,
        metalType: '22K Yellow Gold',
        purity: '22 Karat Gold',
        grossWeight: '16.40 g',
        netWeight: '14.10 g',
        diamondWeight: '1.90 cts Kundan Polki',
        gemstone: 'Basra Seed Pearls & Rubies',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?auto=format&fit=crop&w=1000&q=80', alt: 'Royal Maang Tikka Front', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80', alt: 'Tikka Craftsmanship Detail', isPrimary: false },
        ],
        stock: 5,
        variants: [{ name: 'Bead Color', options: ['Basra Pearl White', 'Emerald Green', 'Ruby Crimson'] }],
        tags: ['maang tikka', 'polki', 'bridal', 'accessories', 'traditional'],
        isBridal: true,
        isFestive: true,
        rating: 4.9,
        numReviews: 5,
        specifications: {
          dimensions: 'Tikka Medallion: 3.8 cm | Chain: 12 cm',
          claspType: 'Gold Hairpin Hook with secure grip',
          occasion: 'Weddings, Sangeet, Karwa Chauth',
          warranty: 'BIS Hallmarked with Velvet Presentation Box',
        },
      },
      {
        name: 'Vedic Peacock Meenakari Kada Bangle',
        slug: 'vedic-peacock-meenakari-kada-bangle',
        sku: 'AUR-BG-403',
        description: 'A masterpiece in 22 Karat gold featuring double peacock heads meeting at the crest, adorned with hand-painted blue and green meenakari and sparkling polki diamonds.',
        category: catMap['bangles'],
        categoryName: 'Bangles',
        subCategory: 'Traditional',
        price: 98000,
        compareAtPrice: 115000,
        metalType: '22K Yellow Gold',
        purity: '22 Karat (91.6% Pure Gold)',
        grossWeight: '28.20 g',
        netWeight: '26.50 g',
        diamondWeight: '1.40 cts Polki',
        gemstone: 'Persian Blue Enamel & Rubies',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=1000&q=80', alt: 'Meenakari Peacock Kada', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1611591475155-426462719543?auto=format&fit=crop&w=1000&q=80', alt: 'Peacock Head Detail', isPrimary: false },
        ],
        stock: 6,
        variants: [{ name: 'Size', options: ['2.4', '2.6', '2.8'] }],
        tags: ['bangle', 'meenakari', 'peacock', 'kundan', 'traditional'],
        isFestive: true,
        isFeatured: true,
        rating: 4.8,
        numReviews: 8,
        specifications: {
          dimensions: 'Width: 1.8 cm | Peacock Crest: 2.2 cm',
          claspType: 'Screw-lock mechanism with safety chain',
          occasion: 'Festivals, Weddings, Family Heirlooms',
          warranty: 'Hallmarked & Lifetime Repolishing Support',
        },
      },
      {
        name: 'The Empress Emerald & Diamond Cocktail Ring',
        slug: 'the-empress-emerald-diamond-cocktail-ring',
        sku: 'AUR-RG-302',
        description: 'An alluring 2.8 carat octagonal Zambian emerald haloed by two tiers of tapered diamond baguettes and brilliant rounds, mounted in solid 18K white gold.',
        category: catMap['rings'],
        categoryName: 'Rings',
        subCategory: 'Modern',
        price: 118000,
        compareAtPrice: 135000,
        metalType: '18K White Gold',
        purity: '18 Karat White Gold',
        grossWeight: '7.80 g',
        netWeight: '6.90 g',
        diamondWeight: '1.60 cts (VVS Clarity, E-F Color)',
        gemstone: '2.80 cts Natural Certified Zambian Emerald',
        hallmarkCertified: true,
        images: [
          { url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1000&q=80', alt: 'Emerald Cocktail Ring', isPrimary: true },
          { url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=80', alt: 'Ring Side View', isPrimary: false },
        ],
        stock: 4,
        variants: [{ name: 'Ring Size', options: ['12', '14', '16', '18'] }],
        tags: ['ring', 'emerald', 'cocktail', 'diamond', 'white gold'],
        isFeatured: true,
        isNewArrival: true,
        rating: 5.0,
        numReviews: 7,
        specifications: {
          dimensions: 'Emerald: 9 mm x 7 mm | Total Face: 16 mm x 14 mm',
          claspType: '4-Prong Basket Setting with Double Gallery',
          occasion: 'Cocktail Receptions, Anniversary, High Society Galas',
          warranty: 'Gemmological Institute Certification Included',
        },
      },
    ];

    const products = await Product.insertMany(productsData);

    console.log('Seeding Sample Addresses...');
    const sampleAddress = await Address.create({
      user: customerUser._id,
      fullName: 'Ananya Singhania',
      phone: '+91 98111 22334',
      streetAddress: 'Flat 14B, The Oberoi Sky Heights, Juhu Tara Road',
      apartment: 'Tower 2, 14th Floor',
      landmark: 'Near Prithvi Theatre',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400049',
      country: 'India',
      addressType: 'Home',
      isDefault: true,
    });

    console.log('Seeding Sample Orders & Reviews...');
    const sampleOrder1 = await Order.create({
      orderNumber: 'AUR-2026-789012',
      user: customerUser._id,
      orderItems: [
        {
          product: products[1]._id,
          name: products[1].name,
          image: products[1].images[0].url,
          price: products[1].price,
          quantity: 1,
          selectedVariant: 'Rose Gold',
          sku: products[1].sku,
        },
      ],
      shippingAddress: {
        fullName: sampleAddress.fullName,
        phone: sampleAddress.phone,
        streetAddress: sampleAddress.streetAddress,
        apartment: sampleAddress.apartment,
        landmark: sampleAddress.landmark,
        city: sampleAddress.city,
        state: sampleAddress.state,
        postalCode: sampleAddress.postalCode,
        country: sampleAddress.country,
      },
      paymentMethod: 'Online_Razorpay',
      paymentResult: {
        id: 'pay_sim_9918237128',
        status: 'captured',
        update_time: new Date().toISOString(),
        razorpay_order_id: 'order_sim_881726',
        razorpay_payment_id: 'pay_sim_9918237128',
      },
      itemsPrice: 74500,
      shippingPrice: 0,
      taxPrice: 2235,
      discountPrice: 0,
      totalPrice: 76735,
      isPaid: true,
      paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      isDelivered: true,
      deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      orderStatus: 'Delivered',
      statusTimeline: [
        { status: 'Placed', note: 'Order placed online', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { status: 'Processing', note: 'Payment verified & authenticated', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) },
        { status: 'Dispatched', note: 'Handed over to insured armored courier', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) },
        { status: 'Delivered', note: 'Securely delivered to customer', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      ],
    });

    // Sample review
    await Review.create({
      product: products[1]._id,
      user: customerUser._id,
      name: customerUser.name,
      rating: 5,
      title: 'Breathtaking brilliance and velvet packaging!',
      comment: 'The earrings arrived in an opulent wooden presentation box with complete IGI certification. The diamonds catch every ray of light. Truly royal quality!',
      verifiedPurchase: true,
      isApproved: true,
    });

    console.log('✅ Seed completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Admin Demo Credentials:    admin@aureliajewels.com / Admin@123');
    console.log('Customer Demo Credentials: customer@aureliajewels.com / Customer@123');
    console.log('----------------------------------------------------');

    const isDirectRun = process.argv[1] && process.argv[1].endsWith('seeder.js');
    if (isDirectRun && process.argv[2] !== '--no-exit') {
      await closeDB();
      process.exit(0);
    }
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seeder.js')) {
  seedData();
}

export default seedData;
