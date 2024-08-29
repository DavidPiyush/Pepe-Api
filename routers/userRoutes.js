import express from 'express';
import {
  getAllUsers,
  createUsers,
  // getReferedUser,
  getUserByEthereumId,
  updateUser,
  deleteUserByEthereumId,
  getUserByReferCode,
  fetchDataUser,
  socialLink,
  clickCount,
  startCountdown
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
router.put('/api/v1/refer/update/code/:referralCode',fetchDataUser)
router.put('/api/v1/user/social/link/:ethereumId',socialLink)
router.get('/api/v1/user/count/click/:ethereumId',clickCount)
router.post('/api/v1/user/timer/count/:ethereumId',startCountdown)

// click check

export default router;
