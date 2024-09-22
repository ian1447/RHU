import mongoose from "mongoose";
const Schema = mongoose.Schema;

const newsSchema = new Schema({
  picture: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  when: { type: String, required: true },
  where: { type: String, required: true },
  article: { type: String, required: true },
});

// appointmentSchema.set('toJSON', {
//   transform: function (doc, ret) {
//     delete ret.password;
//     return ret;
//   }
// });

newsSchema.pre("save", async function (next) {
  const news = this;
  console.log(news);
  try {
    next();
  } catch (err) {
    next(err);
  }
});

const News = mongoose.model("news", newsSchema);

export { News };
