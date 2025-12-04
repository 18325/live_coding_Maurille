import mongoose, { Document, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  tags: string[];
  creator: mongoose.Types.ObjectId;
  editors: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema({
  title: { 
    type: String, 
    required: true 
  },
  content: { 
    type: String, 
    default: '' 
  },
  tags: [{ 
    type: String 
  }],
  creator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  editors: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<INote>('Note', NoteSchema);