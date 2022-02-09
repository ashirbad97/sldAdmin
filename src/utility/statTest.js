const mongoose = require('../db/mongoose')
const GameLevel = require('../models/gameLevel')
const Patient = require('../models/patients')
const SubModule = require('../models/subModules')
const Word = require('../models/words')
const Session = require('../models/session')
const Scores = require('../models/score')
const { ObjectId } = require('mongodb');
var wordList = []
var wordIdArr = []
var finalWordList = []

complianceData = new Object()
complianceData.totalCompletedWords = 0
complianceData.uniqueList = 0
complianceData.totalWords = 0
complianceData.compliancePerc = 0

stats_Sessions = async (patientId) => {
    try {
        counter = 0
        subject = await Patient.findOne({ patientId }).select('-tokens').populate({
            path: 'sessions',
            populate: {
                path: 'scores'
            }
        })
        subjectSessions = await subject.toObject({ virtuals: true }).sessions
        // console.log(subjectSessions)
        return subjectSessions
    } catch (error) {
        console.log(error)
    }
}

computeSession = async (subjectSessions) => {
    for (i = 0; i < subjectSessions.length; i++) {
        // console.log(subjectSessions[i].scores)
        if (subjectSessions[i].scores.length != 0) {
            individualSessionScores = subjectSessions[i].scores
            // console.log(individualSessionScores.length)
            for (j = 0; j < individualSessionScores.length; j++) {
                // console.log(individualSessionScores[j])
                wordName = await Word.findById(individualSessionScores[j].wordId)
                // console.log("Word is : ", wordName)
                wordIdArr.push(individualSessionScores[j].wordId)
            }
        }
    }
    return wordIdArr
}

findWordDs = async (wordIdArr) => {
    for (i = 0; i < wordIdArr.length; i++) {
        wordDetails = await Word.findOne({ '_id': wordIdArr[i] })
        wordList.push(wordDetails.word)
    }
    return wordList
}

countUniqueWords = async (wordList) => {
    console.log("Size of total completed wordlist is ", wordList.length)
    complianceData.totalCompletedWords = wordList.length
    wordList.forEach(word => {
        if (finalWordList.includes(word)) {
            // console.log("Duplicate Entry found for ", word)
        } else {
            // console.log("Entering word ", word)
            finalWordList.push(word)
        }
    });
    return finalWordList
}

complianceWordCount = async (uniqueWords_length) => {
    console.log("Size of final list is ", uniqueWords_length)
    complianceData.uniqueList = uniqueWords_length
    complianceData.totalWords = await Word.find().count()
    console.log("Total Words are : ", complianceData.totalWords)
    complianceData.compliancePerc = (uniqueWords_length / complianceData.totalWords) * 100
    console.log("Compliance Rate is ", complianceData.compliancePerc)
}

// Function call area
stats_Sessions(patientId = "SLD10").then((subjectSessions) => {
    computeSession(subjectSessions).then((wordIdArr) => {
        findWordDs(wordIdArr).then((wordList) => {
            countUniqueWords(wordList).then((finalWordList) => {
                complianceWordCount(finalWordList.length).then(() => {
                    console.log(complianceData)
                    // return complianceData
                })
            })
        })
    })
})

module.exports = { stats_Sessions }