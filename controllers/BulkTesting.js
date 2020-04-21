const mongoose = require("mongoose");
const Institution = require('../models/Institution');
const PermissionInstitution = require('../models/PermissionInstitution');

mongoose.connect("mongodb://localhost:27017/local", { useNewUrlParser: true })

exports.bulkUpdate = async (req, res, next) => {
    const institutionOwnerList = await Institution.find().lean();
    let arrayOfOperations = [];
    const arrayAllowedLeaserMessageTypeList = [3, 4, 5];
    const loggedInUserID = undefined;
    const time = Date.now();
    for (let i = 0; i < institutionOwnerList.length; i++) {
        for (let j = i + 1; j < institutionOwnerList.length; j++) {
            arrayOfOperations.push(
                {
                    "updateOne": {
                        "filter": { 
                            institutionOwner_id: institutionOwnerList[i]._id,
                            institutionLeaser_id: institutionOwnerList[j]._id,
                            active: true
                        },
                        "update": {
                            institutionOwner_id: institutionOwnerList[i]._id,
                            institutionLeaser_id: institutionOwnerList[j]._id,
                            allowedLeaserMessageTypeList: arrayAllowedLeaserMessageTypeList,
                            insertUser_id: loggedInUserID,
                            lastUpdateUser_id: loggedInUserID,
                            lastUpdateTimestamp: time
                        },
                        'upsert': true
                    }
                }
            );
            arrayOfOperations.push(
                {
                    "updateOne": {
                        "filter": { 
                            institutionOwner_id: institutionOwnerList[j]._id,
                            institutionLeaser_id: institutionOwnerList[i]._id,
                            active: true
                        },  
                        "update": {
                            institutionOwner_id: institutionOwnerList[j]._id,
                            institutionLeaser_id: institutionOwnerList[i]._id,
                            allowedLeaserMessageTypeList: arrayAllowedLeaserMessageTypeList,
                            insertUser_id: loggedInUserID,
                            lastUpdateUser_id: loggedInUserID,
                            lastUpdateTimestamp: time
                        },
                        'upsert': true
                    }
                }
            );

            // Jednom u 500
            if (arrayOfOperations.length % 500 === 0 ) {
                console.log(arrayOfOperations);
                await PermissionInstitution.collection.bulkWrite(
                    arrayOfOperations, 
                    { "ordered": true, w: 1 }
                ); 
                arrayOfOperations = [];
            }   
        }
    }
    if (arrayOfOperations.length) {
        console.log(`usao2`);
        await PermissionInstitution.collection.bulkWrite(arrayOfOperations);
    }                
        
    res.send();
};

exports.bulkInsert = async (req, res, next) => {
    const institutionOwnerList = await Institution.find().lean();
    const arrayAllowedLeaserMessageTypeList = [3, 4, 5];
    const loggedInUserID = undefined;
    const time = Date.now();
    let arrayOfOperations = [];
    for (let i = 0; i < institutionOwnerList.length; i++) {
        for (let j = i + 1; j < institutionOwnerList.length; j++) {
            arrayOfOperations.push({
                "insertOne": {
                    institutionOwner_id: institutionOwnerList[i]._id,
                    institutionLeaser_id: institutionOwnerList[j]._id,
                    allowedLeaserMessageTypeList: arrayAllowedLeaserMessageTypeList,
                    insertUser_id: loggedInUserID,
                    lastUpdateUser_id: loggedInUserID,
                }
            });
            arrayOfOperations.push({
                "insertOne": {
                    institutionOwner_id: institutionOwnerList[j]._id,
                    institutionLeaser_id: institutionOwnerList[i]._id,
                    allowedLeaserMessageTypeList: arrayAllowedLeaserMessageTypeList,
                    insertUser_id: loggedInUserID,
                    lastUpdateUser_id: loggedInUserID,
                    lastUpdateTimestamp: time
                }
            });

            // Jednom u 500
            if (arrayOfOperations.length % 500 === 0 ) {
                await PermissionInstitution.collection.bulkWrite(
                    arrayOfOperations, 
                    { "ordered": true, w: 1 }
                );                 
                arrayOfOperations = [];
            }   
        }
    }
    if (arrayOfOperations.length) {
        await PermissionInstitution.collection.bulkWrite(arrayOfOperations);
    }                
        
    res.send();
};

exports.insert = async (req, res, next) => {
    const institutionOwnerList = await Institution.find().lean();
    const arrayAllowedLeaserMessageTypeList = [3, 4, 5];
    const loggedInUserID = undefined;
    const time = Date.now();
    let arrayOfOperations = [];
    for (let i = 0; i < institutionOwnerList.length; i++) {
        for (let j = i + 1; j < institutionOwnerList.length; j++) {
            arrayOfOperations.push(
                {
                    institutionOwner_id: institutionOwnerList[i]._id,
                    institutionLeaser_id: institutionOwnerList[j]._id,
                    allowedLeaserMessageTypeList: arrayAllowedLeaserMessageTypeList,
                    insertUser_id: loggedInUserID,
                    lastUpdateUser_id: loggedInUserID,
                }
            );
            arrayOfOperations.push(
                {
                    institutionOwner_id: institutionOwnerList[j]._id,
                    institutionLeaser_id: institutionOwnerList[i]._id,
                    allowedLeaserMessageTypeList: arrayAllowedLeaserMessageTypeList,
                    insertUser_id: loggedInUserID,
                    lastUpdateUser_id: loggedInUserID,
                    lastUpdateTimestamp: time
                }
            );

            // Jednom u 500
            if (arrayOfOperations.length % 500 === 0 ) {
                await PermissionInstitution.insertMany(
                    arrayOfOperations,
                );                     
                arrayOfOperations = [];
            }   
        }
    }
    if (arrayOfOperations.length) {
        await PermissionInstitution.insertMany(
            arrayOfOperations,
        ); 
    }                
        
    res.send();
};
