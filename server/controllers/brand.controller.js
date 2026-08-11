import slugify from "slugify";
import { Brand } from "../models/brand.model.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

export const allBrands = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10 ;
    const skip = (page - 1) * limit;

    const brands = await Brand.find({}).skip(skip).limit(limit);
  const total = await Brand.countDocuments();
    res.status(200).send({
      success: true,
      message: "All Brands List",
      totalBrands : total,
      brands,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while getting all Brands",
    });
  }
};

export const getSingleBrand = async (req, res) => {
  try {
    const brand = await Brand.findOne({ slug: req.params.slug });

    if(!brand){
      return res.status(200).send({
        success: false,
        message: "Brand not Exisits",
      });
    }
    res.status(200).send({
      success: true,
      message: "fetch successfully",
      brand,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error While getting Single Brand",
    });
  }
};



//Admin Access
export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Name is required" });
    }
    if (!req.file) {
      return res.status(400).send({ message: "Image is required" });
    }
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(409).send({
        success: false,
        message: "Brand Already Exisits",
      });
    }
     // Handle file upload
     const imageLocalPath = req.file.path;
     const cloudinaryResponse = await uploadOnCloudinary(imageLocalPath);
 
     if (!cloudinaryResponse) {
       return res.status(500).send({
         success: false,
         message: "Error uploading image to Cloudinary",
       });
     }
    const imageUrl = cloudinaryResponse.secure_url;

    const brand = await new Brand({
      name,
      slug: slugify(name),
      image: imageUrl,
    }).save();

    res.status(201).send({
      success: true,
      message: "new Brand created",
      brand
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error creating in Brand",
    });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (name) {
      const existingBrandWithName = await Brand.findOne({ name, _id: { $ne: id } });
      if (existingBrandWithName) {
        return res.status(400).json({
          success: false,
          message: "Brand name already exists",
        });
      }
    }
    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, slug : slugify(name) },
      { new: true, runValidators: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({
        success: false,
        message: "Brand not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Brand updated successfully",
      brand: updatedBrand,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update brand",
      error: error.message,
    });
  }
};

export const deleteBrand = async (req, res) => {
    try {
      const { id } = req.params;

      const deletedBrand = await Brand.findById({_id:id});
  
      if (!deletedBrand) {
        return res.status(404).json({
          success: false,
          message: "Brand not found",
        });
      }

       // Delete Image from Cloudinary
       if (deletedBrand.image) {
        const publicId = deletedBrand.image.split("/").pop().split(".")[0];
        await deleteFromCloudinary(publicId);
      }
      // Delete user from database
      await Brand.findByIdAndDelete({ _id: id });
  
  
      res.status(200).json({
        success: true,
        message: "Brand deleted successfully",
        brand: deletedBrand,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete Brand",
        error: error.message,
      });
    }
  };


