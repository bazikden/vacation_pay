const Admin = require("../models/Admin")



const signup = async(req,res) => {
    const {email,password} = req.body
    try {
        const user = await Admin.findOne({email})
        if(!user){
            await Admin.create({email,password,isAdmin:true,isSuperAdmin:false})
            res.status(201).json({success:true})
        }else{
            res.status(400).json({error:"Such user already exists"})
        }
        
    } catch (error) {
        res.status(500).json(error)
    }

}

const login = async (req, res) => {
    const {email,password} = req.body
    try {
        const admin = await Admin.find()
        const data = {}
        if (admin.length === 0) {
            Object.assign(data,{ ...req.body, isSuperAdmin: true, isAdmin: true })
            const user  = await Admin.create(data)
            const token = await user.generateToken()
            res.json({token})
        } else {
            Object.assign(data,{ ...req.body, isAdmin: true, isSuperAdmin: false })
            const user = await Admin.findOne({"email":email})
            console.log("user",user)
            if(user){
                const match = await user.comparePasswords(password)
                if(match){
                    const token = await user.generateToken()
                    res.json({token})
                }else{
                    res.status(400).json({error:"Invalid credantials"})
                }

            }else{
                res.status(400).json({error:'Invalid credentials'})

            }
        }

    } catch (error) {
        res.status(500).json(error)
    }

}

const authenticate = (req,res) =>  {
    const user = req.user
    res.json({user})
    
}

module.exports = { login, signup, authenticate }