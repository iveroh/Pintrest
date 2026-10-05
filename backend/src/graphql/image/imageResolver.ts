const cloudinary = require("../../cloudinary");

const imageResolver = {
    Mutation: {
        deleteImage: async (parent: any, args: { public_id: string }) => {
            try {
                const result = await cloudinary.uploader.destroy(args.public_id);
                return {
                    success: result.result === 'ok' || result.result === 'not found'
                };
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
                return {
                    success: false
                };
            }
        },
        uploadImage: async (parent: any, args: { file: string }) => {
            try {
                const result = await cloudinary.uploader.upload(args.file, {
                });
                return {
                    url: result.secure_url,
                    public_id: result.public_id,
                };
            } catch (error) {
                console.error("Error uploading image to Cloudinary:", error);
                throw new Error("Failed to upload image");
            }
        }
    }
}

module.exports = { imageResolver };



