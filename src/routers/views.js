const express = require('express')
const bodyParser = require('body-parser');
const passwordGenerator = require('generate-password');
const nodemailer = require('nodemailer');
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

        //Check if the keyphrase is correct, if not, return an error. This is to prevent unauthorized users from registering patients.
        const storedKeyphrase = "thisIsATestKeyphrase"; 
        if (req.body.keyphrase !== storedKeyphrase) {
            return res.status(401).send({ error: 'Invalid keyphrase.' });
        }

        currentLevel = await GameLevel.findLevelOne();
        currentLevel = currentLevel._id;
        //set this variable to the email of the practitioner
        const practitionerEmail = "defozex47@gmail.com";

        //Generates a random password
        const generatedPassword = passwordGenerator.generate({
            length: 10,
            numbers: true,
            uppercase: true,
            lowercase: true,
            symbols: false
        });


        //Save the patient with the generated password
        const patient = new Patient({
            ...req.body,
            password: generatedPassword,
            currentLevel
        });
        await patient.save();
        credentials = await Patient.findOne({ patientId: req.body.patientId }).select('patientId password');

        //Set up the email transporter
        let transporter = nodemailer.createTransport({
            service: 'outlook',
            auth: {
                user: 'sldwebapp@outlook.com', //Replace with the email you want to send from
                pass: 'farziemail@474' //Password for the email
            }
        });

        //Email options
        let mailOptions = {
            from: 'sldwebapp@outlook.com', //Replace with the email you want to send from
            to: practitionerEmail,
            subject: 'Patient Account Details',
            text: `Welcome! Here are the account details for the newly registered patient:

                    Username: ${req.body.patientId}
                    Password: ${generatedPassword}

                    Please keep these credentials safe and do not share them with anyone.`
        };

        //Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email: ', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.status(200).send(credentials);
    } catch (error) {
        console.log(error);
    }
});


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