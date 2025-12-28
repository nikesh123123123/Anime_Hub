import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
   
    username: {
        type: String,
        required: [true, "username is required"],
        unique: true, 
        trim: true,
        minlength: [3, "username must be at least 3 characters long"],
        lowercase: true 
    },
    emailid: {
        type: String,
        required: [true, "email id is required"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(value) {
                return value.includes('@') && value.includes('.');
            },
            message: "Please use a valid email address"
        }
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minlength: [6, "password must contain at least 6 characters"],
        trim: true,
        validate: {
            validator: function(value) {
                return /[a-zA-Z]/.test(value) && /[0-9]/.test(value);
            },
            message: "password should contain at least one number and letter"
        }
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
}, { timestamps: true }); 

const User = mongoose.model("User", UserSchema);
export default User;