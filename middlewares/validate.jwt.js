'use strict'

import jwt from 'jsonwebtoken'

export const validateJwt = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            let secretKey = process.env.SECRET_KEY
            let { authorization } = req.headers
            console.log(authorization)
            if (!authorization) {
                return res.status(401).send({ message: 'Unauthorized' })
            }
             
            let user = jwt.verify(authorization, secretKey)
            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                return res.status(403).send({ message: 'Insufficient permissions' });
            }

            req.user = user;
            next()
        } catch (e) {
            console.error(e);
            return res.status(401).send({ message: 'Invalid token' })
        }
    }
}
