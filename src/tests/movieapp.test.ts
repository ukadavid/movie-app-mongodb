import {UserModel} from "../model/userModel";
import { dbConnect, dbDisconnect, dbDropCollection } from "./testconfig";
import { describe, test, beforeAll, afterAll } from "@jest/globals";
import { expect } from "@jest/globals";
import mongoose from "mongoose";
import request from "supertest";
import {MovieModel} from "../model/moviesModel";
const baseURL = "http://localhost:3000"

beforeAll(async () => await dbConnect());
afterAll(async () => await dbDisconnect());

describe("Get All Movies", () => {
  test("should return all movies with status code 200", async () => {
    const MovieData = {
      userId: new mongoose.Types.ObjectId(),
      title: "Smile",
      description: "Another episode of Smile",
      image:
        "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
      price: 1300,
      }
    const response = await request(baseURL).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe(null);
    expect(response.body.data.length).toBeGreaterThanOrEqual(1);

    const savedMovies = await MovieModel.find();
    expect(response.body.data).toEqual(JSON.parse(JSON.stringify(savedMovies)));
  });
});




describe("API movie tests", () => {
  test("This checks for creation of movie and saving in the database", async () => {
    const MovieData = {
      userId: new mongoose.Types.ObjectId(),
      title: "Smile",
      description: "Another episode of Smile",
      image:
        "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
      price: 1300,
    };

    const newMovieData = new MovieModel({
      userId: new mongoose.Types.ObjectId(MovieData.userId),
      title: MovieData.title,
      description: MovieData.description,
      image: MovieData.image,
      price: MovieData.price,
    });

    await newMovieData.save();

    expect(newMovieData._id).toBeDefined();
    expect(newMovieData.userId).toEqual(MovieData.userId);
    expect(newMovieData.title).toEqual(MovieData.title);
    expect(newMovieData.description).toEqual(MovieData.description);
    expect(newMovieData.image).toEqual(MovieData.image);
    expect(newMovieData.price).toEqual(MovieData.price);
  });

  test("This test will fail because Movie data are created without required fields", async () => {
    const invalidMovieData = {
      userId: new mongoose.Types.ObjectId(),
      title: "Smile",
      description: "Another episode of Smile",
      image:
      "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
      price: 2500,
    };

    try {
      const newMovieData = new MovieModel(invalidMovieData);
      await newMovieData.save();
    } catch (error) {
      const err = error as mongoose.Error.ValidationError;
      expect(err.errors.userId).toBeDefined();
    }
  });

  test("should update a Movie successfully", async () => {
    // Create a new Movie document
    const newMovieData = {
        userId: new mongoose.Types.ObjectId(),
        title: "Smile",
        description: "Another episode of Smile",
        image:  "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
        price: 2400,
    };
    const createdMovie = await MovieModel.create(newMovieData);

    // Update the Movie document
    const updatedData = {
        title: "Smile Review",
        description: "Another episode",
        image:  "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
        price: 2500,
    };

    // Update the movie document by calling findByIdAndUpdate with the valid _id
    const updatedMovie = await MovieModel.findByIdAndUpdate(createdMovie._id, updatedData, { new: true });

    // Assert that the Movie document was updated successfully
    expect(updatedMovie).not.toBeNull();
    expect(updatedMovie?.userId).toEqual(newMovieData.userId);
    expect(updatedMovie?.title).toEqual(updatedData.title);
    expect(updatedMovie?.description).toEqual(updatedData.description);
    expect(updatedMovie?.image).toEqual(updatedData.image);
    expect(updatedMovie?.price).toEqual(updatedData.price);
});


test("should fail to update a non-existent Movie", async () => {
  const nonExistentMovieId = new mongoose.Types.ObjectId();
  const updatedData = {
      title: "Smile Review",
      description: "Another episode",
      image:  "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
      price: 2500,
  };

  const updatedMovie = await MovieModel.findByIdAndUpdate(nonExistentMovieId, updatedData);

  expect(updatedMovie).toBeNull();
});



  test("should delete a Movie successfully", async () => {
    const MovieData = {
      userId: new mongoose.Types.ObjectId(),
      title: "The Walking Dead",
      description: "Another episode of Smile",
      image:
      "https://dx35vtwkllhj9.cloudfront.net/paramountpictures/smile/images/regions/us/onesheet.jpg",
      price: 2600,
    };

    const newMovieData = new MovieModel({
      userId: new mongoose.Types.ObjectId(MovieData.userId),
      title: MovieData.title,
      description: MovieData.description,
      image: MovieData.image,
      price: MovieData.price,
    });

    await newMovieData.save();

    const deleteResult = await MovieModel.deleteOne({ _id: newMovieData._id });

    expect(deleteResult.deletedCount).toEqual(1);
  });

  test("should fail to delete a non-existent Movie", async () => {
    const nonExistentMovieId = new mongoose.Types.ObjectId();
    const deleteResult = await MovieModel.deleteOne({ _id: nonExistentMovieId });

    expect(deleteResult.deletedCount).toEqual(0);
  });
});