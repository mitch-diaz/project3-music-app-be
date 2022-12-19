const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  // cloudinary: cloudinary,
  cloudinary,
  params: {
    format: async (req, file) =>'jpeg' || 'jpg' || 'png' || 'mp3' || 'mp4' || 'wav',
    // allowed_formats: ['jpg', 'jpeg', 'png', 'mp3', 'mp4', 'wav'],
    folder: 'music-app-project', // The name of the folder in cloudinary
    // resource_type: 'video', // this is in case you want to upload other type of files, not just images
    public_id: (req, file) => file.originalname,
  }
});

//                     storage: storage
module.exports = multer({ storage });
