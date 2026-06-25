import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
    unique: true // Good practice to ensure usernames are unique!
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  // Aligned with your validator fields:
  socialLinks: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },
  postCount: {
    type: Number,
    default: 0
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  }
});

export default mongoose.model('Profile', ProfileSchema);