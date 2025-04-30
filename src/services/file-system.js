const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const authService = require("./auth.service");

const bucketName = process.env.AWS_BUCKET_NAME;

// Create S3 client
const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  }
});

const fileSystem = {};

fileSystem.uploadFile = async (folder, file) => {
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${
    file.mimetype.split("/")[1]
  }`;

  const uploadParams = {
    Bucket: bucketName,
    Key: `${folder}/${fileName}`,
    Body: file._buf,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    return `https://${bucketName}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${folder}/${fileName}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};

fileSystem.deleteFile = async (folder, name) => {
  const fileName = await fileSystem.getFileName(name);
  const deleteParams = {
    Bucket: bucketName,
    Key: `${folder}/${fileName}`,
  };

  try {
    const command = new DeleteObjectCommand(deleteParams);
    return s3Client.send(command);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
};

fileSystem.getFileName = async (url) => {
  return url.split("/").pop();
};

fileSystem.uploadImage = async (image) => {
  try {
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(image.filename).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(image.mimetype);
    if (!(mimetype && extname)) {
      throw new Error("file type not supported", 400);
    }
    const url = await fileSystem.uploadFile("profile", image);
    const fileName = await fileSystem.getFileName(url);
    return fileName;
  } catch (error) {
    throw new Error("Couldn't upload picture at this time");
  }
};

fileSystem.uploadBook = async (file) => {
  try {
    const filetypes = /pdf|epub/;
    // Check ext
    const extname = filetypes.test(path.extname(file.filename).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (!(mimetype && extname)) {
      throw new Error("file type not supported");
    }
    const url = await fileSystem.uploadFile("books", file);
    const fileName = await fileSystem.getFileName(url);
    return fileName;
  } catch (error) {
    throw new Error(error.message || "Failed to upload book", 500);
  }
};

fileSystem.uploadCoverPhoto = async (image) => {
  try {
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(image.filename).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(image.mimetype);
    if (!(mimetype && extname)) {
      throw new Error("file type not supported", 400);
    }
    const url = await fileSystem.uploadFile("books/coverPhoto", image);
    const fileName = await fileSystem.getFileName(url);
    return fileName;
  } catch (error) {
    throw new Error(error.message || "Failed to upload cover photo", 500);
  }
};

fileSystem.uploadAudio = async (file) => {
  try {
    const filetypes = /aac|wma|wav|mp3|mpeg|mp4|m4a/;
    // Check ext
    const extname = filetypes.test(path.extname(file.filename).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    if (!(mimetype && extname)) {
      throw new Error("file type not supported", 400);
    }
    const url = await fileSystem.uploadFile("audio", file);
    const fileName = await fileSystem.getFileName(url);
    return fileName;
  } catch (error) {
    throw new Error(error.message || "Failed to upload audio");
  }
};

module.exports = fileSystem;
