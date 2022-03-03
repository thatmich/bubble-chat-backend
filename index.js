const { v4: uuidv4 } = require('uuid');
var app = require('express')();
var http = require('http').createServer(app);
const PORT = 5000;
const socketIo = require('socket.io');

const images = ["https://upload.wikimedia.org/wikipedia/commons/5/5d/Pinguicula_vulgaris_flower_%28front_view%29_-_Keila.jpg", "https://upload.wikimedia.org/wikipedia/commons/b/bb/Pseudotsuga_menziesii_var._glauca_young_female_cone_-_Keila.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/c5/Petasites_hybridus_inflorescence_-_Keila.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/9e/Lion_%28Panthera_leo%29_male_6y.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/f3/Gemsbok_%28Oryx_gazella%29_male.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/8c/South-western_black_rhinoceros_%28Diceros_bicornis_occidentalis%29_female.jpg"];

var users = [];

const io = socketIo(http, {
    cors: {
        origin: 'http://localhost:8080'
    }
}) //in case server and client run on different urls

const STATIC_CHANNELS = ['global_notifications', 'global_chat'];

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
})

http.listen(PORT, err => {
    if (err) console.log(err)
    console.log('Server running on Port ', PORT)
})

io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
    console.log('new client connected');
    let newUser = {
        id: uuidv4(),
        name: "Default Name",
        img: images[Math.floor(Math.random()*images.length)],
        x: Math.floor(Math.random() * 1600),
        y: Math.floor(Math.random() * 800),
    }
    users.push(newUser);
    socket.emit('connection', {newUser, users});

    socket.on('disconnect', function () {
        console.log('Got disconnect!');
        var i = users.indexOf(newUser);
        users.splice(i, 1);
        console.log(users);
    });

    socket.on('move', (arg) =>{
        //console.log("Move! " + newUser.id +  " x: " + arg.x + " y: " + arg.y);
        //console.table(users);
        newUser.x = arg.x;
        newUser.y = arg.y;
        io.emit('update', users);
    });
});