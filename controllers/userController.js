const User = require('../models/userModel');

exports.getAllUsers = (req, res) =>{
    res.status(200).json({
        status: 'success',
        message:'Gets all the users'
    })
}
exports.getUser = (req, res) =>{
    res.status(200).json({
        status: 'success', 
        message: 'Get one user'
    })
}