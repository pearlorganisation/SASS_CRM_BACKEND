import dotenv from 'dotenv'
dotenv.config()

const role = JSON.parse(process.env.ROLES)

const superAdminRoleChecker = (idx) => {    
    if(role[idx] === "Super Admin") return true
    return false
}

