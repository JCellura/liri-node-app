// require("dotenv").config();
// var keys = require('./keys.js'); 
// var Spotify = require('node-spotify-api');
var Twitter = require('twitter'); 
// var request = require('request');
// var fs = require('fs')

require("dotenv").config();

var keys = require('./keys');

var twitterKeys = keys.twitter;

var fs = require('fs');

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var songName = "";

var arguments = process.argv;

// The LIRI command will always be the second command line argument
var liriCommand = arguments[2];

// The parameter to the LIRI command may contain spaces
var liriArg = '';
for (var i = 3; i < arguments.length; i++) {
	liriArg += arguments[i] + ' ';
}

// retrieveTweets will retrieve my last 20 tweets and display them together with the date
function retrieveTweets() {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
		if (err) throw err;
	});

	// Initialize the Twitter client
	var client = new Twitter(twitterKeys);

	// Set the 'screen_name' to my Twitter handle
	var params = {screen_name: 'fullstack_coder', count: 20};

	// Retrieve the last 20 tweets
	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			var errorStr = 'ERROR: Retrieving user tweets -- ' + error;

			// Append the error string to the log file
			fs.appendFile('./log.txt', errorStr, (err) => {
				if (err) throw err;
				console.log(errorStr);
			});
			return;
		} else {
			// Pretty print user tweets
			var outputStr = '------------------------\n' +
							'User Tweets:\n' + 
							'------------------------\n\n';

			for (var i = 0; i < tweets.length; i++) {
				outputStr += 'Created on: ' + tweets[i].created_at + '\n' + 
							 'Tweet content: ' + tweets[i].text + '\n' +
							 '------------------------\n';
			}

			// Append the output to the log file
			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
				if (err) throw err;
				console.log(outputStr);
			});
		}
	});
};

if (liriCommand === 'my-tweets') {
	retrieveTweets();}

if (process.argv[2] === "spotify-this-song") {

  if (arguments.length === 3) {
    spotify
      .request('https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc')
      .then(function(data) {
        var spotObj1 = {
          Artist: data.album.artists[0].name,
          Track: data.name,
          Album: data.album.name,
          MP3: data.preview_url
        }

        fs.appendFile("log.txt", JSON.stringify(spotObj1, null, 2), function(err) {
          if (err) {
            console.log(err);
          }
        
          else {
            console.log("log.txt updated");
            // console.log(data);
            console.log("Artist: " + data.album.artists[0].name);
            console.log("Track: " + data.name);
            console.log("Album: " + data.album.name);
            console.log("MP3 Preview: " + data.preview_url);
          }
        });
      })
      .catch(function(err) {
        console.error('Error occurred: ' + err); 
      });
  }
  
  else {
    songName = arguments[3];

    for (var i = 4; i < arguments.length; i++) {
      songName = songName + " " + arguments[i];
    }

    spotify.search({type: 'track', query: songName, limit: 1}, function(err, data) {
      var spotObj2 = {
        Artist: JSON.stringify(data.tracks.items[0].artists[0].name, null, 2),
        Track: JSON.stringify(data.tracks.items[0].name, null, 2),
        Album: JSON.stringify(data.tracks.items[0].album.name, null, 2),
        MP3: JSON.stringify(data.tracks.items[0].preview_url, null, 2)
      }

      if (err) {
        return console.log('Error occurred: ' + err);
      }

      fs.appendFile("log.txt", JSON.stringify(spotObj2, null, 2), function(err) {
        if (err) {
          console.log(err);
        }
      
        else {
          console.log("log.txt updated");
          // console.log(JSON.stringify(data, null, 2));
          console.log("Artist: " + JSON.stringify(data.tracks.items[0].artists[0].name, null, 2));
          console.log("Track: " + JSON.stringify(data.tracks.items[0].name, null, 2));
          console.log("Album: " + JSON.stringify(data.tracks.items[0].album.name, null, 2));
          console.log("MP3 Preview: " + JSON.stringify(data.tracks.items[0].preview_url, null, 2));
        }
      });
    });
  }
}