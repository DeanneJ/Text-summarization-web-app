const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  UserdeleteUser,
} = require('../controllers/userController.js');
const { protect, isAdmin } = require('../middleware/authMiddleware.js');


//Regiser New user as Guest or Travel Agent
router.post('/', registerUser);

//Login User
router.post('/auth', authUser);

//Logout User
router.post('/logout', logoutUser);

//User Delete User Profile
router.delete('/',protect, UserdeleteUser);

//User Get,Update User Profile
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);


//Admin Delete specific user Profile
router.delete('/:id',deleteUser);

module.exports = router;
