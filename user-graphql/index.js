const { GraphQLServer } = require("graphql-yoga");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL);

const User = mongoose.model("User", {
  fullname: String,
  username: String,
  phone_number: String,
  city: String,
});

const typeDefs = `type Query {
    getUser(id: ID!): User
    getUsers: [User]
  }
  type User {
      id: ID!
      fullname: String!
      username: String!
      phone_number: String!
      city: String!
  }
  type Mutation {
      addUser(fullname: String!, username: String!, phone_number: String!, city: String!): User!,
      deleteUser(id: ID!): String
  }`;

const resolvers = {
  Query: {
    getUsers: () => User.find(),
    getUser: async (_, { id }) => {
      var result = await User.findById(id);
      return result;
    },
  },
  Mutation: {
    addUser: async (_, { fullname, username, phone_number, city }) => {
      const user = new User({ fullname, username, phone_number, city });
      await user.save();
      return user;
    },
    deleteUser: async (_, { id }) => {
      await User.findByIdAndRemove(id);
      return "User deleted";
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once("open", function () {
  server.start(() => console.log("Server is running on localhost:4000"));
});
