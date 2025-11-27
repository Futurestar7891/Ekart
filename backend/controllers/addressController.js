import User from "../models/User.js";

export const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
   console.log(req.body);
  user.addresses.push(req.body);

  await user.save();

  res.json(user);
};

export const deleteAddress = async (req, res) => {
  const user = await User.findById(req.user._id);

  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== req.params.id
  );

  await user.save();

  res.json(user);
};
