"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authorization_1 = require("../middleware/authorization");
const moviesModel_1 = require("../model/moviesModel");
const utils_1 = require("../utils/utils");
const router = express_1.default.Router();
router.get("/login", (req, res, next) => {
    res.render("Userlogin");
});
router.get("/register", (req, res, next) => {
    res.render("Register");
});
// Landing page EJS
router.get("/", async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 5;
        const skip = (page - 1) * limit;
        const movieCount = await moviesModel_1.MovieModel.countDocuments();
        const totalPages = Math.ceil(movieCount / limit);
        const getAllMovies = await moviesModel_1.MovieModel.find({}).skip(skip).limit(limit);
        return res.render("Home", {
            movieList: getAllMovies,
            currentPage: page,
            totalPages: totalPages,
        });
    }
    catch (error) {
        console.log(error);
    }
});
// Create Movie (Posting to Database) - Post Request EJS
router.post("/dashboard", authorization_1.auth, async (req, res) => {
    try {
        const verifiedUser = req.user;
        const { title, description, image, price } = req.body;
        const validationResult = utils_1.addMovieSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            res.render("Dashboard", {
                error: validationResult.error.details[0].message,
            });
        }
        const movie = await moviesModel_1.MovieModel.create({
            title,
            description,
            image,
            price,
            userId: req.user.id,
        });
        return res.redirect("/dashboard");
    }
    catch (error) {
        console.log(error);
    }
});
// Create movie (Consuming and displaying the created movie) - Get Request EJS
router.get("/dashboard", authorization_1.auth, async (req, res) => {
    try {
        const { id, username } = req.user; // Get the user's id and username
        const movieList = await moviesModel_1.MovieModel.find({ userId: id });
        if (!movieList) {
            return res.render("Dashboard", { message: "No movies found" });
        }
        return res.render("Dashboard", { movieList, username }); // Pass the username to the view
    }
    catch (error) {
        console.log(error);
    }
});
/*=======Update Movie Info===========*/
router.post("/update/:id", authorization_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image, price } = req.body;
        const validationResult = utils_1.editMovieSchema.validate(req.body, utils_1.options);
        if (validationResult.error) {
            res.render("Dashboard", {
                error: validationResult.error.details[0].message,
            });
        }
        const movie = await moviesModel_1.MovieModel.findByIdAndUpdate(id, {
            title,
            description,
            image,
            price,
        }, { new: true });
        if (!movie) {
            res.render("Dashboard", { message: "Movie not found" });
        }
        return res.redirect("/dashboard");
    }
    catch (error) {
        console.log(error);
    }
});
/*========Delete Movie EJS=========*/
router.get("/delete/:id", authorization_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await moviesModel_1.MovieModel.findByIdAndRemove(id);
        if (!movie) {
            return res.render("Dashboard", { message: "Movie not found" });
        }
        return res.redirect("/dashboard");
    }
    catch (error) {
        console.log(error);
    }
});
// For Test landing page
// router.get("/", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1; // parse page number from query param or default to 1
//     const limit = 10; // set limit of movies per page to 5
//     const skip = (page - 1) * limit; // calculate number of movies to skip based on page and limit
//     const movieCount = await MovieModel.countDocuments(); // get total number of movies in the collection
//     const totalPages = Math.ceil(movieCount / limit); // calculate total number of pages
//     const getAllMovies = await MovieModel.find({}).skip(skip).limit(limit); // retrieve movies for the current page
//     return res.status(200).json( {
//       movieList: getAllMovies,
//       currentPage: page,
//       totalPages: totalPages,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// Create Movie
// router.post("/dashboard", auth, async (req: Request | any, res: Response) => {
//   try {
//     const verifiedUser = req.user;
//     const { title, description, image, price } = req.body;
//     const validationResult = addMovieSchema.validate(req.body, options);
//     if (validationResult.error) {
//       res.status(301).json( {
//         error: validationResult.error.details[0].message,
//       });
//     }
//     const movie = await MovieModel.create({
//       title,
//       description,
//       image,
//       price,
//       userId: req.user.id,
//     });
//     return res.status(201).json({
//       Success: "Successful",
//       movie
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
// Update
// router.post("/update/:id", auth, async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { title, description, image, price } = req.body;
//     const validationResult = editMovieSchema.validate(req.body, options);
//     if (validationResult.error) {
//       res.status(302).json( {
//         error: validationResult.error.details[0].message,
//       });
//     }
//     const movie = await MovieModel.findByIdAndUpdate(
//       id,
//       {
//         title,
//         description,
//         image,
//         price,
//       },
//       { new: true }
//     );
//     if (!movie) {
//       res.status(404).json({ message: "Movie not found" });
//     }
//     return res.status(201).json({success: "Successfully Updated"});
//   } catch (error) {
//     console.log(error);
//   }
// });
// router.get("/delete/:id", auth, async (req: Request | any, res: Response) => {
//   try {
//     const { id } = req.params;
//     const movie = await MovieModel.findByIdAndRemove(id);
//     if (!movie) {
//       return res.status(404).json( { message: "Movie not found" });
//     }
//     return res.status(200).json({
//       success: "Successfully deleted"
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });
exports.default = router;
