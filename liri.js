require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var moment = require("moment")
var axios = require("axios");
var fs = require("fs");

var operator = process.argv[2];


console.log(operator);


switch (operator) {
    case "movie-this":
    movie();
    break;

    case "concert-this":
    concert();
    break;

    case "spotify-this-song":
    spotify();
    break;

    case "do-what-it-says":
    fileSystem();
    break;

    default:
    text = "Please use a valid operator. movie-this, concert-this, or spotify-this-song"

}





function movie(movieName){
var nodeArgs = process.argv;

// Create an empty variable for holding the movie name
var movieName = "";
// Allow for movies with more than one word in the title
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    }
    else {
      movieName += nodeArgs[i];

  }
}
// set empty value to "Mr. Nobody"
if (!movieName){
    movieName = "Mr. Nobody"
}
console.log(movieName);

var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";


console.log(queryUrl);



axios.get(queryUrl).then(
  function(response) {
    console.log(response.data);
    var rd = response.data
    console.log("Title: "+ rd.Title +"\n"+"Released: "+ rd.Year+"\n"+"IMDB Rating: "+rd.imdbRating+"\n"+"Country: "+ rd.Country+"\n"+"Plot: "+ rd.Plot+"\n"+"Actors: "+ rd.Actors+"\n"+"Rotten Tomatoes Rating: "+rd.Ratings[1].Value)
    }
    );
    }


function spotify(songName){
    var nodeArgs = process.argv;

    // Create an empty variable for holding the song name
    var songName = "";
    // Allow for songs with more than one word
    for (var i = 3; i < nodeArgs.length; i++) {
    
        if (i > 3 && i < nodeArgs.length) {
          songName = songName + "+" + nodeArgs[i];
        }
        else {
          songName += nodeArgs[i];
    
      }
    }
// set empty value to "The Sign by Ace of Base"
    if (!songName){
        songName = "The Sign Ace of Base"
    }
    console.log(songName);


    var spotify = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
    });
    spotify.search({type: 'track', query: songName, limit: 1}, function(error,data){
        if (error) {
            return console.log("Error occurred: "+ error)
        }
        let songData = data.tracks.items
        let artist = songData[0].artists[0].name
        let songName =songData[0].name
        let previewUrl = songData[0].preview_url
        let album = songData[0].album.name

        console.log("Artist: "+ artist + "\n" + "Song Name: "+ songName+ "\n"+ "Preview: "+ previewUrl+"\n"+ "Album: "+ album)
    })
}


function concert(artistName){
    var nodeArgs = process.argv;

     // Create an empty variable for holding the artist name
    var artistName = "";
    // Allow for artists with more than one name in artist name
    for (var i = 3; i < nodeArgs.length; i++) {
    
        if (i > 3 && i < nodeArgs.length) {
          artistName = artistName + "+" + nodeArgs[i];
        }
        else {
          artistName += nodeArgs[i];
    
      }
    }
    console.log(artistName);

    var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";

    console.log(queryUrl);
axios
.get(queryUrl)
.then(function(response) {
    var rd = response.data
    // console.log(response.data)
    // loop responses to show all venues provided
    for(var i= 0; i < rd.length; i++){
        let venue = rd[i].venue.name;
        let location = rd[i].venue.city + ", "+ rd[i].venue.country
        let dateBIT = rd[i].datetime
        let dateMoment = moment(dateBIT).format("MM/DD/YYYY") + "\n"
    console.log("Venue: " + venue + "\n"+"Location: " + location +"\n"+ dateMoment)}
});
}
    
function fileSystem (){
    fs.readFile("random.txt","utf8", function(error,data){
        if(error){
            return console.log(error);
        }
        console.log(data);

        var dataArr = data.split(",");
        var operator = dataArr[0];
        console.log(operator);
        var input = dataArr[1];
        console.log(input);

        switch(operator){
            case "spotify-this-song":
            spotify(input);
            break;

            case "movie-this":
            movie(input);
            break;

            case "concert-this":
            concert(input);
            break;

            default:
            text = "Please use a valid operator. movie-this, concert-this, or spotify-this-song"
        }


    })
}   




