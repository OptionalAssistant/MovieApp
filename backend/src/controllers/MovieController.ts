import { Request, Response } from "express";
import { Op } from "sequelize";
import { default as Category, default as CategoryModel } from "../models/Category";
import MovieModel from "../models/Movie";
import { CombinedType, IAuthMe, ICategoryName, IMovieDelete } from "../types/typesClient";
import {
  ICategory,
  IFullMovie,
  IMovie,
  IMovieComment,
  IMovieForm,
  IMovieResponce,
  IMovieSearchForm,
  InterfaceId,
  MovieComment,
  MovieCommentResponse,
  movieNumber,
  PageParams,
  SearchMovieResponse
} from "../types/typesRest";
import jwt  from "jsonwebtoken";
import CommentModel from '../models/Comment';
import UserModel from '../models/User';

const movieCount = 2;
export const getMovies = async (req, res: Response<IMovie[]>) => {
  const movies = await MovieModel.findAll();

  let items: IMovie[] = await Promise.all(movies.map(async(movie)=>{
    const categories = await movie.getCategories();

    const curCategories = categories.map(category =>category.name);
    return{
      id: movie.id,
      name: movie.name,
      date: movie.date,
      country: movie.country,
      imageUrl: movie.imageUrl,
      categories: curCategories,
    } 
  }));
  res.json(items);
};
export const getMoviesNumber = async (req, res: Response<movieNumber>) => {
  const count = await MovieModel.count();

  res.json({ length: count });
};

export const getMoviePage = async (
  req: Request<PageParams>,
  res: Response<IMovieResponce>
) => {
  const { id } = req.params;
  try {
    let index = (id - 1) * movieCount;

    const { rows: movies } = await MovieModel.findAndCountAll({
      offset: index,
      limit: movieCount,
    });
    let items: IMovie[] = await Promise.all(movies.map(async(movie)=>{
      const categories = await movie.getCategories();
  
      const curCategories = categories.map(category =>category.name);
      return{
        id: movie.id,
        name: movie.name,
        date: movie.date,
        country: movie.country,
        imageUrl: movie.imageUrl,
        categories: curCategories,
      } 
    }));

    res.send(items);
  } catch (err) {
    console.log("get movie page error", err);
  }
};

export const getFullMovie = async (
  req: Request<PageParams,{},IAuthMe>,
  res: Response<IFullMovie>
) => {
  const { id } = req.params;

  try {

    const movie = await MovieModel.findByPk(id, { include: [Category] });
    const items = (await movie.getCategories()).map(
      (category) => category.name
    );
    console.log("Dislike count");
    const dislikeCount = await movie.countDislikedByUsers();
    const likeCount = await movie.countLikedByUsers();
    let isLiked  = false;
    let isDisliked = false ;

    const token = ( req.headers.authorization  || '').replace(/Bearer\s?/,'');
    console.log("TOken",token);
    if(token){
            try{
                const decoded = jwt.verify(token,process.env.SECRET_KEY);

                const user = await UserModel.findByPk(decoded.id);

                if(!user){
                  return res.status(404);
                }
        
               const dislikedMovies = await user.getDislikedMovies();
               const likedMovies = await user.getLikedMovies();
        
                isLiked = likedMovies.some(item => item.id === movie.id);
                isDisliked = dislikedMovies.some(item => item.id === movie.id);
            }
            catch(error)
            {
            }
    }

    console.log("Dislike count",dislikeCount);
    console.log("Like count",likeCount);

    const Movie: IFullMovie = {
      id: movie.id,
      name: movie.name,
      trailerUrl: movie.trailerUrl,
      description: movie.description,
      date: movie.date,
      categories: items,
      imageUrl: movie.imageUrl,
      country: movie.country,
      commentCount: movie.commentCount,
      dislikeCount : dislikeCount,
      likeCount: likeCount,
      isDisliked: isDisliked,
      isLiked: isLiked
    };

    return res.send(Movie);
  } catch (error) {
    return res.status(404);
  }
};

export const SearchMovie = async (
  req: Request<{}, {}, {}, IMovieSearchForm>,
  res: Response<SearchMovieResponse>
) => {
  const s_name = req.query.name;
  const id = req.query.page;
  console.log("id",id);
  let index = id ? id-1 : 0;
  console.log("Page",index);
  try {
    const movies = await MovieModel.findAll({
      where: {
        name: {
          [Op.iLike]: `%${s_name}%`, // Case-insensitive search
        },
      },
      // offset: index, // Pagination offset
      // limit: movieCount,  // Number of records per page
    });

    const count = movies.length;
    const moviesSliced = movies.slice(
      index * movieCount,
      index * movieCount + movieCount
    );
    console.log("ITESM",moviesSliced);
    if (!movies.length) {
      return res.status(404).json({ message: "Movie not found" });
    }
    let items: IMovie[] = await Promise.all(moviesSliced.map(async(movie)=>{
      const categories = await movie.getCategories();
  
      const curCategories = categories.map(category =>category.name);
      return{
        id: movie.id,
        name: movie.name,
        date: movie.date,
        country: movie.country,
        imageUrl: movie.imageUrl,
        categories: curCategories,
      } 
    }));
    console.log("ITESM3",items);
    return res.send({ movies: items, total: count });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Opps something went wrong during request\n" });
  }
};

export const getCategory = async (
  req: Request<ICategoryName>,
  res: Response<SearchMovieResponse>
) => {
  const categoryName = req.params.idCategory;
  const id = req.params.id;
  let index = id - 1;
  try {
    const data = await CategoryModel.findOne({ where: { name: categoryName } });
    if (!data) {
      return res.send({ message: `No category ${categoryName}` });
    }

    let movies = await data.getMovies();
    const count = movies.length;

    movies = movies.slice(index * movieCount, index * movieCount + movieCount);

    
    let items: IMovie[] = await Promise.all(movies.map(async(movie)=>{
      const categories = await movie.getCategories();
  
      const curCategories = categories.map(category =>category.name);
      return{
        id: movie.id,
        name: movie.name,
        date: movie.date,
        country: movie.country,
        imageUrl: movie.imageUrl,
        categories: curCategories,
      } 
    }));
    return res.send({ movies: items, total: count });
  } catch (error) {
    console.log("error", error);
    res.send({ message: "oops something went wrong" });
  }
};

export const getAllCategories = async (req, res: Response<Category[]>) => {
  try {
    const categories = await CategoryModel.findAll();

    res.send(categories);
  } catch (error) {
    console.log("Ooops something went wrong during getAllCategories", error);
  }
};

export const addCategory = async (req: Request<{}, {}, ICategory>, res) => {
  
  console.log("VBOOD",req.body);
  try {
    const data = await CategoryModel.create({ name: req.body.name });

    console.log("Category with name added", data.name);
    res.send({ message: "Well" });
  } catch (error) {
    console.log("Ooops smth went wrong during add category", error);
    res.send({ message: "Error" });
  }
};

export const create = async (
  req: Request<{}, {}, IMovieForm>,
  res: Response<InterfaceId>
) => {
  try {
    const movie = await MovieModel.create({
      name: req.body.name,
      date: req.body.date,
      country: req.body.country,
      trailerUrl: req.body.trailerUrl,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    });

    const categories = await Promise.all(
      req.body.categories.map(async (name) => {
        const category = await Category.findOne({ where: { name } });
        return category;
      })
    );
    await movie.setCategories(categories);

    return res.send({id: movie.id});
  } catch (erorr) {
    //   return res.send({message: "Movie was not added.Error"});
  }
};

export const removeCategory = async (req: Request<{}, {}, ICategory>, res) => {
  try {
    console.log("Delete category", req.body.name);
    const categoryInstance = await CategoryModel.findOne({
      where: { name: req.body.name },
    });

    if (!categoryInstance) {
      return res.send("Category not found");
    }
    await categoryInstance.destroy();

    return res.send("Category was deleted");
  } catch (error) {
    console.log("Failed to delete category", error);
    return res.send("Category deleted");
  }
};

export const deleteMovie = async(req: Request<IMovieDelete>, res) => {
  try {
    const movie = await MovieModel.findByPk(req.params.id);

    if (!movie) {
      console.log("Oops smth went wrong..\n");
    return  res.send("Error Nt foundfff");
    }

    await movie.destroy();
    return res.send("All right");

  } catch (erorr) {
    console.log("Oops smth went wrong..\n");
    return res.send("Error");
  }
};

export const editMovie = async(req : Request<IMovieDelete,{},IMovieForm>,res)=>{
 
  console.log("ID",req.params.id);
  console.log("BODY",req.body);

 try{
  const movie = await MovieModel.findByPk(req.params.id);

  movie.name = req.body.name;
  movie.date = req.body.date;
  movie.country = req.body.country;
  movie.trailerUrl =  req.body.trailerUrl;
  movie.imageUrl = req.body.imageUrl;
  movie.description = req.body.description;
  
  const categories = await Promise.all(
    req.body.categories.map(async (name) => {
      const category = await Category.findOne({ where: { name } });
      return category;
    })
  );
  await movie.setCategories(categories);

  await movie.save();

  return res.send({message :"Movie updated"});
 }
catch(error){
  console.log("Something wennnt wrong");
  return res.send({message :"Error during updating"});
}
}


export const addComment = async(req : Request<IMovieDelete,{},CombinedType<IMovieComment>>,res)=>{
    try{
      const movie = MovieModel.findByPk(req.params.id);

      if(!movie){
        return res.send({message : "Movie not found"});
      }
      console.log("Body",req.body);
      console.log(req.body.text);
      const Comment = await CommentModel.create({text: req.body.text});
      
      
      (await movie).addComment(Comment);
      
      const user = UserModel.findByPk(req.body.userId);
    
      if(!user){
        return res.send({message:"User not found"});
      }

      (await user).addComment(Comment);
      (await movie).update({commentCount: (await (await movie).getComments()).length});
      return res.send({message:"Success"});
    }
    catch(error){
      console.log("Oppps something went wrong during add comment",error);
      return res.send({message:"Error"});
    }
} 


export const getComments = async(req : Request<IMovieDelete>,res : Response<MovieCommentResponse>)=>{
  try{
    const movie = await MovieModel.findByPk(req.params.id);

    if(!movie){
      return res.send({message : "Movie not found"});
    }
    
    const comments = await movie.getComments({
      order: [['createdAt', 'DESC']], // Order by createdAt, newest first
    });
    
    const items: MovieComment[] = await Promise.all(
      comments.map(async (comment) => {
        const user = await comment.getUser();
        
        return {
          name: user.name,
          text: comment.text,
          createdAt: comment.createdAt,
        };
      })
    );

    return res.send(items);
  }
  catch(error){
    console.log("Oppps something went wrong during add comment",error);
    return res.send({message:"Error"});
  }
} 


export const getNewMovies = async(req : Request<PageParams>,res : Response<SearchMovieResponse>)=>{
  const { id } = req.params;

  let index = (id - 1) * movieCount;

  try{
    const { rows: movies }  = await MovieModel.findAndCountAll(   {order: [['date', 'DESC']],
      offset: index,
      limit: movieCount}
    );
    let items: IMovie[] = await Promise.all(movies.map(async(movie)=>{
      const categories = await movie.getCategories();
  
      const curCategories = categories.map(category =>category.name);
      return{
        id: movie.id,
        name: movie.name,
        date: movie.date,
        country: movie.country,
        imageUrl: movie.imageUrl,
        categories: curCategories,
      } 
    }));
    return res.send({ movies: items });
  }
  catch(error){
    console.log("Something went wrong during getNewMovies",error);
    res.send({message:"Error"});
  }
}

export const getPopularMovies = async(req : Request<PageParams>,res : Response<SearchMovieResponse>)=>{
  const { id } = req.params;
  console.log("id",id);
  let index = (id - 1) * movieCount;

  try{
    const { rows: movies }  = await MovieModel.findAndCountAll(   {order: [['commentCount', 'DESC']],
      offset: index,
      limit: movieCount}
    );
    console.log("Moviess",index,movies);
   let items: IMovie[] = await Promise.all(movies.map(async(movie)=>{
      const categories = await movie.getCategories();
  
      const curCategories = categories.map(category =>category.name);
      return{
        id: movie.id,
        name: movie.name,
        date: movie.date,
        country: movie.country,
        imageUrl: movie.imageUrl,
        categories: curCategories,
      } 
    }));
    return res.send({ movies: items });
  }
  catch(error){
    console.log("Something went wrong during getNewMovies",error);
    res.send({message:"Error"});
  }
}


export const dislikeMovie = async(req : Request<IMovieDelete>,res)=>{
  try{
    const movie = await MovieModel.findByPk(req.params.id);

    if(!movie){
      console.log("Error movie not found in dislike movie");
      return res.status(404);
    }
    const curUser = await UserModel.findByPk(req.body.userId);

    const likedUsers = await movie.getLikedByUsers();
    const dislikedUsers = await movie.getDislikedByUsers();

    let isLiked = likedUsers.some(user => user.id === req.body.userId);

    if(isLiked){
        await movie.removeLikedByUser(curUser);
    }
     
    isLiked = dislikedUsers.some(user => user.id === req.body.userId);

    if(isLiked){
      await movie.removeDislikedByUser(curUser);
    }
    else{
      await movie.addDislikedByUser(curUser);
    }
    (await movie).update({likesCount: (await (await movie).countLikedByUsers())});
    return res.send({message:"Success"});
  }
  catch(error){
      console.log("Ops something went wrong during dislikeMovie",error);
  }
}

export const likeMovie = async(req: Request<IMovieDelete,{},CombinedType<IAuthMe>>,res)=>{
  
  try{
    const movie = await MovieModel.findByPk(req.params.id);

    if(!movie){
      console.log("Error movie not found in like movie");
      return res.status(404);
    }
    const curUser = await UserModel.findByPk(req.body.userId);

    const likedUsers = await movie.getLikedByUsers();
    const dislikedUsers = await movie.getDislikedByUsers();

    let isLiked = dislikedUsers.some(user => user.id === req.body.userId);

    if(isLiked){
        await movie.removeDislikedByUser(curUser);
    }
     
    isLiked = likedUsers.some(user => user.id === req.body.userId);

    if(isLiked){
      await movie.removeLikedByUser(curUser);
    }
    else{
      await movie.addLikedByUser(curUser);
    }
    (await movie).update({likesCount: (await (await movie).countLikedByUsers())});
    return res.send({message:"Success"});
  }
  catch(error){
      console.log("Ops something went wrong during likeMovie",error);
  }
 

}


export const getBestMovies = async(req : Request<PageParams>,res : Response<SearchMovieResponse>)=>{
  const { id } = req.params;
  console.log("id",id);
  let index = (id - 1) * movieCount;

  try{
    const { rows: movies }  = await MovieModel.findAndCountAll(   {order: [['likesCount', 'DESC']],
      offset: index,
      limit: movieCount}
    );
    console.log("Moviess",index,movies);
   let items: IMovie[] = await Promise.all(movies.map(async(movie)=>{
      const categories = await movie.getCategories();
  
      const curCategories = categories.map(category =>category.name);
      return{
        id: movie.id,
        name: movie.name,
        date: movie.date,
        country: movie.country,
        imageUrl: movie.imageUrl,
        categories: curCategories,
      } 
    }));
    return res.send({ movies: items });
  }
  catch(error){
    console.log("Something went wrong during getNewMovies",error);
    res.send({message:"Error"});
  }
}