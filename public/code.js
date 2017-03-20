


/*
var username;
var params = getHashParams();
var access_token = params.access_token;
var refresh_token = params.refresh_token;
var error = params.error;
var song_list = [];

if (error) {
    alert('There was an error during the authentication');
    }

else {
    if (access_token) {
        ///***add this (to 'clean' url once you can refresh and stay logged in
//        window.location.replace("http://localhost:8888");
        console.log("retreiving username...");
        getUserProfile();   //get username
        console.log("retreiving playlists");
        getUserPlaylists(); //also updates table of playlists
        
    }

    else { // render initial screen
      $('#login').show();
      $('#playlists').hide();
    }

}

//request users spotify playlists
function getUserPlaylists() { ///consider merging updatePlaylistsTable() with this
    $.ajax({ //use the jquery ajax method to make a request from spotify
        url: 'https://api.spotify.com/v1/me/playlists',
        headers: {'Authorization': 'Bearer ' + access_token},
        success: function(response) {
            updatePlaylistsTable(response);

            $('#login').hide();
            $('#playlists').show();
        }
    });
}

function updatePlaylistsTable(response) { //requires the playlist request response
    var plc = document.getElementById('all-playlists');

    for(var i=0; i<response.total; i++) { //loop through songs in response
        var list = response.items[i]; //playlist i
        plc.innerHTML += "<tr class='clickable-row' id='" + list.id + "'><td>" + list.name + "</td></tr>";

        jQuery(document).ready(function() {
            var playId;
            $(".clickable-row").click(function() { //retreives a specific playlist when it's name is clicked
                $('#all-playlists tr').each( function(index) {
                    $(this).removeClass("success"); //remove all hilighted rows
                });
                song_list = []; //clear song_list
                $("#dl-btn").removeClass("disabled");
                $(this).addClass('success'); //turn this row green
                playId = $(this).context.id;
                getPlaylistTracks(playId);
            });
        });
    }
}

function getPlaylistTracks(playId, link=0) { //link is optional. used for calls after 1st
    //useful: link = res.tracks.next //null if all tracks have been retreived
    var extraCall = false;
    if(!link)
        link = 'https://api.spotify.com/v1/users/' + username + '/playlists/' + playId;
    else
        extraCall = true;
    
    console.log("link = " + link);
        $.ajax({ //GET the playlist's tracks by making another request
            url: link,
            headers: {'Authorization': 'Bearer ' + access_token},
            success: function(res) {
                addTracksToTable(res, extraCall);
                if(!extraCall)
                    console.log("next: " + res.tracks.next);
            }
        });
        
}

function addTracksToTable(res, extraCall) {
    console.log("playlist tracks:"); console.log(res);
    console.log("extraCall=" + extraCall);
    var plc = document.getElementById('track-list');

    if(!extraCall) {///***instead of extraCall we could maybe check if res.tracks is null
        plc.innerHTML = ""; //reset song list
        var total = res.tracks.total;
        var tracks = res.tracks.items;
        var offset = 0;
    }
    else {
        var total = res.total-res.offset;
        var tracks = res.items;
        var offset = res.offset;
    }
    
    console.log("total= " + total);
    if(total>100)
        total=100; //only 100 can be accessed at a time
    
    ///***allow sorting by track or artist by clicking on the table head
    //populate table with tracks (and their details)
    for(var i=0; i<total; i++) {
        var temp = "<tr><td>" + (i+1+offset) + "</td><td>" + tracks[i].track.name + "</td><td>";
        var numArtists = tracks[i].track.artists.length;
        var artist = [];        
        
        for(var a=0; a<numArtists; a++) {
            temp = temp + "<div>" + tracks[i].track.artists[a].name + "</div>";
            artist.push(tracks[i].track.artists[a].name);
        }
        temp = temp + "</div></td>" + "<td>" + tracks[i].track.album.name + "</td>";
        
        song_list.push({ //keep a list of the songs (to possibly be downloaded later)
            name: tracks[i].track.name,
            artists: artist
        });

        ///***fix rounding issue that makes it off by 1 second sometimes
        //use? https://coderwall.com/p/wkdefg/converting-milliseconds-to-hh-mm-ss-mmm
        var dur_ms = tracks[i].track.duration_ms; //duration in ms
        var dur_min = Math.floor(dur_ms/1000/60);
        var dur_sec = Math.floor((dur_ms/1000/60-dur_min)*60);
        if(dur_sec < 10)
            var dur = dur_min + ':0' + dur_sec;
        else
            var dur = dur_min + ':' + dur_sec;
        temp = temp + "<td>" + dur + "</td></tr>";
        plc.innerHTML += temp; //if you += the parts separately the formatting is off
        
    }
    
    if(!extraCall && res.tracks.next !== null) { //fix for 2nd call
        console.log("not all tracks were added yet");
        getPlaylistTracks(res.id, res.tracks.next);
    }
    else if((res.total-res.offset)>100) {
        console.log("not all tracks were added yet");
        getPlaylistTracks(res.id, res.next);
    }
    else
        console.log(song_list);
        
}


function getUserProfile() {
    $.ajax({ //GET the playlist's tracks by making another request
        url: 'https://api.spotify.com/v1/me',
        headers: {'Authorization': 'Bearer ' + access_token},
        success: function(response) {
            username = response.id;
        }
    });
}


function getHashParams() { //Obtains parameters from the hash of the URL
    var hashParams = {};
    var e;
    var r = /([^&;=]+)=?([^&;]*)/g; //a regular expression literal. http://www.regexr.com/
    var q = window.location.hash.substring(1); //the rest of the url after the #. ex:
    
    //loop through url params after the '#' and store their names and values
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}

function refreshToken() { //calls app.js
    $.ajax({
        url: '/refresh_token',
        data: { 'refresh_token': refresh_token}
    }).done(function(data) {
        access_token = data.access_token; //update access token
    });

}
*/
