import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get all products with filtering, searching, sorting and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      subCategory,
      metalType,
      minPrice,
      maxPrice,
      inStock,
      isFeatured,
      isBestseller,
      isNewArrival,
      isBridal,
      isFestive,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Search keyword across name, description, tags, metalType
    if (keyword && keyword.trim()) {
      const searchRegex = new RegExp(keyword.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { metalType: searchRegex },
        { gemstone: searchRegex },
        { sku: searchRegex },
      ];
    }

    // Category filter (by slug or ObjectId or categoryName)
    if (category && category !== 'all') {
      const catDoc = await Category.findOne({
        $or: [{ slug: category.toLowerCase() }, { name: new RegExp(category, 'i') }],
      });
      if (catDoc) {
        query.category = catDoc._id;
      } else if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      }
    }

    if (subCategory && subCategory !== 'all') {
      query.subCategory = new RegExp(subCategory, 'i');
    }

    if (metalType && metalType !== 'all') {
      query.metalType = metalType;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Stock availability
    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Flags
    if (isFeatured === 'true') query.isFeatured = true;
    if (isBestseller === 'true') query.isBestseller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;
    if (isBridal === 'true') query.isBridal = true;
    if (isFestive === 'true') query.isFestive = true;

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1, numReviews: -1 };
    else if (sort === 'popular') sortOptions = { numReviews: -1, rating: -1 };
    else if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by slug or ID
// @route   GET /api/products/:slugOrId
// @access  Public
export const getProductBySlugOrId = async (req, res) => {
  try {
    const { slugOrId } = req.params;
    let product;

    if (slugOrId.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slugOrId).populate('category', 'name slug');
    }

    if (!product) {
      product = await Product.findOne({ slug: slugOrId }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get curated products (featured, new arrivals, bestsellers)
// @route   GET /api/products/curated
// @access  Public
export const getCuratedProducts = async (req, res) => {
  try {
    const [featured, newArrivals, bestsellers, bridal] = await Promise.all([
      Product.find({ isFeatured: true }).populate('category', 'name slug').limit(8),
      Product.find({ isNewArrival: true }).populate('category', 'name slug').sort({ createdAt: -1 }).limit(8),
      Product.find({ isBestseller: true }).populate('category', 'name slug').limit(8),
      Product.find({ isBridal: true }).populate('category', 'name slug').limit(8),
    ]);

    res.json({
      success: true,
      featured,
      newArrivals,
      bestsellers,
      bridal,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get related products by category
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = async (req, res) => {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: current._id },
      $or: [
        { category: current.category },
        { subCategory: current.subCategory },
        { metalType: current.metalType },
      ],
    })
      .populate('category', 'name slug')
      .limit(4);

    res.json({ success: true, products: related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a product (Admin)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      description,
      category,
      subCategory,
      price,
      compareAtPrice,
      metalType,
      purity,
      grossWeight,
      netWeight,
      diamondWeight,
      gemstone,
      images,
      stock,
      variants,
      tags,
      isFeatured,
      isBestseller,
      isNewArrival,
      isBridal,
      isFestive,
      specifications,
    } = req.body;

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const generatedSku = sku || `AUR-${Math.floor(1000 + Math.random() * 9000)}`;

    const product = await Product.create({
      name,
      slug: generatedSlug,
      sku: generatedSku,
      description,
      category,
      subCategory: subCategory || 'Traditional',
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : 0,
      metalType: metalType || '22K Yellow Gold',
      purity: purity || '22 Karat (91.6% Pure Gold)',
      grossWeight: grossWeight || '10.0 g',
      netWeight: netWeight || '9.5 g',
      diamondWeight: diamondWeight || 'None',
      gemstone: gemstone || 'None',
      images: images && images.length ? images : [
        {
          url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
          alt: name,
          isPrimary: true,
        },
      ],
      stock: Number(stock) || 10,
      variants: variants || [],
      tags: tags || [],
      isFeatured: Boolean(isFeatured),
      isBestseller: Boolean(isBestseller),
      isNewArrival: Boolean(isNewArrival),
      isBridal: Boolean(isBridal),
      isFestive: Boolean(isFestive),
      specifications: specifications || {},
    });

    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a product (Admin)
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    Object.assign(product, req.body);
    if (req.body.stock !== undefined) {
      product.inStock = Number(req.body.stock) > 0;
    }

    const updated = await product.save();
    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a product (Admin)
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ success: true, message: 'Product removed from collection' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
