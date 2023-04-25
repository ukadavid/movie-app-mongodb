import Joi from 'joi'

export const registerUserSchema = Joi.object().keys({
    fullname: Joi.string().required(),
    username: Joi.string().required(), 
    email: Joi.string().trim().lowercase().required(), 
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,8}$/).required(), 
    // .label('Password').messages({'any.only': '{#label} must contain only alphabets and numbers' }),
    confirm_password: Joi.any().equal(Joi.ref('password')).required().label('Confirm password').messages({'any.only': '{#label} does not match' })
})

export const options = {
    abortEarly: false,
    errors: { 
        wrap: {
            label: ''
        }
    }
}

export const loginUserSchema = Joi.object().keys({
    email: Joi.string().required(), 
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,8}$/).required()
})

export const addMovieSchema = Joi.object().keys({
    title: Joi.string().required(), 
    description: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required()
})

export const editMovieSchema = Joi.object().keys({
    title: Joi.string(), 
    description: Joi.string(),
    image: Joi.string(),
    price: Joi.number()
})
