'use strict';

let firebase = require("./firebaseConfig"),

    currentUser = null;

function getUser() {
    return currentUser;
}

function setUser(user) {
    currentUser = user; //firebase.auth().currentUser.uid;
}

module.exports = {
    getUser, setUser
};