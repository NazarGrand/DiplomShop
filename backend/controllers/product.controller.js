import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // find all products
    res.json({ products });
  } catch (error) {
    console.log("Error in getAllProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const featuredProducts = await Product.find({ isFeatured: true }).lean();

    res.json(featuredProducts || []);
  } catch (error) {
    console.log("Error in getFeaturedProducts controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      images,
      image,
      category,
      specifications,
    } = req.body;

    let imageArray = [];

    if (images && Array.isArray(images) && images.length > 0) {
      const uploadPromises = images.map((img) => {
        if (img) {
          return cloudinary.uploader.upload(img, {
            folder: "products",
          });
        }
        return null;
      });

      const cloudinaryResponses = await Promise.all(uploadPromises);
      imageArray = cloudinaryResponses
        .filter((response) => response && response.secure_url)
        .map((response) => response.secure_url);
    } else if (image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
      if (cloudinaryResponse?.secure_url) {
        imageArray = [cloudinaryResponse.secure_url];
      }
    }

    if (imageArray.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      images: imageArray,
      image: imageArray[0],
      category,
      specifications: specifications || [],
    });

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in createProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imagesToDelete =
      product.images && product.images.length > 0
        ? product.images
        : product.image
        ? [product.image]
        : [];

    if (imagesToDelete.length > 0) {
      const deletePromises = imagesToDelete.map((imgUrl) => {
        if (imgUrl) {
          try {
            const publicId = imgUrl.split("/").pop().split(".")[0];
            return cloudinary.uploader.destroy(`products/${publicId}`);
          } catch (error) {
            console.log("error deleting image from cloudinary", error);
            return null;
          }
        }
        return null;
      });

      await Promise.all(deletePromises);
      console.log("deleted images from cloudinary");
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in deleteProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          images: 1,
          image: 1, // Backward compatibility
          price: 1,
        },
      },
    ]);

    res.json(products);
  } catch (error) {
    console.log("Error in getRecommendedProducts controller", error.message);
    // Check for connection errors
    if (
      error.message.includes("connection") ||
      error.message.includes("timeout") ||
      error.message.includes("ETIMEDOUT")
    ) {
      return res.status(503).json({
        message: "Service unavailable - Database connection error",
        error:
          "Cannot connect to database. Please check your MongoDB Atlas network access settings.",
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    console.log("Error in getProductById controller", error.message);
    // Check for connection errors
    if (
      error.message.includes("connection") ||
      error.message.includes("timeout") ||
      error.message.includes("ETIMEDOUT")
    ) {
      return res.status(503).json({
        message: "Service unavailable - Database connection error",
        error:
          "Cannot connect to database. Please check your MongoDB Atlas network access settings.",
      });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    console.log("Error in getProductsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const toggleFeaturedProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in toggleFeaturedProduct controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
