const express = require('express')
const ShortUrl = require('./models/shortUrl.js');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = express();

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE;
mongoose.connect(DB, {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    ShortUrl.find().sort({ updatedAt: -1 })
        .then( shortUrls => {
            res.render('index', { shortUrls: shortUrls });
        })
        .catch(err => {
            res.send(err);
        })
})
  
app.post('/', (req, res) => {
    ShortUrl.findOne({ full: req.body.fullUrl})
        .then( (shortUrl) => {
            shortUrl.totalCreations++;
            shortUrl.save()
            res.redirect('/');
        })
        .catch((err) => {
            ShortUrl.create({ full: req.body.fullUrl })
                .then(() => {
                    res.redirect('/');
                })
                .catch((err) => {
                    console.log(err);
                    res.send(err);
                })
        });
})

app.get('/:shortUrl', (req, res) => {
    ShortUrl.findOne({ short: req.params.shortUrl})
        .then( (shortUrl) => {
            shortUrl.clicks++
            shortUrl.save()
            res.redirect(shortUrl.full)
        })
        .catch((err) => {
            res.redirect('/');
        })
})


const PORT = process.env.PORT || 5000;
app.listen(PORT , () => {
    console.log(`server is running on ${PORT}`);
});