import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";
import { default as Person, default as PersonModel } from "../models/Person";
import { IMovieDelete } from "../types/typesClient";
import {
  IFullPersonResponce,
  IMovieSearchForm,
  IPersonResponce,
  PageParams,
  SearchActorReponse
} from "../types/typesRest";
import { processMovies } from "../utils/common";

export const addPerson = async (
  req /*: Request<{},{},PersonModel>*/,
  res: Response
) => {
  try {
    const actor = req.body;
    actor.avatarUrl =  req.file ? req.file.filename : null;

    const person = await PersonModel.create(actor);

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

    return res.send(person);
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
  
    if (!person) {
      return res.status(404).send({ message: "Person not found" });
    }
    
    const actorUpdates: Partial<PersonModel> = req.body;
    actorUpdates.avatarUrl = req.file ? req.file.filename : null;

    if (req.file && person.avatarUrl) {
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

    await person.update(actorUpdates);

    return res.send({ message: "Actor updated" });
  } catch (error) {
    console.log("Something wennnt wrong",error);
    return res.send({ message: "Error during updating" });
  }
};

export const getFullPerson = async (
  req: Request<PageParams>,
  res: Response<IFullPersonResponce>
) => {
  try {
    const person = await PersonModel.findByPk(req.params.id);

    if (!person) {
      return res.send({ message: "Person not found" });
    }

    const directedMovies = await person.getDirectedMovies();
    const actedMovies = await person.getActedMovies();

    let itemsDirected = await processMovies(directedMovies);

    let itemsActed = await processMovies(actedMovies);

    const person_: IFullPersonResponce = {
      id: person.id,
      date: person.date,
      birthplace: person.birthplace,
      name: person.name,
      tall: person.tall,
      avatarUrl: person.avatarUrl,
      directorMovies: itemsDirected,
      actorMovies: itemsActed,
    };

    return res.send(person_);
  } catch (error) {
    console.log("ERROR", error);
    return res.status(500);
  }
};

export const deletePerson = async (req: Request<IMovieDelete>, res) => {
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
};

export const getPersons = async (req: Request<IMovieDelete>, res: Response<Person[]>) => {
  
  const {id} = req.params;
  const index = (id -1) * 12;
  try {
    const people = await PersonModel.findAll({
      order: [
        ["name", "ASC"], // Replace 'name' with the column you want to order by
      ],
      offset: index,
      limit: 12,
    });

    return res.send(people);
  } catch {
    return res.status(404);
  }
};

export const Search = async (
  req: Request<{}, {}, {}, IMovieSearchForm>,
  res: Response<SearchActorReponse>
) => {
  const s_name = req.query.name;

  try {
    const people = await PersonModel.findAll({
      where: {
        name: {
          [Op.iLike]: `%${s_name}%`, // Case-insensitive search
        },
      },
    });

    const count = people.length;

    if (!people.length) {
      return res.status(404).json({ message: "Person not found" });
    }
    return res.send({ people: people, total: count });
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Opps something went wrong during request\n" });
  }
};
