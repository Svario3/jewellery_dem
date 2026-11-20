// Cloudinary image upload service with safe fallback
export const uploadImageToCloudinary = async (fileBuffer, fileName, folder = 'aurelia_jewels') => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (cloudName && apiKey && apiSecret) {
    // If user provided active Cloudinary credentials
    try {
      const cloudinary = (await import('cloudinary')).v2;
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
      });

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: folder },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );
        uploadStream.end(fileBuffer);
      });
    } catch (err) {
      console.warn('Cloudinary upload failed, using fallback high-res storage:', err.message);
    }
  }

  // Graceful fallback: return high quality fine jewellery imagery or base64 data uri
  const base64Image = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
  return base64Image;
};
