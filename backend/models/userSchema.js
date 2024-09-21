import mongoose from 'mongoose'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import JWT  from 'jsonwebtoken'



const userSchema = new mongoose.Schema({
    name : {
        type:String,
        required:[true,'Name is mandatoey'],
    },
    email :{
        type:String,
        required:[true,'Name is mandatoey'],
        unique: [true,'already registered email'],
    },
    password :{
        type :String,
        required :true,
        select: false
    },
    forgotPasswordToken:{
        type : String,
    },
    forgotPasswordExpiryDate:{
        type : Date,
    }

},{timestamps: true});

userSchema.pre('save', async function (next) {
    // If password is not modified then do not hash it
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  });
  
  
  userSchema.methods = {
    jwtToken() {
      return JWT.sign(
        { id: this._id, email: this.email },
        process.env.SECRET,
        { expiresIn: '24h' } 
      );
    },
  
    getForgotPasswordToken() {
      const forgotToken = crypto.randomBytes(20).toString('hex');
      this.forgotPasswordToken = crypto
        .createHash('sha256')
        .update(forgotToken)
        .digest('hex');


      this.forgotPasswordExpiryDate = Date.now() + 20 * 60 * 1000; 
      return forgotToken;
    },

  };

const userModel = mongoose.model('user',userSchema)
export default userModel;

