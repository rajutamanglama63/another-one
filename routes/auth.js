const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models/user");
const auth = require("../middleware/auth");
 
const router = express.Router();

// user registeration
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    // if(!name || !email || !password) {
    //     return res.status(400).json({msg : "All fields are required."});
    // }

    try {
      let user = await User.findOne({email : email});
      if(user) {
          return res.status(400).json({msg : "User already exist."});
      }

      const salt = await bcrypt.genSalt(10);
      const hassedPassword = await bcrypt.hash(password, salt);

      user = new User({
          name,
          email,
          password : hassedPassword
      });

      await user.save();

    //   res.status(200).json(newUser);

      const token = await jwt.sign({_id : user._id, name: user.name, email: user.email}, process.env.JWT_SECRET, {expiresIn : 3600});

      res.send(token);

    //   res.status(200).json({
    //         token,
    //         user : {
    //             id : user._id,
    //             name : user.name,
    //             email : user.email
    //         }
    //     });

    } catch (error) {
        res.status(400).json({error : error.message});
    }
});

// user login
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    // if(!email || !password) {
    //     return res.status(400).json({msg : "All fields are required."});
    // }

    try {
        const user = await User.findOne({email : email});
        if(!user) {
            return res.status(400).json({msg : "User doesnot exist."})
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({msg : "Invalid credentials."});
        }
        
        const token = await jwt.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn : 3600});

        res.send(token);
        // res.status(200).json({
        //     token,
        //     user : {
        //         id : user._id,
        //         name : user.name,
        //         email : user.email
        //     }
        // });
    } catch (error) {
        res.status(400).json({error : error.message});
    }
});



module.exports = router;