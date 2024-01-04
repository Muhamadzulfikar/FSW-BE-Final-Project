const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dheskjcry',
  api_key: '442647698524477',
  api_secret: 'rg8mJskwO1CL_gnUjPw7z-YgiRM',
});

const uploadToCloudinary = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('File or buffer is undefined');
    }

    const base64Image = file.buffer.toString('base64');

    const result = await cloudinary.uploader.upload(`data:image/png;base64,${base64Image}`, {
      folder: 'SkillHub',
      format: 'png',
      public_id: `course_${Date.now()}_${file.originalname}`,
    });

    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
};
