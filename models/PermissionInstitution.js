const mongoose = require('mongoose');

const PermissionInstitutionSchema = mongoose.Schema(
    {
        institutionOwner_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        institutionLeaser_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        publicSendingRoleList: [
            {
                type: mongoose.Schema.Types.Number
            }
        ],
        allowedLeaserRoleList: [
            {
                type: mongoose.Schema.Types.Number
            }
        ],
        allowedLeaserDepartmentList: [
            {
                type: mongoose.Schema.Types.ObjectId
            }
        ],
        allowedLeaserMessageTypeList: [
            {
                type: mongoose.Schema.Types.Number
            }
        ],
        allowedLeaserMessagePriorityList: [
            {
                type: mongoose.Schema.Types.Number
            }
        ],
        insertUser_id: {
            type: mongoose.Schema.Types.ObjectId,
        },
        lastUpdateUser_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
        insertTimestamp: {
            type: mongoose.Schema.Types.Date,
            required: true,
            default: Date.now
        },
        lastUpdateTimestamp: {
            type: mongoose.Schema.Types.Date,
        },
        active: {
            type: mongoose.Schema.Types.Boolean,
            required: true,
            default: true
        }
    }
);

module.exports = mongoose.model('PermissionInstitution', PermissionInstitutionSchema);
