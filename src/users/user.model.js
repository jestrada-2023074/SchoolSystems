import { Schema, model } from "mongoose";
import Course from '../course/course.model.js';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxLength: [25, 'Cannot exceed 25 characters']
    },
    surname: {
        type: String,
        required: [true, 'Surname is required'],
        maxLength: [25, 'Cannot exceed 25 characters']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        maxLength: [15, 'Cannot exceed 15 characters']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be at least 8 characters'],
        maxLength: [32, 'Cannot exceed 32 characters']
    },
    role: {
        type: String,
        default: 'STUDENT_ROLE',
        enum: ['TEACHER_ROLE', 'STUDENT_ROLE'],
        uppercase: true
    },
    course: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
})

userSchema.methods.toJSON = function() {
    const { __v, password, ...user } = this.toObject();
    return user;
}

export default model('User', userSchema)
