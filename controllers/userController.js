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
    const { totalBalance, ...otherUpdates } = req.body;

    // Ensure referBalance is a number and increment correctly
    const increment = Number(totalBalance);
    if (isNaN(increment)) {
      return res.status(400).json({ message: 'Invalid increment value' });
    }

    // Prepare the update object
    const updateObject = {
      ...otherUpdates, // Regular updates
      $inc: { totalBalance: increment }, // Increment referBalance
    };

    // Use findOneAndUpdate with the updateObject
    const updateData = await User.findOneAndUpdate(
      { ethereumId: ethereumId },
      updateObject,
      { new: true, runValidators: true }
    );

    await User.findOne({ethereumId:ethereumId})
    // if User does not exits
    if (!updateData) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updateData,
      },
    });
  } catch (error) {
    console.error('Error saving data', error);
    res.status(500).json({
      message: 'Failed to update data',
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
        const user = await User.findOne({ ethereumId:ethereumId });
        const currentTime = new Date();

        if (user) {
            const lastClickTime = user.lastClickTime;
            const hours24 = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

            if (lastClickTime && (currentTime - lastClickTime < hours24)) {
                return res.status(400).json({ message: 'Button is disabled for 24 hours.' });
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
}


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