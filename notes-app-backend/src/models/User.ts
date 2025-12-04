import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IUser>('User', UserSchema);