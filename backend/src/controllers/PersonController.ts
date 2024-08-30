import { IPersonResponce, IPerson, PageParams, IFullPersonResponce, IMovie } from "../types/typesRest";
import { Request, Response } from "express";
import PersonModel from "../models/Person";
import path from "path";
import fs from "fs";
import { IMovieDelete } from "../types/typesClient";

export const addPerson = async (
  req /*: Request<{},{},IPersonForm>*/,
  res: Response
) => {
  try {
    const person = await PersonModel.create({
      name: req.body.name,
      date: req.body.date,
      birthplace: req.body.birthplace,
      tall: req.body.tall,
      avatarUrl: req.file ? req.file.filename : null, // Store filename if image was uploaded
    });

    return res.send({ id: person.id });
  } catch (error) {
    console.log("ERROR", error);
    return res.status(500);
  }
};

export const getPerson = async (
  req: Request<PageParams>,
  res: Response<IPersonResponce>
) => {
  try {
    const person = await PersonModel.findByPk(req.params.id);

    if (!person) {
      return res.send({ message: "Person not found" });
    }

    const person_: IPerson = {
      id: person.id,
      date: person.date,
      birthplace: person.birthplace,
      name: person.name,
      tall: person.tall,
      avatarUrl: person.avatarUrl,
    };
    return res.send(person_);
  } catch (error) {
    console.log("ERROR", error);
    return res.status(500);
  }
};

export const editPerson = async (
  req /*: Request<IMovieDelete,{},IMovieForm>*/,
  res
) => {
  try {
    const person = await PersonModel.findByPk(req.params.id);

    if (req.file) {
      const filePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        person.avatarUrl
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log("Error deleting the file:", err);
        }
        console.log("All right");
      });
    }
    person.name = req.body.name;
    person.date = req.body.date;
    person.birthplace = req.body.birthplace;
    person.avatarUrl = req.file ? req.file.filename : person.avatarUrl;
    person.tall = req.body.tall;

    await person.save();

    return res.send({ message: "Movie updated" });
  } catch (error) {
    console.log("Something wennnt wrong");
    return res.send({ message: "Error during updating" });
  }
};


export const getFullPerson = async(  req: Request<PageParams>,
    res: Response<IFullPersonResponce>)=>{


        try {
            const person = await PersonModel.findByPk(req.params.id);
        
            if (!person) {
              return res.send({ message: "Person not found" });
            }
        
            const directedMovies = await person.getDirectedMovies();
            const actedMovies = await person.getActedMovies();

            let itemsDirected: IMovie[] = await Promise.all(
                directedMovies.map(async (movie) => {
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
                }));

                let itemsActed: IMovie[] = await Promise.all(
                    actedMovies.map(async (movie) => {
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
                    }));
                
            const person_: IFullPersonResponce = {
              id: person.id,
              date: person.date,
              birthplace: person.birthplace,
              name: person.name,
              tall: person.tall,
              avatarUrl: person.avatarUrl,
              directorMovies: itemsDirected,
              actorMovies:  itemsActed
            };

            return res.send(person_);
          } catch (error) {
            console.log("ERROR", error);
            return res.status(500);
          }
}


export const deletePerson = async(req : Request<IMovieDelete>,res)=>{

    try {
        const person = await PersonModel.findByPk(req.params.id);
    
        if (!person) {
          console.log("Oops smth went wrong..\n");
          return res.send("Error Nt foundfff");
        }
    
        if (person.avatarUrl) {
          const filePath = path.join(
            __dirname,
            "..",
            "..",
            "uploads",
            person.avatarUrl
          );
          console.log("File path", filePath);
    
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log("Error deleting the file:", err);
            }
            console.log("All right");
          });
        }
        await person.destroy();
        return res.send("All right");
      } catch (erorr) {
        console.log("Oops smth went wrong..\n");
        return res.send("Error");
      }

}