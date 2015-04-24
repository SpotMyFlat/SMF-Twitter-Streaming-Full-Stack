var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var users = require('./routes/user');

var pg = require('pg');
var conString = 'postgres://postgres:root@localhost/databasename';

var app = express();
var server = app.listen(80);
var io = require('socket.io').listen(server);

var Twit = require('twit');

var T = new Twit({
    consumer_key:           ''
    , consumer_secret:      ''
    , access_token:         ''
    , access_token_secret:  ''
});
var stream = T.stream('statuses/filter', { track: '#twitter' });

// view engine setup

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });

    stream.on('tweet', function (tweet) {
        pg.connect(conString, function(err, client, done) {
            if(err) {
                return console.error('error fetching client from pool', err);
            }

            var tweetHashtags = tweet.entities.hashtags.map(function(hashtag) { return hashtag.text; });
            var tweetUserMentions = tweet.entities.user_mentions.map(function(mention) { return mention.screen_name; });

            client.query('INSERT INTO tweets (hashtags, user_mentions, tweet_id, ' +
            'in_reply_to_screen_name, in_reply_to_status_id, lang, retweeted, user_id, user_followers_count, ' +
            'user_screen_name, user_verified) VALUES' +
            '($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
                [tweetHashtags, tweetUserMentions, tweet.id, tweet.in_reply_to_screen_name,
                tweet.in_replay_to_status_id, tweet.lang, tweet.retweeted, tweet.user.id,
                tweet.user.followers_count, tweet.user.screen_name, tweet.user.verified],
                function(err, result) {
                    done();

                    if(err) { return console.error('error running query', err); }
                    else {
                        socket.emit('tweet', { tweet: tweet });
                        return console.log('Tweet added');
                    }
            });
        });
    });

});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

module.exports = app;
