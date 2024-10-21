import mongoose from 'mongoose'

const globalDataSchema = mongoose.Schema({
    item: {
        type: [],
        required: true
    },
    itemType: {
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    subTitle:{
        type: String,
    }
}, {timestamps: true})

export const globalDataModel = mongoose.model("globalData", globalDataSchema, "globalData")