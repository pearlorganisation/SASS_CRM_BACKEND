import mongoose from 'mongoose'

const sidebarLinksSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
    },
    link: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 2048,
    }
}, {timestamps: true})

export const sidebarLinksModel = mongoose.model("sidebarLinks", sidebarLinksSchema, "sidebarLinks")