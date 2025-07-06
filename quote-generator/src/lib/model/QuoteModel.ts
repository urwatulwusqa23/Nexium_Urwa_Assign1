
import { Schema, model, models } from 'mongoose';

const QuoteSchema = new Schema({
  quote: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
}, { collection: "quotes" }); // Explicit collection name

const QuoteModel = models.Quote || model("Quote", QuoteSchema);
export default QuoteModel;