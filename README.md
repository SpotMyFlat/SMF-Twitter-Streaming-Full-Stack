SMF-Twitter-Streaming-Full-Stack
=========

[Node](http://nodejs.org) app with [Express](http://expressjs.com) framework able to catch tweets based on hashtags, store them into a [PostgreSQL](http://postgresql.org) database and sent callback to client using [Socket.io](http://socket.io).

## Installation

* Clone the repository
```
$ git clone git@github.com:SpotMyFlat/SMF-Twitter-Streaming-Full-Stack.git
```
* Install dependencies using [npm](http://npmjs.com)
```
$ npm install
```
* Use Grunt to watch files and run the app
```
$ grunt
```

## Configuration

Log in the [Twitter Dev Portal](https://dev.twitter.com) and create a new application - required to use the Twitter API. Set your credentiels in `app.js` file :

```
var T = new Twit({
    consumer_key:           'YourConsumerKey'
    , consumer_secret:      'YourConsumerSecret'
    , access_token:         'YourAccessToken'
    , access_token_secret:  'YourAccessTokenSecret'
});
```

Inject the table which structure is described in `database/dump.sql` in your own database, and set up your database name in `app.js` :

```
var conString = 'postgres://postgres:root@localhost/YourDatabaseName';
```

You can also set your own pattern to match in the same file:

```
var stream = T.stream('statuses/filter', { track: '#twitter' });
```

**Finally** run `$ grunt` and open `client/client.html` in your favorite browser with Debugger Tools. You'll see tweets appear as soon as they are posted. Check your table, it should be filled with tweet.

## Credits

Twitter Streaming API of course, but also the awesome [Twit](https://github.com/ttezel/twit) library combined with the *more-than-useful* [Pg helper](https://github.com/brianc/node-postgres) library.

## Contribute

Use the `develop` branch and [request a merge](https://github.com/SpotMyFlat/SMF-Twitter-Streaming-Full-Stack/compare) on `master` using a pull-request, describing the task accomplished in your commit(s).

If you find a bug or a missing feature, please [submit an issue](https://github.com/SpotMyFlat/SMF-Twitter-Streaming-Full-Stack/issues/new).