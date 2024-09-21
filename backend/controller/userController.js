import userModel from "../models/userSchema.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import emailValidator from "email-validator"
import nodemailer from "nodemailer"

export const login = async(req,res)=>{
    const { email, password } = req.body;

    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "email and password are required"
      });
    }
  
    try {
    
      const user = await userModel
        .findOne({
          email
        })
        .select("+password");
  
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({
          success: true,
          message: "invalid credentials"
        });
      }
  
      
      const token = user.jwtToken();
      user.password = undefined;
  
      const cookieOption = {
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: true 
      };
  
      res.cookie("token", token, cookieOption);
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }  
};







export const signup = async(req,res)=>{
    const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Every field is required"
    });
  }

 
  const validEmail = emailValidator.validate(email);
  if (!validEmail) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address 📩"
    });
  }

  try {
    
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm Password does not match ❌"
      });
    }

    const userInfo = new userModel(req.body);
    console.log(userInfo)

    const result = await userInfo.save();
    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: `Account already exist with the provided email ${email} 😒`
      });
    }

    return res.status(400).json({
      message: error.message
    });
  }
    
}


export const logout = async (req, res, next) => {
    try {
      const cookieOption = {
        expires: new Date(), 
        httpOnly: true 
      };
  
      
      res.cookie("token", null, cookieOption);
      res.status(200).json({
        success: true,
        message: "Logged Out"
      });
    } catch (error) {
      res.stats(400).json({
        success: false,
        message: error.message
      });
    }
  };


export const getUser = async (req, res) => {
    const userId = req.user.id;
    try {
      const user = await userModel.findById(userId);
      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };



export const forgotPassword = async (req, res, next) => {
    const email = req.body.email;
  
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }
  
    try {
      
      const user = await userModel.findOne({
        email
      });
  
     
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "user not found 🙅"
        });
      }
  
      
      const forgotPasswordToken = user.getForgotPasswordToken();
      console.log(forgotPasswordToken);
      
  
      await user.save();

      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,                
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      const resetUrl = `${process.env.CLIENT_URL}/reset-password/${forgotPasswordToken}`;

      // Send password reset email
      await transporter.sendMail({
        to: email,
        from: process.env.SMTP_USER,
        subject: 'Password Reset Request',
        html: `<p>You requested a password reset</p>
               <p>Click this <a href="${resetUrl}">link</a> to reset your password. The link will expire in 1 hour.</p>`,
      });
  
      return res.status(200).json({
        success: true,
        message: 'Password reset link is successfully send to your mail id'
      });

    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };

  
export const resetPassword = async (req, res, next) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    console.log(token);
    
  
    // return error message if password or confirmPassword is missing
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirmPassword is required"
      });
    }
  
    // return error message if password and confirmPassword  are not same
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm Password does not match ❌"
      });
    }
  
    const hashToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashToken);
    
    try {
      const user = await userModel.findOne({
        forgotPasswordToken: hashToken,
        forgotPasswordExpiryDate: {
          $gt: new Date() // forgotPasswordExpiryDate() less the current date
        }
      });
  
      // return the message if user not found
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid Token or token is expired"
        });
      }
  
      user.password = password;
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "successfully reset the password"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  };