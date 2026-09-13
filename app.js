const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
});
app.get("/tools/image-compressor", (req, res) => {
    res.render("image-compressor");
});
app.get("/tools/image-resizer", (req, res) => {
    res.render("image-resizer");
});
app.get("/tools/jpg-to-png", (req, res) => {
    res.render("jpg-to-png");
});
app.get("/tools/png-to-jpg", (req, res) => {
    res.render("png-to-jpg");
});
app.get("/tools/jpg-to-pdf", (req, res) => {
    res.render("jpg-to-pdf");
});
app.get("/tools/pdf-to-jpg", (req, res) => {
    res.render("pdf-to-jpg");
});
app.get("/tools/pdf-to-png", (req, res) => {
    res.render("pdf-to-png");
});
app.get("/tools/pdf-merger", (req, res) => {
    res.render("pdf-merger");
});
app.get("/tools/pdf-splitter", (req, res) => {
    res.render("pdf-splitter");
});
app.get("/tools/pdf-compressor", (req, res) => {
    res.render("pdf-compressor");
});
app.get("/tools/pdf-to-word", (req, res) => {
    res.render("pdf-to-word");
});
app.get("/tools/pdf-to-excel", (req, res) => {
    res.render("pdf-to-excel");
});
app.get("/tools/pdf-to-powerpoint", (req, res) => {
    res.render("pdf-to-powerpoint");
});
app.get("/tools/pdf-protect", (req, res) => {
    res.render("pdf-protect");
});
app.get("/tools/pdf-unlock", (req, res) => {
    res.render("pdf-unlock");
});
app.get("/tools/pdf-rotate", (req, res) => {
    res.render("pdf-rotate");
});
app.get("/tools/pdf-page-numbers", (req, res) => {
    res.render("pdf-page-numbers");
});
app.get("/tools/pdf-watermark", (req, res) => {
    res.render("pdf-watermark");
});
app.get("/tools/pdf-crop", (req, res) => {
    res.render("pdf-crop");
});
app.get("/tools/pdf-resize", (req, res) => {
    res.render("pdf-resize");
});
app.get("/tools/pdf-extract-pages", (req, res) => {
    res.render("pdf-extract-pages");
});
app.get("/tools/pdf-images-extractor", (req, res) => {
    res.render("pdf-images-extractor");
});
app.get("/tools/image-cropper", (req, res) => {
    res.render("image-cropper");
});
app.get("/tools/image-rotator", (req, res) => {
    res.render("image-rotator");
});
app.get("/tools/image-flip", (req, res) => {
    res.render("image-flip");
});
app.get("/tools/image-format-converter", (req, res) => {
    res.render("image-format-converter");
});
app.get("/tools/image-to-base64", (req, res) => {
    res.render("image-to-base64");
});
app.get("/tools/base64-to-image", (req, res) => {
    res.render("base64-to-image");
});
app.get("/tools/image-color-picker", (req, res) => {
    res.render("image-color-picker");
});
app.get("/tools/image-metadata-remover", (req, res) => {
    res.render("image-metadata-remover");
});
app.get("/tools/word-counter", (req, res) => {
    res.render("word-counter");
});
app.get("/tools/character-counter", (req, res) => {
    res.render("character-counter");
});
app.get("/tools/case-converter", (req, res) => {
    res.render("case-converter");
});
app.get("/tools/remove-duplicate-lines", (req, res) => {
    res.render("remove-duplicate-lines");
});
app.get("/tools/text-sorter", (req, res) => {
    res.render("text-sorter");
});
app.get("/tools/text-cleaner", (req, res) => {
    res.render("text-cleaner");
});
app.get("/tools/lorem-ipsum-generator", (req, res) => {
    res.render("lorem-ipsum-generator");
});
app.get("/tools/json-formatter", (req, res) => {
    res.render("json-formatter");
});
app.get("/tools/json-validator", (req, res) => {
    res.render("json-validator");
});
app.get("/tools/url-encoder-decoder", (req, res) => {
    res.render("url-encoder-decoder");
});
app.get("/tools/base64-encoder-decoder", (req, res) => {
    res.render("base64-encoder-decoder");
});
app.get("/tools/uuid-generator", (req, res) => {
    res.render("uuid-generator");
});
app.get("/tools/qr-code-generator", (req, res) => {
    res.render("qr-code-generator");
});
app.get("/tools/password-generator", (req, res) => {
    res.render("password-generator");
});
app.get("/tools/hash-generator", (req, res) => {
    res.render("hash-generator");
});
app.get("/tools/csv-to-excel", (req, res) => {
    res.render("csv-to-excel");
});
app.get("/tools/excel-to-csv", (req, res) => {
    res.render("excel-to-csv");
});
app.get("/tools/markdown-to-html", (req, res) => {
    res.render("markdown-to-html");
});
app.get("/tools/html-to-pdf", (req, res) => {
    res.render("html-to-pdf");
});
app.get("/tools/image-to-pdf", (req, res) => {
    res.render("image-to-pdf");
});
app.get("/tools/pdf-to-text", (req, res) => {
    res.render("pdf-to-text");
});
app.get("/tools/pdf-metadata-editor", (req, res) => {
    res.render("pdf-metadata-editor");
});
app.get("/tools/word-to-pdf", (req, res) => {
    res.render("word-to-pdf");
});
app.get("/tools/percentage-calculator", (req, res) => {
    res.render("percentage-calculator");
});
app.get("/tools/age-calculator", (req, res) => {
    res.render("age-calculator");
});
app.get("/tools/unit-converter", (req, res) => {
    res.render("unit-converter");
});
app.get("/tools/date-calculator", (req, res) => {
    res.render("date-calculator");
});
app.get("/tools/currency-converter", (req, res) => {
    res.render("currency-converter");
});
app.get("/tools/time-zone-converter", (req, res) => {
    res.render("time-zone-converter");
});
app.get("/tools/random-number-generator", (req, res) => {
    res.render("random-number-generator");
});
app.get("/tools/stopwatch-timer", (req, res) => {
    res.render("stopwatch-timer");
});
app.get("/tools/timestamp-converter", (req, res) => {
    res.render("timestamp-converter");
});
app.get("/tools/color-palette-generator", (req, res) => {
    res.render("color-palette-generator");
});
app.get("/tools/text-to-speech", (req, res) => {
    res.render("text-to-speech");
});
app.get("/tools/speech-to-text", (req, res) => {
    res.render("speech-to-text");
});
app.get("/tools/roman-numeral-converter", (req, res) => {
    res.render("roman-numeral-converter");
});
app.get("/tools/number-to-words", (req, res) => {
    res.render("number-to-words");
});
app.get("/tools/scientific-calculator", (req, res) => {
    res.render("scientific-calculator");
});
app.get("/tools/fraction-calculator", (req, res) => {
    res.render("fraction-calculator");
});
app.get("/tools/average-median-mode", (req, res) => {
    res.render("average-median-mode");
});
app.get("/tools/tip-calculator", (req, res) => {
    res.render("tip-calculator");
});
app.get("/tools/json-to-csv", (req, res) => {
    res.render("json-to-csv");
});
app.get("/tools/csv-to-json", (req, res) => {
    res.render("csv-to-json");
});
app.get("/tools/html-formatter", (req, res) => {
    res.render("html-formatter");
});
app.get("/tools/css-formatter", (req, res) => {
    res.render("css-formatter");
});
app.get("/tools/javascript-formatter", (req, res) => {
    res.render("javascript-formatter");
});
app.get("/tools/json-minifier", (req, res) => {
    res.render("json-minifier");
});

app.get("/test", (req, res) => {
    res.send("FILEVORA SERVER IS WORKING");
});
app.listen(PORT, () => {
    console.log(`FILEVORA running at http://localhost:${PORT}`);
});