import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError, ApiResponse } from "../utils/api.js";
import { sendEmail } from "../utils/sendEmail.js";

export const signup = async (req, res, next) => {
  const { firstName, lastName, email, password, phone, role, yourFirstSchool } =
    req.body;

  try {
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ApiError(400, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role,
      yourFirstSchool,
      isVerified: false,
    });

    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    const verificationLink = `${
      process.env.BASE_URL
    }/verify-email?token=${encodeURIComponent(verificationToken)}`;

    const signupEmailBody = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
              font-size: 24px;
              text-align: center;
            }
            p {
              color: #555;
              font-size: 16px;
              line-height: 1.5;
            }
            .cta-button {
              display: block;
              width: 100%;
              max-width: 200px;
              margin: 20px auto;
              padding: 12px;
              background-color: #2d87f0;
              color: white;
              text-align: center;
              font-size: 16px;
              text-decoration: none;
              border-radius: 5px;
            }
            .cta-button:hover {
              background-color: #1e70c3;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Our Platform!</h1>
            <p>Hi ${firstName},</p>
            <p>Thank you for signing up. To complete your registration, please verify your email by clicking the link below:</p>
            <a href="${verificationLink}" class="cta-button">Verify Email</a>
            <p>If you didn't sign up, please ignore this email.</p>
            <p>Best regards,<br/>QuickDoc</p>
          </div>
        </body>
      </html>
    `;

    
    await sendEmail(email, "Verify Your Email", signupEmailBody);

    res.status(201).json(
      new ApiResponse(201, {
        message: "User created successfully. Please verify your email.",
      })
    );
  } catch (error) {
    next(new ApiError(500, "Error in signup controller", [error.message]));
  }
};


export const verifyEmail = async (req, res, next) => {
  const { token } = req.query;
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    if (user.isVerified) {
      return res
        .status(200)
        .json(new ApiResponse(200, { message: "Email already verified" }));
    }

    user.isVerified = true;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, { message: "Email verified successfully" }));
  } catch (error) {
    next(new ApiError(400, "Invalid or expired token"));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
   
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return next(new ApiError(404, "User not found"));
    }

    const matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return next(new ApiError(400, "Invalid credentials"));
    }

    if (!existingUser.isVerified) {
      return next(new ApiError(403, "Email not verified"));
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json(new ApiResponse(200, { user: existingUser, token }));
  } catch (error) {
    next(new ApiError(500, "Error in signin controller", [error.message]));
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email, yourFirstSchool } = req.body;

  try {
    
    const user = await User.findOne({
      email,
      yourFirstSchool,
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    
    const resetToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    const passwordResetEmailBody = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #333;
              font-size: 24px;
              text-align: center;
            }
            p {
              color: #555;
              font-size: 16px;
              line-height: 1.5;
            }
            .cta-button {
              display: block;
              width: 100%;
              max-width: 200px;
              margin: 20px auto;
              padding: 12px;
              background-color: #e04e5e;
              color: white;
              text-align: center;
              font-size: 16px;
              text-decoration: none;
              border-radius: 5px;
            }
            .cta-button:hover {
              background-color: #d0454f;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset Request</h1>
            <p>Hi ${user.firstName},</p>
            <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
            <a href="${resetLink}" class="cta-button">Reset Password</a>
            <p>If you didn't request a password reset, please ignore this email.</p>
            <p>Best regards,<br/>QuickDoc</p>
          </div>
        </body>
      </html>
    `;

    await sendEmail(email, "Password Reset", passwordResetEmailBody);

    res.status(200).json(
      new ApiResponse(200, {
        message: "Password reset email sent successfully",
      })
    );
  } catch (error) {
    next(
      new ApiError(500, "Error in forgot password controller", [error.message])
    );
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return next(new ApiError(500, "Error resetting password", [error.message]));
  }
};
