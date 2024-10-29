import mongoose from 'mongoose';

const ResortSchema = new mongoose.Schema({
  imgSrc: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amenities: [{
    type: String,
  }],
  rating: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  reviewStatus: {
    type: String,
    required: true,
  },
  reviewsCount: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Resort || mongoose.model('Resort', ResortSchema);