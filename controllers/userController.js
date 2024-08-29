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
      const totalBalanceIncrement = (todayClaim || 0) + (totalEarnDay || 0);
      incrementObject.totalBalance = totalBalanceIncrement;
    }

    // Add $inc for todayClaim if provided
    if (todayClaim !== undefined) {
      incrementObject.todayClaim = todayClaim;
    }

    // Add $inc for totalEarnDay if provided
    if (totalEarnDay !== undefined) {
      incrementObject.totalEarnDay = totalEarnDay;
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

export const socialLink = async (req, res) => {
  try {
    const { ethereumId } = req.params;
    console.log(ethereumId);

    const { socialLinks } = req.body;

    const user = await User.findOneAndUpdate(
      { ethereumId: ethereumId },
      {
        $addToSet: {
          socialLinks: socialLinks,
        },
      },
      {
        new: true,
      }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({
      status: 'success',
      data: {
        user: user,
      },
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ error: 'Failed to update user data' });
  }
};

// export const clickCount = async (req, res) => {
//   try {
//     const { ethereumId } = req.params; // Get the ethereumId from the request parameters

//     // Get the current time
//     const currentTime = new Date();

//     // Update the user document
//     const user = await User.findOneAndUpdate(
//       { ethereumId },
//       [
//         {
//           $set: {
//             clickCount: {
//               $cond: [
//                 {
//                   $gt: [
//                     { $subtract: [currentTime, '$lastClickTime'] },
//                     86400000,
//                   ],
//                 },
//                 1, // Reset to 1 if more than 24 hours have passed
//                 '$clickCount', // Otherwise, keep the current value
//               ],
//             },
//             lastClickTime: {
//               $cond: [
//                 {
//                   $gt: [
//                     { $subtract: [currentTime, '$lastClickTime'] },
//                     86400000,
//                   ],
//                 },
//                 currentTime, // Update lastClickTime if more than 24 hours have passed
//                 '$lastClickTime', // Otherwise, keep the current value
//               ],
//             },
//           },
//         },
//       ],
//       { new: true } // Return the updated document
//     );

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     res
//       .status(200)
//       .json({
//         message: 'Click count updated successfully',
//         clickCount: user.clickCount,
//       });
//   } catch (error) {
//     console.error('Error updating click count:', error);
//     res.status(500).json({ error: 'Failed to update click count' });
//   }
// };

export const clickCount = async (req, res) => {
  try {
    const { ethereumId } = req.params; // Get the ethereumId from the request parameters

    // Get the current time
    const currentTime = new Date();

    // Update the user document
    const user = await User.findOneAndUpdate(
      { ethereumId },
      [
        {
          $set: {
            clickCount: {
              $cond: [
                {
                  $gt: [
                    { $subtract: [currentTime, '$lastClickTime'] },
                    86400000, // 24 hours in milliseconds
                  ],
                },
                1, // Reset to 1 if more than 24 hours have passed
                { $add: ['$clickCount', 1] }, // Otherwise, increment the current value by 1
              ],
            },
            lastClickTime: {
              $cond: [
                {
                  $gt: [
                    { $subtract: [currentTime, '$lastClickTime'] },
                    86400000, // 24 hours in milliseconds
                  ],
                },
                currentTime, // Update lastClickTime if more than 24 hours have passed
                '$lastClickTime', // Otherwise, keep the current value
              ],
            },
          },
        },
      ],
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: 'Click count updated successfully',
      clickCount: user.clickCount,
    });
  } catch (error) {
    console.error('Error updating click count:', error);
    res.status(500).json({ error: 'Failed to update click count' });
  }
};

// Function to calculate remaining time
const calculateRemainingTime = (startTime) => {
  const currentTime = new Date();
  const elapsedTime = currentTime - startTime; // Elapsed time in milliseconds
  const remainingTime = 86400000 - elapsedTime; // 24 hours = 86400000 milliseconds

  return remainingTime > 0 ? remainingTime : 0;
};

export const startCountdown = async (req, res) => {
  try {
    const { ethereumId } = req.params;

    // Update the user's timerStart and clickCount
    const user = await User.findOneAndUpdate(
      { ethereumId },
      [
        {
          $set: {
            timerStart: {
              $cond: [
                { $eq: ['$timerStart', null] }, // Start the timer if it's not already set
                new Date(), // Set the current time as timerStart
                '$timerStart', // Keep the current timerStart if already set
              ],
            },
            clickCount: {
              $cond: [
                { $eq: ['$timerStart', null] }, // Increment clickCount if the timer has not started
                1, // Set clickCount to 1 when the timer starts
                '$clickCount', // Keep the current clickCount if the timer is already running
              ],
            },
          },
        },
      ],
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate remaining time if the timer is running
    const remainingTime = user.timerStart
      ? calculateRemainingTime(user.timerStart)
      : 0;

    res.status(200).json({
      message: 'Countdown started',
      remainingTime: remainingTime, // Time left in milliseconds
      remainingTimeInMinutes: Math.floor(remainingTime / 60000), // Time left in minutes
      remainingTimeInHours: Math.floor(remainingTime / 3600000), // Time left in hours
      clickCount: user.clickCount,
    });
  } catch (error) {
    console.error('Error starting countdown:', error);
    res.status(500).json({ error: 'Failed to start countdown' });
  }
};
