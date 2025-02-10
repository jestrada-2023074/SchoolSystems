import Course from "./course.model.js";
import User from '../users/user.model.js';

// Agregar curso
export const Add = async (req, res) => {
    try {
        let data = req.body;
        let course = new Course(data)
        await course.save()
        
        return res.status(200).send({
            success: true,
            message: 'Course saved successfully',
            course
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: 'Internal server Error',
            err
        })
    }
}

// Listar cursos
export const list = async (req, res) => {
    try {
        const coursesList = await Course.find();
        
        if (coursesList.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No courses available yet'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Courses Available',
            coursesList
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: 'Internal Server Error',
            err
        })
    }
}

// Actualizar curso
export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params
        const teacherId = req.user.id
        const data = req.body
        
        const teacher = await User.findById(teacherId);
        
        if (!teacher.course || !teacher.course.includes(id)) {
            return res.status(403).send({
                success: false,
                message: 'Forbidden: You are not assigned to this course'
            })
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, data, { new: true });

        if (!updatedCourse) {
            return res.status(404).send({
                success: false,
                message: 'Course not found'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Course updated successfully',
            course: updatedCourse
        })
    } catch (err) {
        console.error(err)
        return res.status(500).send({
            message: 'Internal Server Error',
            err
        })
    }
}

// Eliminar curso
export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;
        const teacher = await User.findById(teacherId);

        if (!teacher.course || !teacher.course.includes(id)) {
            return res.status(403).send({
                success: false,
                message: 'You are not assigned to this course'
            })
        }

        const deletedCourse = await Course.findByIdAndDelete(id);

        if (!deletedCourse) {
            return res.status(404).send({
                success: false,
                message: 'Course not found'
            })
        }

        return res.status(200).send({
            success: true,
            message: 'Course deleted successfully',
        })
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: 'Internal Server Error',
            err
        })
    }
}