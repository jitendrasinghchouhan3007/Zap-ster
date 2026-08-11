import { Address } from "../models/address.model.js";
import { User } from "../models/user.model.js";

export const createAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      name,
      locality,
      street,
      city,
      state,
      postalCode,
      phoneNumber,
      addressType,
    } = req.body;

    const requiredFields = {
      name,
      locality,
      street,
      city,
      state,
      postalCode,
      phoneNumber,
      addressType,
    };
    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          error: `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`,
        });
      }
    }

    if (!["Home", "Work"].includes(addressType)) {
      return res
        .status(400)
        .json({ error: "Address type must be either 'Home' or 'Work'" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const newAddress = new Address({
      name,
      locality,
      street,
      city,
      state,
      postalCode,
      phoneNumber,
      addressType,
    });
    const savedAddress = await newAddress.save();

    user.addresses.push(savedAddress._id);
    await user.save();

    res.status(201).json({
      message: "Address created successfully",
      address: savedAddress,
      user
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the address" });
  }
};

export const getUserAddresses = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("addresses");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const deletedAddress = await Address.findByIdAndDelete(addressId);
    if (!deletedAddress)
      return res.status(404).json({ message: "Address not found" });

    await User.updateMany(
      { addresses: addressId },
      { $pull: { addresses: addressId } }
    );

    res.status(200).json({ message: "Address deleted and removed from user" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
