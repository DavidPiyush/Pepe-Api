import User from '../models/userModel.js';
const cron = require('node-cron');

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log(res.json);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users;', error);
  }
};

export const createUsers = async (req, res) => {
  try {
    const newUser = new User(req.body);
    console.log(newUser);

    await newUser.save();

    res.status(201).json({ status: 'sucess', data: { user: newUser } });
  } catch (error) {
    console.error('Error saving data', error);
    res.status(500).json({
      message: 'Failed to save data',
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { ethereumId } = req.params;
    const { todayClaim, totalEarnDay, referEarn } = req.body;

    // Prepare update object
    const updateObject = {};
    let totalBalanceIncrement = 0;

    // Calculate the sum of fields to be added to totalBalance
    if (
      todayClaim !== undefined ||
      totalEarnDay !== undefined ||
      referEarn !== undefined
    ) {
      totalBalanceIncrement =
        (todayClaim || 0) + (totalEarnDay || 0) + (referEarn || 0);
      updateObject.$inc = { totalBalance: totalBalanceIncrement };
    }

    // Update other fields
    if (todayClaim !== undefined) {
      updateObject.todayClaim = todayClaim;
    }
    if (totalEarnDay !== undefined) {
      updateObject.totalEarnDay = totalEarnDay;
    }
    if (referEarn !== undefined) {
      updateObject.referEarn = referEarn;
    }

    // Ensure there are fields to update
    if (Object.keys(updateObject).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    // Perform the update
    const updatedUser = await User.findOneAndUpdate(
      { ethereumId: ethereumId },
      updateObject,
      { new: true, runValidators: true }
    );

    // Check if the user was found and updated
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return the updated user data
    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({
      message: 'Failed to update data',
      error: error.message,
    });
  }
};


export const getUserByEthereumId = async (req, res) => {
  try {
    const { ethereumId } = req.params;

    const user = await User.findOne({ ethereumId: ethereumId });
    console.log(user);

    res.status(200).json({
      status: 'success',
      data: {
        user: user,
      },
    });
  } catch (error) {
    console.log("'CAN'T FIND USER BASED ON USERID", error);
  }
};

export const deleteUserByEthereumId = async (req, res) => {
  try {
    const { ethereumId } = req.params;
    // Find and delete the user by ethereumId
    const deletedUser = await User.findOneAndDelete({ ethereumId: ethereumId });

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res
      .status(200)
      .json({ status: 'User deleted successfully', data: { user: '' } });
  } catch (error) {
    console.log("CAN'T DELETE USER!", error);
  }
};

export const getUserByReferCode = async (req, res) => {
  try {
    const { referralCode } = req.params;

    const user = await User.findOne({ referralCode: referralCode });
    console.log(user);

    res.status(200).json({
      status: 'success',
      data: {
        user: user,
      },
    });
  } catch (error) {
    console.log("'CAN'T FIND USER BASED ON USERID", error);
  }
};


// Schedule a job to reset lastClickTime every 24 hours
cron.schedule('0 0 * * *', async () => {
  try {
    // Reset lastClickTime for all users
    await User.updateMany({}, { $set: { lastClickTime: new Date() } });
    console.log('lastClickTime has been reset for all users.');
  } catch (error) {
    console.error('Error resetting lastClickTime:', error);
  }
});

export const updateLastClickTime = async (req,res) => {
  try {
    const {ethereumId} = req.params
    const currentTime = new Date();
    const user = await User.findOne({ethereumId:ethereumId});

    if (user) {
      user.lastClickTime = currentTime;
      await user.save();
      console.log('lastClickTime has been updated.');
    } else {
      console.error('User not found.');
    }
  } catch (error) {
    console.error('Error updating lastClickTime:', error);
  }
};