import User from '../models/userModel.js';

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

    // Fetch the current user data from the database
    const currentUser = await User.findOne({ ethereumId });

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prepare the update object and initialize totalBalanceIncrement
    const updateObject = {};
    let totalBalanceIncrement = 0;

    // Check if todayClaim has changed and update accordingly
    if (todayClaim !== undefined && todayClaim !== currentUser.todayClaim) {
      totalBalanceIncrement += todayClaim;
      updateObject.todayClaim = todayClaim;
    }

    // Check if totalEarnDay has changed and update accordingly
    if (
      totalEarnDay !== undefined &&
      totalEarnDay !== currentUser.totalEarnDay
    ) {
      totalBalanceIncrement += totalEarnDay;
      updateObject.totalEarnDay = totalEarnDay;
    }

    // Check if referEarn has changed and update accordingly
    if (referEarn !== undefined && referEarn !== currentUser.referEarn) {
      totalBalanceIncrement += referEarn;
      updateObject.referEarn = referEarn;
    }

    // Only increment totalBalance if there's something to increment
    if (totalBalanceIncrement > 0) {
      updateObject.$inc = { totalBalance: totalBalanceIncrement };
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

export const clickCheck = async (req, res) => {
  const { ethereumId } = req.body;

  try {
    const user = await User.findOne({ ethereumId: ethereumId });
    const currentTime = new Date();

    if (user) {
      const lastClickTime = user.lastClickTime;
      const hours24 = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

      if (lastClickTime && currentTime - lastClickTime < hours24) {
        return res
          .status(400)
          .json({ message: 'Button is disabled for 24 hours.' });
      }

      // Update the lastClickTime
      user.lastClickTime = currentTime;
      await user.save();
      res.status(200).json({ message: 'Button clicked successfully!' });
    } else {
      // If user does not exist, create a new user record
      const newUser = new User({ ethereumId, lastClickTime: currentTime });
      await newUser.save();
      res.status(200).json({ message: 'Button clicked successfully!' });
    }
  } catch (error) {
    console.error('Error handling button click:', error);
    res.status(500).json({ message: 'Server error' });
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
