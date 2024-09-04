import { CombinedType, IMovieDelete } from "../types/typesClient";
import { IMovieComment, MovieComment, MovieCommentResponse } from "../types/typesRest";
import CommentModel from "../models/Comment";
import MovieModel from "../models/Movie";
import UserModel from "../models/User";
import { Request, Response } from "express";
import sequelize from "../models/db";


export const addComment = async (
    req: Request<IMovieDelete, {}, CombinedType<IMovieComment>>,
    res
  ) => {
    const transaction = await sequelize.transaction();
    
    try {
      const movie = await MovieModel.findByPk(req.params.id,{transaction});
  
      if (!movie) {
        return res.send({ message: "Movie not found" });
      }
  
      const Comment = await CommentModel.create({ text: req.body.text },{transaction});
  
      (await movie).addComment(Comment,{transaction});
  
      const user = await UserModel.findByPk(req.body.userId,{transaction});
  
      if (!user) {
        return res.send({ message: "User not found" });
      }
  
      await user.addComment(Comment,{transaction});  
      const commentCount = (await movie.getComments({transaction})).length;  
      await movie.update({ commentCount},{transaction}); 

      await transaction.commit();
      return res.send({ message: "Success" });
    } catch (error) {
      
      await transaction.rollback();
      
      console.log("Oppps something went wrong during add comment", error);
      return res.send({ message: "Error" });
    }
  };


  export const getComments = async (
    req: Request<IMovieDelete>,
    res: Response<MovieCommentResponse>
  ) => {
    try {
      const movie = await MovieModel.findByPk(req.params.id);
  
      if (!movie) {
        return res.send({ message: "Movie not found" });
      }
  
      const comments = await movie.getComments({
        order: [["createdAt", "DESC"]], // Order by createdAt, newest first
      });
  
      const items: MovieComment[] = await Promise.all(
        comments.map(async (comment) => {
          const user = await comment.getUser();
  
          return {
            name: user.name,
            text: comment.text,
            createdAt: comment.createdAt,
            avatar: user.avatar,
          };
        })
      );
  
      return res.send(items);
    } catch (error) {
      console.log("Oppps something went wrong during add comment", error);
      return res.send({ message: "Error" });
    }
  };