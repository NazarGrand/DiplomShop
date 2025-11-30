import Item from "../models/item.model.js";
import Customer from "../models/customer.model.js";

export const fetchCartItems = async (req, res) => {
  try {
    const items = await Item.find({ _id: { $in: req.user.cartItems } });

    const cartItems = items.map((item) => {
      const cartItem = req.user.cartItems.find(
        (cartItem) => cartItem.id === item.id
      );
      return { ...item.toJSON(), quantity: cartItem.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    console.log("Error in fetchCartItems controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    console.log("Error in addItemToCart controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const clearCartItems = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((item) => item.id !== productId);
    }
    await user.save();
    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const changeItemQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const existingItem = user.cartItems.find((item) => item.id === productId);

    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter((item) => item.id !== productId);
        await user.save();
        return res.json(user.cartItems);
      }

      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.log("Error in changeItemQuantity controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
