"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db

let $ = require('jquery'),
    firebase = require("./firebaseConfig"),
    fb = require("./fb-getter"),
    fbData = fb();
// ****************************************
// DB interaction using Firebase REST API
// ****************************************

// function getSongs() {
//     return new Promise(function(resolve, reject) {
//         $.ajax({
//             url: `${fbData.url}/.json`
//         }).done(function(songData) {
//             resolve(songData);
//         });
//     });
// }

// function addSong(songFormObj) {
//     return new Promise(function(resolve, reject) {
//         $.ajax({
//             url: "https://fir-musichistory.firebaseio.com/songs.json",
//             type: "POST",
//             data: JSON.stringify(songFormObj),
//             dataType: "json"
//         }).done(function(songId) {
//             resolve(songId);
//         });
//     });
// }

// function deleteSong(songId) {
//     return new Promise(function(resolve, reject) {
//         $.ajax({
//             url: `https://fir-musichistory.firebaseio.com/songs/${songId}.json`,
//             type: "DELETE",
//         }).done(function() {
//             resolve();
//         });
//     });
// }

// function getSong(songId) {
//     console.log(songId)
//     return new Promise(function(resolve, reject) {
//         $.ajax({
//             url: `https://fir-musichistory.firebaseio.com/songs/${songId}.json`
//         }).done(function(songData) {
//             resolve(songData);
//         });
//     });
// }

// function editSong(songFormObj, songId) {
//     return new Promise(function(resolve, reject) {
//         $.ajax({
//             url: `https://fir-musichistory.firebaseio.com/songs/${songId}.json`,
//             type: "PUT",
//             data: JSON.stringify(songFormObj)
//         }).done(function(data) {
//             resolve(data);
//         });
//     });
// }

// module.exports = {
//     getSongs,
//     addSong,
//     getSong,
//     deleteSong,
//     editSong
// };

// ****************************************
// DB interaction using Firebase SDK
// ****************************************
///***remove***once***update***\\\
function getSongs(callback) {
    firebase.database().ref('songs').on('value', function(songData) {
        console.log("something goes on");
        callback(songData.val());
    });
}

function addSong(newSong) {
    return firebase.database().ref("songs").push(newSong);
}

function deleteSong(songId) {
    return firebase.database().ref(`songs/${songId}`).remove();
    console.log("deleter")
}

function getSong(songId) {
    return firebase.database().ref(`songs/${songId}`).once("value");
    console.log("get song", songId);
}

function editSong(songFormObj, songId) {
    return firebase.database().ref(`songs/${songId}`).update(songFormObj);
}

module.exports = {
    getSongs,
    addSong,
    getSong,
    deleteSong,
    editSong
};