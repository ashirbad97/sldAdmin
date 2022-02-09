const express = require('express')
const router = new express.Router()
const Patient = require('../models/patients')
// const auth = require('../middleware/authentication')
const GameLevel = require('../models/gameLevel')
const SubModule = require('../models/subModules')
const Word = require('../models/words')
const Session = require('../models/session')
const Score = require('../models/score')


// Different Categrory Router
router.get('/', async (req, res) => {
    try {
        console.log("Triggered")
        const patient = await Patient.find()
        const allData = await Patient.findAllPatientDetails()
        const allStats = await findStats()
        res.render('adminPatientList', { allData, allStats })
    } catch (error) {
        console.log(error)
    }
})

router.post('/addPatientFormData', async (req, res) => {
    try {
        currentLevel = await GameLevel.findLevelOne()
        currentLevel = currentLevel._id
        const patient = new Patient({
            ...req.body,
            currentLevel
        })
        await patient.save()
        credentials = await Patient.findOne({ patientId: req.body.patientId }).select('patientId password')
        res.status(200).send(credentials)
    }
    catch (error) {
        console.log(error)
    }
})

router.post('/', async (req, res) => {
    try {
        res.status(200)
        var patient = await Patient.authenticateuser(req.body.username, req.body.password)
        const token = await patient.generateAuthToken()
        patient = await patient.trimPatientData()
        if (!token) {
            throw error()
        }
        res.cookie('auth_token', token).render('gameHome', { patient })
    } catch (e) {
        console.log(e)
        res.render('login', { e })
    }
})
// ```````````````````````````````````````````````````````
// Function Later to be shifted into a new file
findStats = async () => {
    stats = new Object()
    stats.patientCount = await Patient.find().count()
    stats.totalSessionCount = await Session.find().count()
    stats.noOfModules = 8
    return stats
}
// ```````````````````````````````````````````````````````
module.exports = router