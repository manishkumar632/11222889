import mongoose, { Document, Schema } from "mongoose";

// Interface for a click event
export interface IClickEvent {
  timestamp: Date;
  referrer: string;
  geoInfo?: {
    country?: string;
    city?: string;
    ip?: string;
  };
}

// Interface for URL document
export interface IUrl extends Document {
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  expiresAt: Date;
  clicks: number;
  clickEvents: IClickEvent[];
  isCustom: boolean;
}

// Schema for click event
const clickEventSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: { type: String, default: "direct" },
  geoInfo: {
    country: String,
    city: String,
    ip: String,
  },
});

// Schema for URL
const urlSchema = new Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  clickEvents: [clickEventSchema],
  isCustom: {
    type: Boolean,
    default: false,
  },
});

// Create and export the URL model
export default mongoose.model<IUrl>("Url", urlSchema);
