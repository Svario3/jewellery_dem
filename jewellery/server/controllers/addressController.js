import Address from '../models/Address.js';

// @desc    Get all addresses for logged in user
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add a new shipping address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      streetAddress,
      apartment,
      landmark,
      city,
      state,
      postalCode,
      country,
      addressType,
      isDefault,
    } = req.body;

    if (!fullName || !phone || !streetAddress || !city || !state || !postalCode) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory address fields',
      });
    }

    // If marked default, unset other defaults
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    } else {
      // If first address, make it default automatically
      const count = await Address.countDocuments({ user: req.user._id });
      if (count === 0) {
        req.body.isDefault = true;
      }
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      streetAddress,
      apartment: apartment || '',
      landmark: landmark || '',
      city,
      state,
      postalCode,
      country: country || 'India',
      addressType: addressType || 'Home',
      isDefault: Boolean(req.body.isDefault),
    });

    res.status(201).json({
      success: true,
      message: 'Delivery address saved',
      address,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update shipping address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    Object.assign(address, req.body);
    const updated = await address.save();

    res.json({ success: true, message: 'Address updated', address: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete shipping address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await address.deleteOne();
    res.json({ success: true, message: 'Address removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Set address as default
// @route   PUT /api/addresses/:id/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    res.json({ success: true, message: 'Default address updated', address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
