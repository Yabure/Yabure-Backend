const S3 = require('aws-sdk/clients/s3')
const path = require("path");
const fs = require("fs")
const authService = require('./auth.service')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const secretAccessKey = process.env.AWS_SECRET_KEY
const accessKeyId = process.env.AWS_ACCESS_KEY

const s3 = new S3({
 region,
 secretAccessKey,
 accessKeyId
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

module.exports =  fileSystem
