import Category from '../models/Category';
import MovieModel from '../models/Movie';
import Person from '../models/Person';
import { IMovie, IMovieForm } from '../types/typesRest';

export const processMovies = async (movies: MovieModel[]): Promise<IMovie[]> => {
    return Promise.all(
      movies.map(async (movie) => {
        const categories = await movie.getCategories();
        const curCategories = categories.map((category) => category.name);
        
        return {
          id: movie.id,
          name: movie.name,
          date: movie.date,
          country: movie.country,
          imageUrl: movie.imageUrl,
          categories: curCategories,
        };
      })
    );
  };


  export const processCategories = async (categories: string): Promise<Category[]> => {
    let categoriesArray: string[] = [];
    if (categories) {
      categoriesArray = JSON.parse(categories);
    }
    return Promise.all(
      categoriesArray.map(async (name) => {
        const category = await Category.findOne({ where: { name } });
        if (!category) {
          console.log(`Category not found: ${name}`);
        }
        return category;
      })
    );
  };


  export const processActors = async (actors: string): Promise<Person[]> => {
    let actorsArray: string[] = [];
    if (actors) {
        actorsArray = JSON.parse(actors);
    }
    return Promise.all(
        actorsArray.map(async (name) => {
        const category = await Person.findOne({ where: { name } });
        if (!category) {
          console.log(`Category not found: ${name}`);
        }
        return category;
      })
    );
  };
  
  
  