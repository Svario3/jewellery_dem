import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    categoryName: {
      type: String,
      default: '',
    },
    subCategory: {
      type: String,
      default: 'Traditional',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    metalType: {
      type: String,
      enum: [
        '22K Yellow Gold',
        '18K Yellow Gold',
        '18K Rose Gold',
        '18K White Gold',
        'Platinum 950',
        '925 Sterling Silver',
        'Kundan & Polki',
      ],
      default: '22K Yellow Gold',
    },
    purity: {
      type: String,
      default: '22 Karat (91.6% Pure Gold)',
    },
    grossWeight: {
      type: String,
      default: '12.45 g',
    },
    netWeight: {
      type: String,
      default: '11.80 g',
    },
    diamondWeight: {
      type: String,
      default: '0.45 cts (VVS-VS Clarity, EF Color)',
    },
    gemstone: {
      type: String,
      default: 'Natural Zambian Emeralds & Basra Cultured Pearls',
    },
    hallmarkCertified: {
      type: Boolean,
      default: true,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: 'Aurélia Fine Jewellery' },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 10,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    variants: [
      {
        name: { type: String, required: true },
        options: [{ type: String, required: true }],
      },
    ],
    tags: [{ type: String }],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    isBridal: {
      type: Boolean,
      default: false,
    },
    isFestive: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.9,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    specifications: {
      dimensions: { type: String, default: 'Length: 16 inches + adjustable links' },
      claspType: { type: String, default: 'Traditional Gold S-Hook / Lobster' },
      occasion: { type: String, default: 'Bridal, Weddings, Grand Festivals' },
      warranty: { type: String, default: 'Lifetime authenticity certification and free maintenance' },
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre('save', function (next) {
  this.inStock = this.stock > 0;
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    this.discountPercentage = Math.round(
      ((this.compareAtPrice - this.price) / this.compareAtPrice) * 100
    );
  }
  next();
});

const Product = mongoose.model('Product', productSchema);
export default Product;
