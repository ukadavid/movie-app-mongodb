"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = exports.Login = exports.Register = void 0;
const userModel_1 = require("../model/userModel");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtsecret = process.env.JWT_SECRET;
const Register = async (req, res) => {
    try {
        const { email, fullname, username, password, confirm_password } = req.body;
        const validationResult = utils_1.registerUserSchema.validate(req.body);
        if (validationResult.error) {
            return res.render("Register", {
                error: validationResult.error.details[0].message,
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const existingUser = await userModel_1.UserModel.findOne({ email });
        if (existingUser) {
            return res.render("Register", { error: "Email already exists" });
        }
        const newUser = await userModel_1.UserModel.create({
            fullname,
            username,
            email,
            password: hashedPassword,
        });
        const user = await userModel_1.UserModel.findOne({ email });
        if (!user) {
            return res.render("Register", { error: "User not found" });
        }
        const { _id } = user;
        const signatureToken = jsonwebtoken_1.default.sign({ id: _id }, jwtsecret, {
            expiresIn: "30mins",
        });
        res.cookie("token", signatureToken, {
            httpOnly: true,
            maxAge: 30 * 60 * 1000,
        });
        return res.redirect("/login");
    }
    catch (err) {
        console.log(err);
    }
};
exports.Register = Register;
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const validationResult = utils_1.loginUserSchema.validate(req.body, utils_1.variables);
        if (validationResult.error) {
            return res.render("login", {
                error: validationResult.error.details[0].message,
            });
        }
        const user = await userModel_1.UserModel.findOne({ email });
        if (!user) {
            return res.render("login", {
                error: "Invalid email or password",
            });
        }
        const { id } = user;
        const signatureToken = jsonwebtoken_1.default.sign({ id }, jwtsecret, { expiresIn: "30d" });
        res.cookie("token", signatureToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (isMatch) {
            return res.redirect("/dashboard");
        }
        else {
            return res.render("login", {
                error: "Invalid email or password",
            });
        }
    }
    catch (err) {
        console.error(err);
    }
};
exports.Login = Login;
const Logout = async (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
};
exports.Logout = Logout;
// export const getUserAndMovies = async (req: Request, res: Response) => {
//   try {
//     const getAllUserMovies = await UserInstance.findAndCountAll({
//       include: [
//         {
//           model: MovieInstance,
//           as: "movies",
//         },
//       ],
//     });
//     return res.status(200).json({
//       msg: "All data retrieved successfully",
//       count: getAllUserMovies.count,
//       users: getAllUserMovies.rows,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
/* ==================USER API=================== */
// export const Register = async (req: Request, res: Response) => {
//   try {
//     const { fullname, username, email, password, confirm_password } = req.body;
//     const iduuid = UUIDV4();
//     const validationResult = registerUserSchema.validate(req.body, variables);
//     if (validationResult.error) {
//       return res
//         .status(400)
//         .json({ Error: validationResult.error.details[0].message });
//     }
//     const hidePassword = await bcrypt.hash(password, 12);
//     const user = await UserInstance.findOne({
//       where: { email: email },
//     });
//     if (!user) {
//       let newUser = await UserInstance.create({
//         id: iduuid,
//         fullname,
//         username,
//         email,
//         password: hidePassword,
//       });
//       const User = (await UserInstance.findOne({
//         where: { email: email },
//       })) as unknown as { [key: string]: string };
//       const { id } = User;
//       const signatureToken = jwt.sign({ id }, jwtsecret, {
//         expiresIn: "30mins",
//       });
//       res.cookie("token", signatureToken, {
//         httpOnly: true,
//         maxAge: 30 * 60 * 1000,
//       });
//       return res.status(200).json({
//         msg: "User registered successfully",
//       });
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ Error: "Internal server error" });
//   }
// };
// export const Login = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;
//     const validationResult = loginUserSchema.validate(req.body, variables);
//     if (validationResult.error) {
//       return res
//         .status(400)
//         .json({ Error: validationResult.error.details[0].message });
//     }
//     const User = (await UserInstance.findOne({
//       where: { email: email },
//     })) as unknown as { [key: string]: string };
//     const { id } = User;
//     const signatureToken = jwt.sign({ id }, jwtsecret, { expiresIn: "30d" });
//     res.cookie("token", signatureToken, {
//       httpOnly: true,
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//     });
//     const regUser = await bcrypt.compare(password, User.password);
//     if (regUser) {
//       return res.status(201).json({
//         msg: "Logged in successfully",
//         signatureToken,
//       });
//     }
//     return res.status(400).json({ Error: "Invalid email or password" });
//   } catch (err) {
//     console.log(err);
//   }
// };
// export const Logout = async (req: Request, res: Response) => {
//   res.clearCookie("token");
//   res.status(201).json({
//     msg: "Logged out successfully",
//   });
// };
// export const getUserAndMovies = async (req: Request, res: Response) => {
//   try {
//     const getAllUserMovies = await UserInstance.findAndCountAll({
//       include: [
//         {
//           model: MovieInstance,
//           as: "movies",
//         },
//       ],
//     });
//     return res.status(200).json({
//       msg: "All data retrieved successfully",
//       count: getAllUserMovies.count,
//       users: getAllUserMovies.rows,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };
