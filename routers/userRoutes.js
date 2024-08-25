import express from 'express';
import {
  getAllUsers,
  createUsers,
  // getReferedUser,
  getUserByEthereumId,
  updateUser,
  deleteUserByEthereumId,
  getUserByReferCode,
} from '../controllers/userController.js';
// import { referUser, referUserPost } from '../controllers/referredController.js';

const router = express.Router();

// GETTING DATA FROM USERS

router.get('/api/v1/', getAllUsers);
router.get('/api/v1/user/:ethereumId', getUserByEthereumId);
router.post('/api/v1/create', createUsers);
router.put('/api/v1/user/update/:ethereumId', updateUser);
router.delete('/api/v1/user/delete/:ethereumId', deleteUserByEthereumId);

router.get('/api/v1/refer/code/:referralCode', getUserByReferCode);

// click check

export default router;
