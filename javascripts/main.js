"use strict";



let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    login = require("./user"),
    firebase = require("firebase/app"),
    // currentUser = require("./currentuser");
    currentUser = null;


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("currentUser logged in", user.uid);
        currentUser = user.uid;
        loadSongsToDOM();
        // db.getSongs(templates.makeSongList, currentUser);

    } else {
        console.log("not logged in")
    }
});


// $('#auth-btn').hide();

// Using the REST API
function loadSongsToDOM() {
    console.log("hello")
    $(".uiContainer--wrapper").html("");
    db.getSongs(currentUser)
        .then(function(songData) {
            templates.makeSongList(songData)
        })
}
loadSongsToDOM();

// Send newSong data to db then reload DOM with updated song data
$(document).on("click", ".save_new_btn", function() {
    let songObj = buildSongObj();
    db.addSong(songObj)
        .then(function(songId) {
            console.log("song saved", songId);
            loadSongsToDOM();
        })

});

// Load and populate form for editing a song
$(document).on("click", ".edit-btn", function() {
    console.log("halloooo")
    let songId = $(this).data("edit-id");
    console.log(songId)
    db.getSong(songId)
        .then(function(song) {
            return templates.songForm(song, songId)
        })
        .then(function(finishedForm) {
            $(".uiContainer--wrapper").html(finishedForm);
        })
});

//Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
    let songObj = buildSongObj(),
        songId = $(this).attr("id");
    db.editSong(songObj, songId)
        .then(function(data) {
            console.log("edited song saved", data);
            loadSongsToDOM();
        });
});

// Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function() {
    db.deleteSong($(this).data("delete-id"))
        .then(function() {
            loadSongsToDOM();
        });
});


// *******************************************************
// Using the Firebase SDK and its auto update.
// Calling "getSongs" now sets up a listener when loading the DOM.
// Pass it a callback that handles the incoming data and it will re-call that
// function when anything changes in our data

// Use before adding Oauth, then move to Oauth callback
// db.getSongs(templates.makeSongList);

// No need to reload the DOM in the ".then"
// $(document).on("click", ".save_new_btn", function() {
//     let songObj = buildSongObj();
//     db.addSong(songObj)
//         .then(function(songData) {
//             console.log("songSaved", songData.key);
//         })
// });

// // // Load and populate form for editing a song
// $(document).on("click", ".edit-btn", function() {
//     let songId = $(this).data("edit-id");
//     db.getSong(songId)
//         .then(function(songData) {
//             let newSong = songData.val();
//             return templates.songForm(newSong, songId)
//                 .then(function(finishedForm) {
//                     $(".uiContainer--wrapper").html(finishedForm);
//                 });
//         });
// });

// // //Save edited song to FB then reload DOM with updated song data
// $(document).on("click", ".save_edit_btn", function() {
//     let songObj = buildSongObj();
//     let songId = $(this).attr('id');
//     db.editSong(songObj, songId);
// });

// // // Remove song then reload the DOM w/out new song
// $(document).on("click", ".delete-btn", function() {
//     let songId = $(this).data("delete-id");
//     console.log("it's gone!", $(this));
//     console.log(songId)
//     db.deleteSong(songId);
// });

// User login section. Should ideally be in its own module
$("#auth-btn").click(function() {
    console.log("clicked auth");
    login()
        .then(function(result) {
            var user = result.user;
            console.log("logged in user", user.uid);
            db.getSongs(templates.makeSongList);
        }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
});

// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
    // let userId = currentUser();
    let songObj = {
        title: $("#form--title").val(),
        artist: $("#form--artist").val(),
        album: $("#form--album").val(),
        year: $("#form--year").val(),
        uid: currentUser
    };
    return songObj;
}

// Load the new song form
$("#add-song").click(function() {
    console.log("clicked add song");
    var songForm = templates.songForm()
        .then(function(songForm) {
            $(".uiContainer--wrapper").html(songForm);
        });
});