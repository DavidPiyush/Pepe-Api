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
        ethereumId: { type: String , unique:true,},
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


// Middleware to update totalBalance before saving the document
UserSchema.pre('save', function (next) {
  if (this.isModified('todayClaim') || this.isModified('referEarn') || this.isModified('totalEarnDay')) {
    this.totalBalance = this.todayClaim + this.referEarn + this.totalEarnDay;
  }
  next();
});

// Middleware to update totalBalance before finding and updating a document
UserSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  const currentDoc = this._conditions;

  const todayClaim = update.todayClaim !== undefined ? update.todayClaim : (currentDoc.todayClaim || 0);
  const referEarn = update.referEarn !== undefined ? update.referEarn : (currentDoc.referEarn || 0);
  const totalEarnDay = update.totalEarnDay !== undefined ? update.totalEarnDay : (currentDoc.totalEarnDay || 0);

  update.totalBalance = todayClaim + referEarn + totalEarnDay;

  next();
});


const User = mongoose.model('User', UserSchema, 'User');

// console.log(User);
export default User;
