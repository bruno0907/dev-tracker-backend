const axios = require('axios')
const parseStringAsArray = require('../utils/parseStringAsArray')

const { findConnections, sendMsg } = require('../websocket')

const Dev = require('../models/Dev')
const { index } = require('../models/utils/PointSchema')

module.exports = {
    async index(req, res) {
        const devs = await Dev.find()
        return res.json(devs)
    },

    async store(req, res) {
        const { github_username, techs, latitude, longitude } = req.body

        let dev = await Dev.findOne({ github_username })

        if(!dev) {
            const response = await axios.get(`https://api.github.com/users/${github_username}`)
        
            const { name = login, avatar_url, bio } = response.data
        
            const techsArray = parseStringAsArray(techs)
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            }
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            })

            // Filtrar conexões que estão no máximo 10km de distância
            // e que novo dev atenda as techs filtradas

            const sendSocketMsgTo = findConnections(
                { latitude, longitude, },
                techsArray,
            )
            sendMsg(sendSocketMsgTo, 'newDev', dev);
        }    
    
        return res.json(dev)
    }
}