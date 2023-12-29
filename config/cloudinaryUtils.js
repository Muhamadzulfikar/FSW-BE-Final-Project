const cloudinary = require('cloudinary').v2;
const Datauri = require('datauri/parser');
const path = require('path');

const parser = new Datauri();

module.exports = {

  async uploadToCloudinary(imageData) {
    try {
      // Konfigurasi Cloudinary
      cloudinary.config({
        cloud_name: 'dheskjcry',
        api_key: '442647698524477',
        api_secret: 'rg8mJskwO1CL_gnUjPw7z-YgiRM',
      });

      // Ubah buffer ke data URI
      const dataUri = parser.format('.jpg', imageData.buffer);

      // Upload data URI ke Cloudinary
      const result = await cloudinary.uploader.upload(dataUri.content, {
        folder: 'SkillHub',
      });

      // Mengembalikan URL aman dari Cloudinary
      return result.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  },
};
