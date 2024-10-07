import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  price: {
    type: Number,
    default: 0,
  },
  mainImage: {
    type: String,
    default: '',
  },
  images: {
    type: [String],
    default: [],
  },
  category: {
    type: String,
    default: '',
  },
  discount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  countInStock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);
export default Product;




