const cloudinary = require('cloudinary').v2;
// eslint-disable-next-line import/no-unresolved
const Datauri = require('datauri/parser');
// const path = require('path');

// Membuat objek Datauri
const parser = new Datauri();

module.exports = {
  async uploadToCloudinary(imageData) {
    try {
      // Konfigurasi Cloudinary
      cloudinary.config({
        cloud_name: 'your_cloud_name',
        api_key: 'your_api_key',
        api_secret: 'your_api_secret',
      });

      // Ubah buffer gambar ke data URI
      const dataUri = parser.format('.jpg', imageData.buffer);

      // Upload data URI ke Cloudinary
      const result = await cloudinary.uploader.upload(dataUri.content, {
        folder: 'SkillHub', // Menyimpan gambar di dalam folder 'SkillHub'
      });

      // Mengembalikan URL aman dari Cloudinary
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  },
};
