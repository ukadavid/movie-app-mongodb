"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testconfig_1 = require("./testconfig");
const globals_1 = require("@jest/globals");
const globals_2 = require("@jest/globals");
const mongoose_1 = __importDefault(require("mongoose"));
const supertest_1 = __importDefault(require("supertest"));
const moviesModel_1 = require("../model/moviesModel");
const baseURL = "http://localhost:3000";
(0, globals_1.beforeAll)(async () => await (0, testconfig_1.dbConnect)());
(0, globals_1.afterAll)(async () => await (0, testconfig_1.dbDisconnect)());
(0, globals_1.describe)("Get All Movies", () => {
    (0, globals_1.test)("should return all movies with status code 200", async () => {
        const MovieData = {
            userId: new mongoose_1.default.Types.ObjectId(),
            title: "Smile",
            description: "Another episode of Smile",
            image: "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
            price: 1300,
        };
        const response = await (0, supertest_1.default)(baseURL).get("/");
        (0, globals_2.expect)(response.statusCode).toBe(200);
        (0, globals_2.expect)(response.body.error).toBe(null);
        (0, globals_2.expect)(response.body.data.length).toBeGreaterThanOrEqual(1);
        const savedMovies = await moviesModel_1.MovieModel.find();
        (0, globals_2.expect)(response.body.data).toEqual(JSON.parse(JSON.stringify(savedMovies)));
    });
});
(0, globals_1.describe)("API movie tests", () => {
    (0, globals_1.test)("This checks for creation of movie and saving in the database", async () => {
        const MovieData = {
            userId: new mongoose_1.default.Types.ObjectId(),
            title: "Smile",
            description: "Another episode of Smile",
            image: "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
            price: 1300,
        };
        const newMovieData = new moviesModel_1.MovieModel({
            userId: new mongoose_1.default.Types.ObjectId(MovieData.userId),
            title: MovieData.title,
            description: MovieData.description,
            image: MovieData.image,
            price: MovieData.price,
        });
        await newMovieData.save();
        (0, globals_2.expect)(newMovieData._id).toBeDefined();
        (0, globals_2.expect)(newMovieData.userId).toEqual(MovieData.userId);
        (0, globals_2.expect)(newMovieData.title).toEqual(MovieData.title);
        (0, globals_2.expect)(newMovieData.description).toEqual(MovieData.description);
        (0, globals_2.expect)(newMovieData.image).toEqual(MovieData.image);
        (0, globals_2.expect)(newMovieData.price).toEqual(MovieData.price);
    });
    (0, globals_1.test)("This test will fail because Movie data are created without required fields", async () => {
        const invalidMovieData = {
            userId: new mongoose_1.default.Types.ObjectId(),
            title: "Smile",
            description: "Another episode of Smile",
            image: "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
            price: 2500,
        };
        try {
            const newMovieData = new moviesModel_1.MovieModel(invalidMovieData);
            await newMovieData.save();
        }
        catch (error) {
            const err = error;
            (0, globals_2.expect)(err.errors.userId).toBeDefined();
        }
    });
    (0, globals_1.test)("should update a Movie successfully", async () => {
        // Create a new Movie document
        const newMovieData = {
            userId: new mongoose_1.default.Types.ObjectId(),
            title: "Smile",
            description: "Another episode of Smile",
            image: "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
            price: 2400,
        };
        const createdMovie = await moviesModel_1.MovieModel.create(newMovieData);
        // Update the Movie document
        const updatedData = {
            title: "Smile Review",
            description: "Another episode",
            image: "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
            price: 2500,
        };
        // Update the movie document by calling findByIdAndUpdate with the valid _id
        const updatedMovie = await moviesModel_1.MovieModel.findByIdAndUpdate(createdMovie._id, updatedData, { new: true });
        // Assert that the Movie document was updated successfully
        (0, globals_2.expect)(updatedMovie).not.toBeNull();
        (0, globals_2.expect)(updatedMovie?.userId).toEqual(newMovieData.userId);
        (0, globals_2.expect)(updatedMovie?.title).toEqual(updatedData.title);
        (0, globals_2.expect)(updatedMovie?.description).toEqual(updatedData.description);
        (0, globals_2.expect)(updatedMovie?.image).toEqual(updatedData.image);
        (0, globals_2.expect)(updatedMovie?.price).toEqual(updatedData.price);
    });
    (0, globals_1.test)("should fail to update a non-existent Movie", async () => {
        const nonExistentMovieId = new mongoose_1.default.Types.ObjectId();
        const updatedData = {
            title: "Smile Review",
            description: "Another episode",
            image: "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
            price: 2500,
        };
        const updatedMovie = await moviesModel_1.MovieModel.findByIdAndUpdate(nonExistentMovieId, updatedData);
        (0, globals_2.expect)(updatedMovie).toBeNull();
    });
    (0, globals_1.test)("should delete a Movie successfully", async () => {
        const MovieData = {
            userId: new mongoose_1.default.Types.ObjectId(),
            title: "The Walking Dead",
            description: "Another episode of Smile",
            image: "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
            price: 2600,
        };
        const newMovieData = new moviesModel_1.MovieModel({
            userId: new mongoose_1.default.Types.ObjectId(MovieData.userId),
            title: MovieData.title,
            description: MovieData.description,
            image: MovieData.image,
            price: MovieData.price,
        });
        await newMovieData.save();
        const deleteResult = await moviesModel_1.MovieModel.deleteOne({ _id: newMovieData._id });
        (0, globals_2.expect)(deleteResult.deletedCount).toEqual(1);
    });
    (0, globals_1.test)("should fail to delete a non-existent Movie", async () => {
        const nonExistentMovieId = new mongoose_1.default.Types.ObjectId();
        const deleteResult = await moviesModel_1.MovieModel.deleteOne({ _id: nonExistentMovieId });
        (0, globals_2.expect)(deleteResult.deletedCount).toEqual(0);
    });
});
