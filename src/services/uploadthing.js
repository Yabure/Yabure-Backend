const { createUploadthing } = require('uploadthing/fastify')

const f = createUploadthing()

const uploadRouter = {
    imageUploader: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 4,
        },
    }).onUploadComplete((data) => {
        console.log("upload completed", data);
    })
}

module.exports = uploadRouter;