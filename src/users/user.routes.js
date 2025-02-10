import { Router } from "express";
import { UserValidator } from "../../middlewares/validator.js";
import { add, deletedUser, login, update, viewCourse, getAll } from "./user.controller.js";
import { validateJwt } from "../../middlewares/validate.jwt.js";



const api = Router();

api.post('/User/add', UserValidator,add)
api.get('/User/list/', validateJwt(['TEACHER_ROLE', 'STUDENT_ROLE']), getAll)
api.post('/User/login',login)
api.get('/User/list/:id', validateJwt(['TEACHER_ROLE', 'STUDENT_ROLE']), viewCourse)
api.put('/User/updateUser/:id',validateJwt(['STUDENT_ROLE']),update)
api.delete('/User/deleteUser/:id',validateJwt(['STUDENT_ROLE']),deletedUser)

export default api;