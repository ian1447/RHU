import { News } from "../models/news.js";

export async function getNews(req, res) {
  try {
    const news = await News.find({});
    res.json(news);
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
}

export async function createNews(req, res) {
  try {
    const { picture, title, author, when, where, article } = req.body;
    //   if (!password) return res.status(400).json({ err: 'Password is required' });
    const news = new News({ picture, title, author, when, where, article });
    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function updateNews(req, res) {
  console.log("asdasdadasdad");
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log(news);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json(news);
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}

export async function deleteNews(req, res) {
  try {
    const news = await News.findByIdAndDelete(req.params.id);
    if (!news) return res.status(404).json({ message: "News not found" });
    res.json({ message: "News deleted" });
  } catch (err) {
    res.status(500).json({ err: err.message });
    console.log(err.message);
  }
}
