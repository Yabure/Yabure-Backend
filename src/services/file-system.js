const S3 = require('aws-sdk/clients/s3')
const path = require("path");
// const fs = require("fs")
const authService = require('./auth.service')

const bucketName = process.env.AWS_BUCKET_NAME

const s3 = new S3({
 region:  process.env.AWS_BUCKET_REGION,
 secretAccessKey: process.env.AWS_SECRET_KEY,
 accessKeyId: process.env.AWS_ACCESS_KEY,
})

const fileSystem = {}

fileSystem.uploadFile = async (folder, file) => {
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${file.mimetype.split("/")[1]}`
   
    const uploadParams = {
        Bucket: `${bucketName}/${folder}`,
        Body: file._buf,
        Key: fileName,
        ContentType: file.mimetype
    }

    const { Location } = await s3.upload(uploadParams).promise();
    return Location
}

fileSystem.deleteFile = async (folder, name) => {
    const fileName = await fileSystem.getFileName(name)
 
    const uploadParams = {
        Bucket: `${bucketName}/${folder}`,
        Key: fileName
    }
    return s3.deleteObject(uploadParams).promise();
  };

fileSystem.getFileName = async (url) => {
    return url.split("/")[4]
}

fileSystem.uploadImage = async (image) => {
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(image.filename).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(image.mimetype);
  
    if (!(mimetype && extname)) {
      throw new Error("file type not supported", 400);
    }


    const url = await fileSystem.uploadFile("profile", image)
    const fileName = fileSystem.getFileName(url)
    return fileName
};

fileSystem.uploadBook = async (file) => {
  console.log("eeee", file)
  try {
    const filetypes = /pdf|epub/;
    // Check ext
    const extname = filetypes.test(path.extname(file.filename).toLowerCase());
    console.log("worked after file path", extname)
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
    console.log("worked after file path", mimetype)
  
    if (!(mimetype && extname)) {
      console.log("worked after file mime", mimetype)
      throw new Error("file type not supported");
    }


    const url = await fileSystem.uploadFile("books", file)
    console.log("worked after url", url)
    const fileName = await fileSystem.getFileName(url)
    console.log("worked")
    return fileName
  }catch(error) {
    console.log(error)
    throw new Error(error, 500)
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
  
  
    const url = await fileSystem.uploadFile("audio", file)
    const fileName = await fileSystem.getFileName(url)
    return fileName

  }catch(error) {
    console.log(error)
    throw new Error(error)
  }
  // console.log("eeee", file)
}

module.exports =  fileSystem
