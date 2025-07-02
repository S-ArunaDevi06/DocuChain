import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  expiryDate: Date,
  category: String,
  fileUrl: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', documentSchema);
