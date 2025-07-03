const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnimeCardSchema = new Schema({
    name: String,
    genreID: String,
});

module.exports = mongoose.model('Anime', AnimeCardSchema);