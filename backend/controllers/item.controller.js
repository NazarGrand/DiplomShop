import mediaStorage from "../lib/mediaStorage.js";
import Item from "../models/item.model.js";

export const fetchAllItems = async (req, res) => {
  try {
    const items = await Item.find({});
    res.json({ products: items });
  } catch (error) {
    console.log("Error in fetchAllItems controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPromotedItems = async (req, res) => {
  try {
    const promotedItems = await Item.find({ isFeatured: true }).lean();
    res.json(promotedItems || []);
  } catch (error) {
    console.log("Error in getPromotedItems controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addNewItem = async (req, res) => {
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

    let uploadedImages = [];

    if (images && Array.isArray(images) && images.length > 0) {
      const uploadTasks = images.map((img) => {
        if (img) {
          return mediaStorage.uploader.upload(img, {
            folder: "products",
          });
        }
        return null;
      });

      const uploadResults = await Promise.all(uploadTasks);
      uploadedImages = uploadResults
        .filter((response) => response && response.secure_url)
        .map((response) => response.secure_url);
    } else if (image) {
      const uploadResult = await mediaStorage.uploader.upload(image, {
        folder: "products",
      });
      if (uploadResult?.secure_url) {
        uploadedImages = [uploadResult.secure_url];
      }
    }

    if (uploadedImages.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const newItem = await Item.create({
      name,
      description,
      price,
      images: uploadedImages,
      image: uploadedImages[0],
      category,
      specifications: specifications || [],
    });

    res.status(201).json(newItem);
  } catch (error) {
    console.log("Error in addNewItem controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }

    const imagesToRemove =
      item.images && item.images.length > 0
        ? item.images
        : item.image
        ? [item.image]
        : [];

    if (imagesToRemove.length > 0) {
      const deleteTasks = imagesToRemove.map((imgUrl) => {
        if (imgUrl) {
          try {
            const publicId = imgUrl.split("/").pop().split(".")[0];
            return mediaStorage.uploader.destroy(`products/${publicId}`);
          } catch (error) {
            console.log("error deleting image from cloudinary", error);
            return null;
          }
        }
        return null;
      });

      await Promise.all(deleteTasks);
      console.log("deleted images from cloudinary");
    }

    await Item.findByIdAndDelete(req.params.id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log("Error in removeItem controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getRecommendedItems = async (req, res) => {
  try {
    const items = await Item.aggregate([
      {
        $sample: { size: 4 },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          images: 1,
          image: 1,
          price: 1,
        },
      },
    ]);

    res.json(items);
  } catch (error) {
    console.log("Error in getRecommendedItems controller", error.message);
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

export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(item);
  } catch (error) {
    console.log("Error in getItemById controller", error.message);
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

export const getItemsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const items = await Item.find({ category });
    res.json({ products: items });
  } catch (error) {
    console.log("Error in getItemsByCategory controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const togglePromotedItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (item) {
      item.isFeatured = !item.isFeatured;
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in togglePromotedItem controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

