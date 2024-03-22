import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "../utils/authUtils.js";
import JWT from "jsonwebtoken";

//Register Controller
export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //Regular Expression For Email, Password & Phone
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    const phoneRegex = /^\d{10}$/;

    // Check if any field is missing
    if (!name || !email || !password || !phone || !address || !answer) {
      return res.send({ message: "Please fill in all fields" });
    }

    // Check individual field validations
    if (!name.trim()) {
      return res.send({ message: "Name is required" });
    }

    if (!emailRegex.test(email)) {
      return res.send({ message: "Please enter a valid email address" });
    }

    if (!passwordRegex.test(password)) {
      return res.send({
        message:
          "Password must be between 6 to 20 characters and contain at least one numeric digit, one uppercase and one lowercase letter",
      });
    }

    if (!phoneRegex.test(phone)) {
      return res.send({
        message: "Please enter a valid 10-digit phone number",
      });
    }

    if (!address.trim()) {
      return res.send({ message: "Address is required" });
    }

    if (!answer.trim()) {
      return res.send({ message: "Answer is required" });
    }

    //Checking User
    const existingUser = await userModel.findOne({ email });

    //Set Existing User
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register Please Proceed For Login",
      });
    }

    //Register User
    const hashedPassword = await hashPassword(password);

    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registraion Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//Login Controller
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    //Check User
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Email is not register" });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res
        .status(201)
        .send({ success: false, message: "Invalid Password" });
    }

    //Token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//Forgot Password Controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }

    //Check user
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user?._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong",
      error,
    });
  }
};

//Test Controller
export const testController = (req, res) => {
  res.send("Protected Routes");
};

//Update User Profile Controller
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({
        error:
          "Password is required and must 6 character long and must be unique",
      });
    }

    // Check if password meets complexity requirements
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;
    if (password && !password.match(passwordRegex)) {
      return res.status(400).json({
        error:
          "Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, one special character, and must be at least 6 characters long",
      });
    }

    //Password Hashing
    const hashedPassword = password ? await hashPassword(password) : undefined;

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong In Update User Profile Controller",
      error,
    });
  }
};

//Get User Orders Controller
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong In Users Order",
      error,
    });
  }
};

//Admin Get All Orders Controller
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//Order Status Controller
export const orderStatusCOntroller = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something Went Wrong in order status controller",
      error,
    });
  }
};
