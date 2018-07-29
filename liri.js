require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var searchItem = process.argv[2];
var input = process.argv;
var userInput="";
for (var i = 3; i<input.length; i++){
    userInput += input[i] + " ";
}
console.log(userInput);

var findInfo = function(){
    switch(searchItem) {
        case "my-tweets":
            //Shows your last 20 tweets and when they were created at in your terminal/bash window.
            tweets();
            break;
        case "spotify-this-song":
            spotifySong();
            break;
        case "movie-this":
            movie();
            break;
        case "do-what-it-says":
            doWhatItSays();
            break; 
    }
}

findInfo();

function tweets(){
    var params = {screen_name: 'sgarg110'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i<20; i++){
                console.log(tweets[i].text);
                console.log(tweets[i].created_at);
            } 
        }
    });
    appendToLogFile();
}

function spotifySong(){
    var song = "";
    if( userInput === "") {
        song = "The Sign";
    }else{
        song = userInput;
    }
        spotify.search({ type: 'track', query: song }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
            console.log("Displaying song info for song " + song);
            console.log("--------------------------");   
            var songDetails = data.tracks.items[0]; 
            var artists = songDetails.artists;
            for (var i = 0; i< artists.length; i++){
                console.log("Artist "+ i + ": " +artists[i].name);
            }
            console.log("Name: "+ songDetails.name);
            console.log("Preview link: "+ songDetails.preview_url);
            console.log("Album: "+ songDetails.album.name);
        });
        appendToLogFile();
}

function movie(){
    var movie = "";
    if( userInput === "") {
        movie = "Mr. Nobody";
    }else{
        movie = userInput;
    }
    //console.log(userInput);
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("The movie name is: " + JSON.parse(body).Title);
            console.log("The movie's was released in: " + JSON.parse(body).Year);
            console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
            console.log("The movie's rotten Tomato rating is: " + JSON.parse(body).Ratings[1].Value);
            console.log("The movie was release in: " + JSON.parse(body).Country);
            console.log("The movie's language is: " + JSON.parse(body).Language);
            console.log("The movie's plot is: " + JSON.parse(body).Plot);
            console.log("The movie's cast is: " + JSON.parse(body).Actors);
        }
    });
    appendToLogFile();
}

function doWhatItSays(){
        fs.readFile("random.txt", "utf8", function(error, data){
            if(error){
                console.log(error);
            }else{
                console.log("hi");
                var dataArr = data.split(",");
                searchItem = dataArr[0];
                userInput = dataArr[1];
                console.log(dataArr[0]);
                console.log(dataArr[1]);
                findInfo();
            }
        })
}

function appendToLogFile(){
    var input = process.argv;
    var appendData = input.slice(2);
    fs.appendFile("log.txt", "\n " +appendData, function(err) {

        // If an error was experienced we say it.
        if (err) {
          console.log(err);
        }
      
        // If no error is experienced, we'll log the phrase "Content Added" to our node console.
        else {
          console.log("Content Added to log file!");
        }
    })
}