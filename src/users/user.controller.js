// Gestionar funciones de usuario

import User from './user.model.js'
import { checkPassword, encrypt } from '../../utils/encryp.js'
import { generateJwt } from '../../utils/jwt.js'

// Obtener todos los usuarios
export const getAll = async (req, res) => {
    try {
        const { limit = 20, skip = 0 } = req.query

        const users = await User.find()
            .skip(skip)
            .limit(limit)

        if (users.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'Users not found'
            })
        }

        return res.send({
            success: true,
            message: 'Users found:',
            users
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Obtener un usuario por ID
export const getUserid = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        return res.send({
            success: true,
            message: 'User found:',
            user
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Actualizar datos generales del usuario
export const update = async (req, res) => {
    try {
        const { id } = req.params
        const data = req.body

        const update = await User.findByIdAndUpdate(id, data, { new: true })

        if (!update) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        return res.send({
            success: true,
            message: 'User updated',
            user: update
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Eliminar usuario
export const deletedUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findByIdAndDelete(id)

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        return res.send({
            success: true,
            message: 'User removed successfully'
        })
    } catch (err) {
        console.error('General error', err)
        return res.status(500).send({
            success: false,
            message: 'General error',
            err
        })
    }
}

// Actualizar contraseña del usuario
export const updatePassword = async (req, res) => {
    try {
        const { id } = req.params
        const { oldPassword, newPassword } = req.body

        const user = await User.findById(id)

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        const isMatch = await checkPassword(user.password, oldPassword)

        if (!isMatch) {
            return res.status(400).send({
                success: false,
                message: 'Password is incorrect'
            })
        }

        user.password = await encrypt(newPassword)
        await user.save()

        return res.send({
            success: true,
            message: 'Password updated successfully'
        })
    } catch (error) {
        console.error('Error updating password:', error)
        return res.status(500).send({
            success: false,
            message: 'General error',
            error
        })
    }
}

// Agregar un nuevo usuario
export const add = async (req, res) => {
    try {
        const { course, ...data } = req.body
        const user = new User(data)
        user.course = course || []  // Si course no está presente, asigna un array vacío

        // Verifica si el usuario tiene más de 3 cursos
        if (user.course.length > 3) {
            return res.status(400).send({
                success: false,
                message: 'You cannot be assigned more than 3 courses'
            })
        }

        // Verifica si hay cursos duplicados
        if (new Set(user.course).size !== user.course.length) {
            return res.status(400).send({
                success: false,
                message: 'You already have this course'
            })
        }

        // Encripta la contraseña
        user.password = await encrypt(user.password)

        // Guarda el usuario en la base de datos
        await user.save()

        return res.send({
            message: `Registered successfully, can be logged with username: ${user.username}`
        })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: 'General error with user registration' })
    }
}

// Login de usuario
export const login = async (req, res) => {
    try {
        const { userLogin, password } = req.body
        const user = await User.findOne({
            $or: [{ email: userLogin }, { username: userLogin }]
        })

        if (user && await checkPassword(user.password, password)) {
            const loggedUser = {
                id: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }

            const token = await generateJwt(loggedUser)
            return res.send({
                message: `Welcome ${user.name}`,
                loggedUser,
                token
            })
        }

        return res.status(400).send({ message: 'Invalid Credentials' })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: 'General error with login function', e })
    }
}

// Ver los cursos asignados a un usuario
export const viewCourse = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).populate('course')

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            })
        }

        if (!user.course.length) {
            return res.status(200).send({
                success: true,
                message: 'User found, but no courses assigned',
                courses: []
            })
        }

        return res.status(200).send({
            success: true,
            message: 'User and courses found',
            courses: user.course
        })
    } catch (e) {
        console.error(e)
        return res.status(500).send({ message: 'Internal server error', e })
    }
}
