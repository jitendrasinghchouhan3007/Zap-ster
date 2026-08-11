import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();


cloudinary.config({ 
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUDNAIRY_API_KEY ,
  api_secret:process.env.CLOUDNAIRY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    } finally {
    
        fs.unlink(localFilePath, (err) => {
            if (err) {
                console.error("Error deleting local file:", err);
            }
        });
    }
}


const deleteFromCloudinary = async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  };

  

export { uploadOnCloudinary , deleteFromCloudinary};
