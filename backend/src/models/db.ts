
import {Sequelize} from 'sequelize';

// Create a single Sequelize instance
 const sequelize = new Sequelize("usersdb2", "postgres", "20042701", {
    dialect: "postgres",
    // host: 'db',  // Replace with the IP address from the inspect command
    logging: false
  });


export default sequelize;
