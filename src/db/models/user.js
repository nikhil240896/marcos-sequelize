"use strict";
const { DataTypes } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sequelize = require("../../config/database");
const AppError = require("../../utils/appError");
const project = require("./project");
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

const user = sequelize.define(
  "user", // user here refers to the model name
  // Sequelize will automatically pluralize this to "users" for the table name
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    userType: {
      type: DataTypes.ENUM("0", "1", "2"), // 0: Admin, 1: Seller, 2: Buyer
      allowNull: false,
      validate: {
        notNull: {
          msg: "User type cannot be null",
        },
        notEmpty: {
          msg: "User type cannot be empty",
        }
      }
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull:false,
      validate: {
        notNull: {
          msg: "First name cannot be null",
        },
        notEmpty: {
          msg: "First name cannot be empty",
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Last name cannot be null",
        },
        notEmpty: {
          msg: "Last name cannot be empty",
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Email cannot be null",
        },
        notEmpty: {
          msg: "Email cannot be empty",
        },
        isEmail: {
          msg: "Email must be a valid email address",
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Password cannot be null",
        },
        notEmpty: {
          msg: "Password cannot be empty",
        },
        len: {
          args: [6, 100],
          msg: "Password must be between 6 and 100 characters long",
        }
      }
    },
    confirmPassword: {
      type: DataTypes.VIRTUAL,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    paranoid: true, // Enable soft deletes
    modelName: "user",
    tableName: "users",
    // hooks: {
    //   // Hash the password before creating the user in the database
    //   beforeCreate: async (user) => {
    //     if (user.password) {
    //       user.password = await bcrypt.hash(user.password, 10);
    //     }
    //   },
    // },
  }
);

user.beforeCreate(async (user, options) => {
  if (user.confirmPassword !== user.password) {
    throw new AppError("Password and confirm password do not match.", 400);
  }

  const hashedPassword = await bcrypt.hash(user.password, 10);
  user.password = hashedPassword;
});

user.prototype.generateToken = function () {
  const payload = { id: this.id };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

user.hasMany(project, { // project referts to the model name
  foreignKey: "createdBy",
  //as: "projects",
  onDelete: "CASCADE",
});

project.belongsTo(user, { // user refers to the model name
  foreignKey: "createdBy",
  //as: "user",
  onDelete: "CASCADE",
}); 

module.exports = user;
