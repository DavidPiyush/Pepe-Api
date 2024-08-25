import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema(
  {
    ethereumId: {
      type: String,
      unique: true,
      required: true,
    },
    totalBalance: {
      type: Number,
      default: 0,
      min: [0, 'Balance cannot be negative'],
    },
    referralCode: {
      type: String,
      required: true,
      unique: true,
    },
    todayClaim: {
      type: Number,
      default: 0,
    },
    totalEarnDay: {
      type: Number,
      default: 0,
    },
    referEarn: { type: Number, default: 0 },
    referredUsers: [
      {
        ethereumId: { type: String, unique: true },
        status: { type: String },
        referTime: { type: Date, default: new Date() },
      },
    ],
    lastClickTime: { type: Date, default: null },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

UserSchema.pre('save', function (next) {
  // Calculate the totalBalance based on other fields
  this.totalBalance = this.referEarn + this.totalEarnDay + this.todayClaim;
  console.log(this.totalBalance);
  next();
});

const User = mongoose.model('User', UserSchema, 'User');
export default User;
