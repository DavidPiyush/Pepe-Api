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
    const { todayClaim, totalEarnDay } = req.body;

    // Prepare update object
    const updateObject = {};
    const incrementObject = {};

    // Calculate the sum of fields to be added to totalBalance
    if (todayClaim !== undefined || totalEarnDay !== undefined) {
      const totalBalanceIncrement = todayClaim + totalEarnDay;
      incrementObject.totalBalance = totalBalanceIncrement;
    }

    // Update other fields directly
    if (todayClaim !== undefined) {
      updateObject.todayClaim = todayClaim;
    }
    if (totalEarnDay !== undefined) {
      updateObject.totalEarnDay = totalEarnDay;
    }

    // Combine direct updates and increment operations
    const finalUpdateObject = {
      ...updateObject,
      ...(Object.keys(incrementObject).length > 0 && { $inc: incrementObject }),
    };

    // Ensure there are fields to update
    if (Object.keys(finalUpdateObject).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    // Perform the update
    const updatedUser = await User.findOneAndUpdate(
      { ethereumId: ethereumId },
      finalUpdateObject,
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

export const fetchDataUser = async (req, res) => {
  try {
    const { referralCode } = req.params;
    const updateObj = req.body;

    // Find the user by referralCode
    const user = await User.findOne({ referralCode: referralCode });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the ethereumId already exists in referredUsers
    const isDuplicate = user.referredUsers.some(
      (ref) => ref.ethereumId === updateObj.referredUsers.ethereumId
    );

    if (isDuplicate) {
      return res.status(400).json({ error: 'Ethereum ID already referred' });
    }

    // If not duplicate, proceed to update
    const update = await User.findOneAndUpdate(
      { referralCode: referralCode },
      {
        $inc: { referEarn: updateObj.referEarn }, // Increment referEarn
        $push: { referredUsers: updateObj.referredUsers }, // Push new referred user
      },
      { new: true } // Return the updated document
    );

    res.status(200).json(update);
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'Failed to update user data' });
  }
};

// export const fetchDataUser = async (req, res) => {
//   try {
//     const { referralCode } = req.params;
//     const updateObj = req.body;
//     const update = await User.findOneAndUpdate(
//       { referralCode: referralCode },

//       {
//         $inc: { referEarn: updateObj.referEarn }, // Increment referEarn
//         $push: { referredUsers: updateObj.referredUsers }, // Push new referred user
//       },
//       { new: true } // Return the updated document
//     );

//     return update;
//   } catch (error) {
//     console.error('Error updating user data:', error);
//     throw error;
//   }
// };
