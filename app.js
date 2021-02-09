require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/ShortUrl");
const app = express();

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Connected to DB"));

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", {
    shortUrls: shortUrls,
  });
});

app.post("/shortUrls", async (req, res) => {
  const newUrl = await ShortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const url = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (url == null) {
    return res.sendStatus(404);
  }
  url.clicks++;
  url.save();
  res.redirect(url.full);
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Listening on port 5000")
);
