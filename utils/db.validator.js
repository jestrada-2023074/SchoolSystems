//Validar datos que iran en validator (.custom())
import Course from '../src/course/course.model.js'
import User from '../src/users/user.model.js'

export const existCourse = async(name,course,id)=>{
    const alreadyCourse = await Course.findOne({name})
    if(alreadyCourse && alreadyCourse._id !=course.uid){
        console.error(`Course ${name} is already exist`)
        throw new Error(`Course ${name} is already exist`)
    }
}

export const existEmail = async(email,user)=>{
    const alreadyEmail = await User.findOne({email})
    if(alreadyEmail && alreadyEmail._id!=user.id){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const existUsername = async(username,user,id)=>{
    const alreadyEmail = await User.findOne({username})
    if(alreadyEmail && alreadyEmail._id!=user.id){
        console.error(`Username  ${username} is already taken`)
        throw new Error(`Username  ${username} is already taken`)
    }
}

export const notRequiredField=(field)=>{
    if(!field){
        throw new Error(`${field} is not required`)
    }
}