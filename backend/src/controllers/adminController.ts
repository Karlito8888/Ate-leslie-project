// backend/src/controllers/adminController.ts

import { RequestHandler } from 'express';
import { User } from '../models/User';
import { sendResponse } from '../utils/responseHandler';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, HTTP_CODES, RESPONSE_STATUS } from '../utils/constants';
import { findUser, createApiError } from '../utils/modelHelpers';

// Fonctions utilitaires
const getUserStats = async () => {
  const [totalUsers, totalAdmins] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'admin' })
  ]);
  return { totalUsers, totalAdmins };
};

// Contrôleurs
export const getDashboardStats: RequestHandler = async (req, res, next) => {
  try {
    const stats = await getUserStats();
    
    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      data: { stats }
    });
  } catch (error) {
    sendResponse(res, {
      status: RESPONSE_STATUS.ERROR,
      statusCode: HTTP_CODES.INTERNAL_ERROR,
      message: ERROR_MESSAGES.STATS_ERROR
    });
  }
};

export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    
    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);
    
    if (user.role === 'admin') {
      throw createApiError(HTTP_CODES.FORBIDDEN, ERROR_MESSAGES.CANNOT_DELETE_ADMIN);
    }

    await User.findByIdAndDelete(req.params.id);
    
    sendResponse(res, {
      status: RESPONSE_STATUS.SUCCESS,
      statusCode: HTTP_CODES.OK,
      message: SUCCESS_MESSAGES.USER_DELETED
    });
  } catch (error) {
    next(error);
  }
}; 