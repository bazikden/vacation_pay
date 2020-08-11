const User = require('../models/User')

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        res.json({ users })
    } catch (error) {
        res.status(500).json({ error })
    }
}

const postUser = async(req,res) => {
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if(user){
            res.status(400).json({msg:"Such user already exists"})
        }else{
            await User.create(req.body)
            res.json({success:true})
            
        }
    } catch (error) {
        res.status(500).json({error})
    }

}

const deleteUser = async(req,res) =>{
    try {
        const deleteUser = await User.findOneAndDelete({'_id':req.params.id})
        res.status(204).json({success:true})
    } catch (error) {
        res.status(500).json({error})   
    }
}

module.exports = { getAllUsers, postUser, deleteUser }