const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const AppError = require("../../utils/appError");

const project = sequelize.define(
  "project", // project here refers to the model name
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Title cannot be null",
        },
        notEmpty: {
          msg: "Title cannot be empty",
        },
      },
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: "isFeatured must be true or false",
        },
      },
    },
    productImage: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Product image cannot be null",
        },
        notEmpty: {
          msg: "Product image cannot be empty",
        },
        isArray(value) {
          if (!Array.isArray(value) || value.length === 0) {
            throw new AppError("Product image must be a non-empty array");
          }
        },
      },
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price cannot be null",
        },
        isDecimal: {
          msg: "Price must be a decimal value",
        },
      },
    },
    shortDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Short description cannot be null",
        },
        notEmpty: {
          msg: "Short description cannot be empty",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description cannot be null",
        },
        notEmpty: {
          msg: "Description cannot be empty",
        },
      },
    },
    productUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Product URL cannot be null",
        },
        notEmpty: {
          msg: "Product URL cannot be empty",
        },
        isUrl: {
          msg: "Invalid Product URL string",
        },
      },
    },
    category: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Category cannot be null",
        },
      },
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      validate: {
        notNull: {
          msg: "Tags cannot be null",
        },
      },
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users", // users is the name of the table created by the user model
        key: "id",
      },
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
    modelName: "project",
    tableName: "projects",
  }
);

module.exports = project;
