const mongoose = require('mongoose');

const InstitutionSchema = mongoose.Schema(
    {
        username: {
            type: mongoose.Schema.Types.String,
            unique: true
        },
        code: {
            type: mongoose.Schema.Types.String
        },
        name: {
            type: mongoose.Schema.Types.String
        },
        nameShort: {
            type: mongoose.Schema.Types.String
        },
        displayOrder: {
            type: mongoose.Schema.Types.Number,
            index: true
        },
        description: {
            type: mongoose.Schema.Types.String
        },
        note: {
            type: mongoose.Schema.Types.String
        },
        active: {
            type: mongoose.Schema.Types.Boolean,
            default: true
        },
        external_id: {
            type: mongoose.Schema.Types.Number,
            index: true
        },
        institutionType_id: {
            type: mongoose.Schema.Types.Number
        },
        roleList: [
            {
                type: mongoose.Schema.Types.Number,
            }
        ],
        municipality_id: {
            type: mongoose.Schema.Types.Number
        },
        address: {
            type: mongoose.Schema.Types.String
        }
    }
);

module.exports = mongoose.model('Institution', InstitutionSchema);
