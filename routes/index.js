var express = require('express');
var router = express.Router();
const request = require('request');
const passport = require('passport');

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8';
//const apiKey = '123456789';
const apiBaseUrl = 'http://api.themoviedb.org/3';
//const apiBaseUrl = 'http://localhost:3030';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
//const nowPlayingUrl = `${apiBaseUrl}/most_popular?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';


router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('User info ================')
  console.log(req.user);
  request.get(nowPlayingUrl, (error, response, movieData)=> {
 
    const parsedData = JSON.parse(movieData);
    //console.log(parsedData);
    //res.json(parsedData);
    res.render('index', {
      parsedData: parsedData.results
    })
  })
});

router.get('/login', passport.authenticate('github'));

router.get('/favorites', (req, res) => {
  res.json(req.user.username);
})

router.get('/auth', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/loginFailed'
}));

router.get('/movie/:id', (req, res, next)=> {
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`

  request.get(thisMovieUrl, (error, response, movieData) => {
    const parsedData = JSON.parse(movieData);
    //console.log(error);
    //console.log(parsedData);
    res.render('single-movie', {
      parsedData
    })
  })
});

router.post('/search', (req, res, next) => {
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const moiveUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;
  //res.send(moiveUrl);
  request.get(moiveUrl, (error, response, movieData) => {
    let parsedData = JSON.parse(movieData);
    if(cat=='person'){
      parsedData.results = parsedData.results[0].known_for;
    }
    res.render('index', {
      parsedData: parsedData.results
    });
  });
});

module.exports = router;

