import express from 'express';
import {
  getAllUsers,
  createUsers,
  // getReferedUser,
  getUserByEthereumId,
  updateUser,
  deleteUserByEthereumId,
  clickCheck,
  getUserByReferCode
  
} from '../controllers/userController.js';
// import { referUser, referUserPost } from '../controllers/referredController.js';

const router = express.Router();

// GETTING DATA FROM USERS

router.get('/', getAllUsers);
router.get('/user/:ethereumId',getUserByEthereumId)
router.post('/create', createUsers);
router.put('/user/update/:ethereumId',updateUser)
router.delete('/user/delete/:ethereumId',deleteUserByEthereumId)

router.get("/refer/:referralCode",getUserByReferCode)

// click check
router.post('/button-click',clickCheck)

export default router;
