// backend/src/controllers/authController.ts

import { RequestHandler, Request, Response } from "express";
import { User } from "../models/User";
import {
  comparePassword,
  generateToken,
  generateResetToken,
} from "../utils/auth";
import { sendResponse } from "../utils/responseHandler";
import { sendEmail } from "../utils/email";
import { getPasswordResetTemplate } from "../utils/emailTemplates";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  HTTP_CODES,
  RESPONSE_STATUS,
} from "../utils/constants";
import {
  formatUserResponse,
  findUser,
  createApiError,
} from "../utils/modelHelpers";
import crypto from "crypto";

// Types pour les requêtes
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfileRequest {
  username?: string;
  email?: string;
  phoneNumber?: string;
}

// Helpers
const checkUserExists = async (email: string, username?: string) => {
  const query = username ? { $or: [{ email }, { username }] } : { email };
  return await User.findOne(query);
};

// Auth Controllers
export const register: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { username, email, password } = req.body as RegisterRequest;

    const existingUser = await checkUserExists(email, username);
    if (existingUser) {
      throw createApiError(HTTP_CODES.BAD_REQUEST, ERROR_MESSAGES.USER_EXISTS);
    }

    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);

    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.CREATED,
      token,
      data: { user: formatUserResponse(user) },
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await comparePassword(password, user.password))) {
      throw createApiError(
        HTTP_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    }

    const token = generateToken(user._id);
    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      token,
      data: { user: formatUserResponse(user) },
    });
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw createApiError(HTTP_CODES.UNAUTHORIZED, ERROR_MESSAGES.NO_TOKEN)
    }

    // Ici, vous pourriez ajouter le token à une liste noire ou le stocker dans Redis
    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      message: SUCCESS_MESSAGES.USER_LOGGED_OUT,
    })
  } catch (error) {
    next(error)
  }
}

// Profile Controllers
export const getProfile: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const user = await findUser(req.user.id);
    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      data: { user: formatUserResponse(user) },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { email, username, birthDate, landlineNumber, mobileNumber, fullName, address, newsletter } = req.body;

    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        throw createApiError(
          HTTP_CODES.BAD_REQUEST,
          ERROR_MESSAGES.USER_EXISTS
        );
      }
    }

    if (username) {
      const existingUser = await User.findOne({
        username,
        _id: { $ne: req.user.id },
      });
      if (existingUser) {
        throw createApiError(
          HTTP_CODES.BAD_REQUEST,
          ERROR_MESSAGES.USER_EXISTS
        );
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        email,
        username,
        birthDate,
        landlineNumber,
        mobileNumber,
        fullName,
        address,
        newsletterSubscribed: newsletter
      },
      { new: true }
    );

    if (!updatedUser) {
      throw createApiError(HTTP_CODES.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      data: { user: formatUserResponse(updatedUser) },
    });
  } catch (error) {
    next(error);
  }
};

export const toggleNewsletter: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const user = await findUser(req.user.id);
    user.newsletterSubscribed = !user.newsletterSubscribed;
    await user.save();

    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      message: user.newsletterSubscribed
        ? SUCCESS_MESSAGES.NEWSLETTER_SUBSCRIBED
        : SUCCESS_MESSAGES.NEWSLETTER_UNSUBSCRIBED,
      data: { newsletterSubscribed: user.newsletterSubscribed },
    });
  } catch (error) {
    next(error);
  }
};

// Password Management
export const changePassword: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body as ChangePasswordRequest;
    const user = await User.findById(req.user.id).select("+password");

    if (!user || !(await comparePassword(currentPassword, user.password))) {
      throw createApiError(
        HTTP_CODES.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    }

    user.password = newPassword;
    await user.save();

    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      message: SUCCESS_MESSAGES.PASSWORD_CHANGED,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  let foundUser = null;
  try {
    foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
      sendResponse(res, {
        status: RESPONSE_STATUS.SUCCESS,
        statusCode: HTTP_CODES.OK,
        message: ERROR_MESSAGES.RESET_EMAIL_SENT,
      });
      return;
    }

    const { resetToken, hashedToken } = generateResetToken();

    foundUser.passwordResetToken = hashedToken;
    foundUser.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
    await foundUser.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const { text, html } = getPasswordResetTemplate(
      foundUser.username,
      resetUrl
    );

    await sendEmail({
      to: foundUser.email,
      subject: "Password Reset (valid for 30 minutes)",
      text,
      html,
    });

    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      message: ERROR_MESSAGES.RESET_EMAIL_SENT,
    });
  } catch (error) {
    if (foundUser) {
      foundUser.passwordResetToken = undefined;
      foundUser.passwordResetExpires = undefined;
      await foundUser.save();
    }
    next(error);
  }
};

export const resetPassword: RequestHandler = async (
  req,
  res,
  next
): Promise<void> => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      throw createApiError(
        HTTP_CODES.BAD_REQUEST,
        ERROR_MESSAGES.INVALID_TOKEN
      );
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      message: SUCCESS_MESSAGES.PASSWORD_RESET,
    });
  } catch (error) {
    next(error);
  }
};
