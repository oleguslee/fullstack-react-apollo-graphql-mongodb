const Express = require("express");
const ExpressGraphQL = require("express-graphql");
const mongoose = require("mongoose");
const {
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLObjectType
} = require("graphql");
const app = Express();
const cors = require("cors");

app.use(cors());

const DB_HOST = 'localhost';
const DB_NAME = 'graphql';
const DB_PORT = 27017;

const PersonModel = mongoose.model("person", {
  firstName: String,
  nickname: String
});

const PersonType = new GraphQLObjectType({
  name: "Person",
  fields: {
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    nickname: { type: GraphQLString }
  }
});

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      people: {
        type: GraphQLList(PersonType),
        resolve: (root, args, context, info) => {
          return PersonModel.find().exec();
        }
      },

      peopleByID: {
        type: PersonType,
        args: {
          id: { type: GraphQLNonNull(GraphQLID) }
        },
        resolve: (root, args, context, info) => {
          return PersonModel.findById(args.id).exec();
        }
      },
      peopleByName: {
        type: GraphQLList(PersonType),
        args: {
          firstName: { type: GraphQLString }
        },
        resolve: (root, args, context, info) => {
          return PersonModel.find({ 'firstName': args.firstName }).exec();
        }
      }
    }
  }),

  mutation: new GraphQLObjectType({
    name: "Create",
    fields: {
      people: {
        type: PersonType,
        args: {
          firstName: { type: GraphQLString },
          nickname: { type: GraphQLString }
        },
        resolve: (root, args, context, info) => {
          const people = new PersonModel(args);
          return people.save();
        }
      }
    }
  })
});

const ppl = [
  {
    firstName: "Elnur",
    nickname: "foreachUser"
  },
  {
    firstName: "Epdyr",
    nickname: "isUndefinedMaster"
  },
  {
    firstName: "Elnar",
    nickname: "doshirakLover"
  }
];

mongoose
  .connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  })
  .then(() => console.log("Connected to database..."))
  .then(() => PersonModel.deleteMany())
  .then(() => PersonModel.insertMany(ppl))
  .catch(err => console.error(err));

app.use("/person", ExpressGraphQL({ schema, graphiql: true }));

app.listen(3001, () => {
  console.log("server running at 3001");
});

