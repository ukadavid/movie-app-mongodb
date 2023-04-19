import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../model/userModel";

const jwtsecret = process.env.JWT_SECRET as string;

/*===================================EJS===================================*/
export const auth = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.cookies.token;

    if (!authorization) {
      return res.redirect("/users/login");
    }

    const verifiedUser: any = jwt.verify(authorization, jwtsecret);

    if (!verifiedUser) {
      return res.redirect("/users/login");
    }

    const { id } = verifiedUser as { [key: string]: any };

    const user = await UserModel.findOne({ _id: id });

    if (!user) {
      return res.redirect("/users/login");
    }

    req.user = verifiedUser;
    next();
  } catch (err) {
    return res.redirect("/users/login");
  }
};

/* ====================API==================== */

// export const auth = async (req:Request | any, res:Response, next:NextFunction) => {
//     try {
//     //    const authorization = req.headers.authorization;

/** alternatively use req.cookies.jwt when using browser not local storage to store the token */

//        if (!authorization) {
//         return res.status(401).json({error: "Kindly sign in as user"})
//        }

//        const token = authorization.slice(7, authorization.length);

//        let verifiedUser = jwt.verify(token, jwtsecret);

//        if (!verifiedUser) {
//          return res.status(401).json({error: "Invalid token, you can't access this route"})
//        }

//        const { id } = verifiedUser as ({[key:string]: string});

//        const user = await UserInstance.findOne({where: {id}});

//        if(!user) {
//          return res.status(401).json({error: "Kindly register or sign in as user"})
//        }

//        req.user = verifiedUser
//        next();

//     } catch(err) {
//          return res.status(401).json({error: "User not logged in"})
//     }
// }
