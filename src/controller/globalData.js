import { asyncHandler } from "../utils/errorHandler/asyncHandler.js";
import { sidebarLinksModel } from "../models/sidebarLinks.js";


// Sidebar Links:
export const addSidebarLink = asyncHandler(async(req, res) => {
    const {title, link} = req?.body

    if(!title && !link){
        res.status(500).json({status: false, message: "Incomplete parameters"})
    }

    const payload = {
        title,
        link
    }

    const result = await sidebarLinksModel.create(payload)
    const data = await sidebarLinksModel.find()
    res.status(200).json({status: true, message: 'Sidebar Link added successfully', data: data})
})


export const getSidebarLinks = asyncHandler(async(req, res) => {
    
    const data = await sidebarLinksModel.find()
    res.status(200).json({status: true, message: 'Sidebar Links found successfully', data: data})

})

//-------------------
