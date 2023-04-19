import { Request, Response } from "express";
import { UserModel } from "../model/userModel";
import { registerUserSchema, loginUserSchema, variables } from "../utils/utils";
import { v4 as UUIDV4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const jwtsecret = process.env.JWT_SECRET!;

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, fullname, username, password, confirm_password } = req.body;

    const validationResult = registerUserSchema.validate(req.body);

    if (validationResult.error) {
      return res.render("Register", {
        error: validationResult.error.details[0].message,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.render("Register", { error: "Email already exists" });
    }

    const newUser = await UserModel.create({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.render("Register", { error: "User not found" });
    }

    const { _id } = user;
    const signatureToken = jwt.sign({ id: _id }, jwtsecret, {
      expiresIn: "30mins",
    });

    res.cookie("token", signatureToken, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });

    return res.redirect("/login");
  } catch (err) {
    console.log(err);
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validationResult = loginUserSchema.validate(req.body, variables);

    if (validationResult.error) {
      return res.render("login", {
        error: validationResult.error.details[0].message,
      });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.render("login", {
        error: "Invalid email or password",
      });
    }

    const { id } = user;

    const signatureToken = jwt.sign({ id }, jwtsecret, { expiresIn: "30d" });

    res.cookie("token", signatureToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return res.redirect("/dashboard");
    } else {
      return res.render("login", {
        error: "Invalid email or password",
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const Logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("/");
};

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
