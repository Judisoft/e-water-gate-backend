const jwt = require('jsonwebtoken')
require('dotenv').config()

//auth, isMember, isAdmin


exports.auth = (req,res,next)=>{
    try {
        //extract JWT token
        const token = req.headers.authorization.split(' ')[1]; // req.body.token || req.cookies.token;
        console.log(token)
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing"
            })
        }

        //verify the token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            req.user = decode
            console.log(req.user)
        } catch (error) {
            return res.status(401).json({
                success:false,
                message: "Invalid Token "
            })
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success:false,
            message: "Error Occured in Authentication"
        })
    }
}

exports.isMember = (req,res,next)=>{
    try {
        console.log(req.user)
        if(req.user.role !=="Member"){
            return res.status(401).json({
                success:false,
                message: "You are not authorized Member"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Something error occured: "+error
        })
    }
}

exports.isAdmin = (req,res,next)=>{
    try {
        if(req.user.role !=="Admin"){
            return res.status(401).json({
                success:false,
                message: "You are not authorized Admin"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Something error occured⚠️: "+error
        })
    }
}

exports.isSysAdmin = (req,res,next)=>{
    try {
        if(req.user.role !=="SysAdmin"){
            return res.status(401).json({
                success:false,
                message: "You are not authorized SysAdmin⚠️"
            })
        }

        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: "Something error occured⚠️: "+error
        })
    }
}