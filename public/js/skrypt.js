/* jshint browser: true, globalstrict: true, devel: true */
/* global io: false */
"use strict";

// Inicjalizacja
document.addEventListener("DOMContentLoaded", function (event) {
    var status = document.getElementById("status");
    var open = document.getElementById("open");
    var close = document.getElementById("close");
    var send = document.getElementById("send");
    var text = document.getElementById("text");
    var nick = document.getElementById("nick");
    var message = document.getElementById("message");
    var userList = document.getElementById("userList");
    var socket;

    status.textContent = "Brak połącznia";
    close.disabled = true;
    send.disabled = true;

    // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
    open.addEventListener("click", function (event) {
        open.disabled = true;
        if (!socket || !socket.connected) {
            socket = io({forceNew: true});
        }
        socket.on('connect', function () {
            close.disabled = false;
            send.disabled = false;
            nick.disabled = true;
            status.src = "img/bullet_green.png";
            console.log('Nawiązano połączenie przez Socket.io');
            
        });
        socket.on('disconnect', function () {
            
            open.disabled = false;
            nick.disabled = false;
            status.src = "img/bullet_red.png";
            console.log('Połączenie przez Socket.io zostało zakończone');
        });
        socket.on("error", function (err) {
            message.textContent = "Błąd połączenia z serwerem: '" + JSON.stringify(err) + "'";
        });
        socket.on("echo", function (data) {
            var mess = document.createElement("p");
            mess.innerHTML = data;
            message.appendChild(mess);
        });
        socket.on("userChange", function(data) {
            var userChange = document.createElement("p");
            userChange.classList.add("userChange");
            userChange.textContent = data;
            message.appendChild(userChange);
        });
        socket.on("userList", function(data) {
            console.log("userList: " + data);
            userList.innerHTML = "";
            for(var i in data) {
                   var user = document.createElement("li");
                   user.classList.add("user");
                   user.textContent = data[i];
                   userList.appendChild(user);
            } 
        });
        
        socket.emit('userConnected', nick.value);
    });
    
    // Zamknij połączenie po kliknięciu guzika „Rozłącz”
    close.addEventListener("click", function (event) {
        close.disabled = true;
        send.disabled = true;
        open.disabled = false;
        socket.io.disconnect();
        console.dir(socket);
    });

    // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
    send.addEventListener("click", function (event) {
        socket.emit('message', {nick: nick.value, message: text.value});
        console.log('Wysłałem wiadomość: ' + text.value);
        text.value = "";
    });
});
