// import { Request, Response } from "express";
// import { MovieInstance } from "../model/moviesModel";
// import { UserInstance } from "../model/userModel";
// import { v4 as uuidv4 } from "uuid";
// import { MovieUserSchema, editMovieSchema, variables } from "../utils/utils";

// export const AddMovie = async (req: Request | any, res: Response) => {
//     try {
//         const verifiedUser = req.user;
//         const id = uuidv4()
//         const validationResult = MovieUserSchema.validate(req.body, variables);

//         if(validationResult.error){
//             return res.status(400).json({error:validationResult.error.details[0].message});
//           }

//         const movielist = await MovieInstance.create({
//                  id,
//                  ...req.body,
//                  userId: verifiedUser.id
//                 })

//         return res.status(201).json({
//             msg: 'Movie added successfully',
//             movielist
//         })

//     }catch(err){
//         console.log(err);
//     }
// }

// export const EditMovie = async (req: Request | any, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { title, description, image, price } = req.body;

//     const validationResult = editMovieSchema.validate(req.body, variables);

//     if (validationResult.error) {
//       return res
//         .status(400)
//         .json({ error: validationResult.error.details[0].message });
//     }
//     const EditMovies = await MovieInstance.findOne({ where: { id } });

//     if (!EditMovies) {
//       return res.status(400).json({
//         err: "Cannot find movie",
//       });
//     }

//     const movie = await EditMovies.update({
//       title,
//       description,
//       image,
//       price,
//     });
//     return res.status(200).json({
//       msg: "Movie updated successfully",
//       movie,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const RemoveMovie = async (req: Request | any, res: Response) => {
//   try {
//     const { id } = req.params;

//     const validationResult = MovieUserSchema.validate(req.body, variables);

//     if (validationResult.error) {
//       return res
//         .status(400)
//         .json({ error: validationResult.error.details[0].message });
//     }

//     const list = await MovieInstance.findOne({ where: { id } });
//     if (!list) {
//       return res.status(400).json({
//         err: "Cannot find movie",
//       });
//     }

//     const deletedMovie = await list.destroy();

//     return res.status(200).json({
//       msg: "Movie deleted successfully",
//       deletedMovie,
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// export const getAllMovies = async (req: Request, res: Response) => {
//   const limit = req.query.limit as number | undefined;
//   const offset = req.query?.offset as number | undefined;
//   const getAllMovies = await MovieInstance.findAll({
//     limit: limit,
//     offset: offset,
//   });
//   return res.status(200).json({
//     message: "All movies retrieved successfully",
//     getAllMovies,
//   });
// };

// export const getAllUsersMovies = async (req: Request, res: Response) => {
//     try {

//       const getAllUsersMovies = await MovieInstance.findAndCountAll(
//       {
//         include:[
//           {
//             model:UserInstance,
//             as:"user"
//           }
//          ]
//       }
//       );

//       return res.status(200).json({
//           msg: "All data retrieved successfully",
//           count: getAllUsersMovies.count,
//           users: getAllUsersMovies.rows
//       })

//    } catch(err){
//       console.log(err)
//    }
//   }
