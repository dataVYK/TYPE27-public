import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const REGISTER_USER = async (req, res) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(req.body.password, salt);
    const { name, email, password, money_balance } = req.body;

    const capitalizedName = capitalizeFirstLetter(name);


    const user = {
      id: uuidv4(),
      name: capitalizedName,
      email,
      password: passwordHash,
      money_balance: money_balance || 0,
      bought_tickets: []
    };

    const newUser = new User(user);
    await newUser.save();

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "User registered successfully",
      jwt_token: token,
      jwt_refresh_token: refreshToken
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const LOGIN_USER = async (req, res) => {
  try {
    const { email, password } = req.body;


    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      jwt_token: token,
      jwt_refresh_token: refreshToken
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const REFRESH_TOKEN = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(400).json({
          message: "Please login again"
        });
      }

      const newToken = jwt.sign(
        { userId: decoded.userId },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      return res.status(200).json({
        jwt_token: newToken,
        jwt_refresh_token: refresh_token
      });
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, id: 0, __v: 0 }).sort({ name: 1 });

    return res.status(200).json({
      users
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const GET_USER_BY_ID = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ id }, { password: 0, id: 0, __v: 0 });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "bought_tickets_details"
        }
      },
      {
        $project: {
          password: 0,
          id: 0,
          __v: 0,

        }
      },
      {
        $sort: { name: 1 }
      }
    ]);

    return res.status(200).json({
      users
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

export const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const { id } = req.params;

    const users = await User.aggregate([
      {
        $match: { id: id }
      },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "id",
          as: "bought_tickets_details"
        }
      },
      {
        $project: {
          password: 0,
          id: 0,
          __v: 0,
        }
      }
    ]);

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    return res.status(200).json({
      user: users[0]
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error"
    });
  }
};