
import {Sequelize} from 'sequelize';

// Create a single Sequelize instance
 const sequelize = new Sequelize("usersdb2", "postgres", "20042701", {
    dialect: "postgres",
    logging: false
  });
  
export default sequelize;
