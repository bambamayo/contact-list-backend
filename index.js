const { ApolloServer, gql, UserInputError } = require("apollo-server");
const { v4: uuidv4 } = require("uuid");

//console.log(uuidv4())

let contacts = [
  {
    name: "ayo bami",
    phone: "09067676767",
    birthday: "20|10|87",
    address: "20 shotinoye street",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431",
    favourite: false,
  },
  {
    name: "gab bambam",
    phone: "08078654346",
    birthday: "10|10|95",
    address: "40 iyana street",
    id: "3d599470-3436-11e9-bc57-8b80ba54c431",
    favourite: true,
  },
  {
    name: "tomi mikun",
    phone: "08145678734",
    birthday: "09|12|96",
    address: "40 iyana street",
    id: "3d599471-3436-11e9-bc57-8b80ba54c431",
    favourite: true,
  },
];

const typeDefs = gql`
  type Contact {
    name: String!
    phone: String!
    birthday: String
    address: String
    favourite: Boolean
    id: ID!
  }

  type Query {
    contactCount: Int!
    allContacts(favourite: YesNo): [Contact!]!
    findContact(name: String!): Contact
  }

  type Mutation {
    addContact(contact: newContact): Contact
  }

  input newContact {
    name: String!
    phone: String!
    birthday: String
    address: String
    favourite: Boolean
  }

  enum YesNo {
    YES
    NO
  }
`;

const resolvers = {
  Query: {
    contactCount: () => contacts.length,
    allContacts: (root, args) => {
      if (!args.favourite) return contacts;
      const favContacts = contacts.filter((contact) =>
        args.favourite === "YES"
          ? contact.favourite === true
          : contact.favourite === false
      );
      return favContacts;
    },
    findContact: (root, args) => contacts.find((c) => c.name === args.name),
  },

  Mutation: {
    addContact: (root, args) => {
      if (contacts.find((contact) => contact.name === args.contact.name)) {
        throw new UserInputError("Name already exist", {
          invalidArgs: args.contact.name,
        });
      }
      const contact = { ...args.contact, id: uuidv4() };
      contacts = contacts.concat(contact);
      return contact;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
