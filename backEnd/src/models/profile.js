import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  postCount: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  socialLinks: [
    {
      type: String
    }
  ]
});

export default mongoose.model('Profile', ProfileSchema);
