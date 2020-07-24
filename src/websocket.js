const socketio = require('socket.io')
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');
const { Connection } = require('mongoose');

let io;
const connections = [];

exports.setupWebSocket = (server) => {

        io = socketio(server);
        console.log('Websocket connection is on')

    io.on('connection', socket => {
        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        })
    })
}

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item))
    })
}

exports.sendMsg = (to, msg ,data)=> {
    to.forEach(connection => {
        io.to(connection.id).emit(msg, data)
    })
}