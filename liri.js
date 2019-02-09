require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var moment = require("moment")
var axios = require("axios");
var fs = require("fs");

var inputs = process.argv;
var operator = process.argv[2];

// Testing for correct operator from input
// console.log(operator);
var liriInput = process.argv.slice(3).join(" ")

// console.log(liriInput);

switch (operator) {
    case "movie-this":
    movie(liriInput);
    break;

    case "concert-this":
    concert(liriInput);
    break;

    case "spotify-this-song":
    spotify(liriInput);
    break;

    case "do-what-it-says":
    fileSystem(liriInput);
    break;

    default:
    text = "Please use a valid operator. movie-this, concert-this, or spotify-this-song"

}





function movie(liriInput){
// set empty value to "Mr. Nobody"
if (!liriInput){
    movieName = "Mr. Nobody"
} else {
    movieName = liriInput;
}
// 
// console.log(movieName);

var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
// Testing url
// console.log(queryUrl);

axios.get(queryUrl).then(
  function(response) {
    // console.log(response.data);
    var rd = response.data
   
    
    console.log(`
    Title: ${rd.Title}
    Released: ${rd.Year}
    IMDB Rating: ${rd.imdbRating}
    Rotten Tomatoes Rating: ${rd.Ratings[1].Value}
    Country: ${rd.Country}
    Language: ${rd.Language}
    Plot:${rd.Plot}
    Actors:${rd.Actors}
    `)
    }
    );
    }


function spotify(liriInput){
// set empty value to "The Sign by Ace of Base"
    if (!liriInput){
        songName = "The Sign Ace of Base"
    } else {
        songName = liriInput;
    }
    


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

        console.log(`
        Artist: ${artist}
        Song Name: ${songName}
        Preview: ${previewUrl}
        Album: ${album}
        `)
    })
}


function concert(liriInput){
var queryUrl = "https://rest.bandsintown.com/artists/" + liriInput + "/events?app_id=codingbootcamp";

    // console.log(queryUrl);
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
    
    console.log(`
    Venue: ${venue}
    Location: ${location}
    Date: ${dateMoment}
    `)}
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




