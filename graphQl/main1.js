
const express = require('express');
const app=express();
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
// Sample data
let books = [
  { id: '1', title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling' },
  { id: '2', title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
];

// Define your GraphQL schema using the `gql` tag
const typeDefs = buildSchema(`
  type Query {
    books: Book
    book: Book
  }

  type Book {
    id: String
    title: String
    author: String
  }
`);

// Define your GraphQL resolvers
const resolvers = {
  Query: {
    book: () => books[0],
    // book: (_, { id }) => books.find(book => book.id === id),
  },
  Mutation: {
    createBook: (_, { title="Aelish", author="Aelish" }) => {
      const book = { id: String(books.length + 1), title, author };
      books.push(book);
      console.log(books)
      return book;
    },
    updateBook: (_, { id, title, author }) => {
      const index = books.findIndex(book => book.id === id);
      if (index === -1) throw new Error('Book not found');
      const book = books[index];
      books[index] = { ...book, title, author };
      return books[index];
    },
    deleteBook: (_, { id }) => {
      const index = books.findIndex(book => book.id === id);
      if (index === -1) throw new Error('Book not found');
      const book = books[index];
      books.splice(index, 1);
      return book;
    },
  },
};
app.use(
    '/book',
    graphqlHTTP({
        schema:typeDefs,
        rootValue : resolvers,
        graphiql : true,

    })
)
// Create an instance of the ApolloServer and start it
// const server = new ApolloServer({ typeDefs, resolvers });
// server.listen().then(({ url }) => {
//   console.log(`GraphQL server running on ${url}`);
// });
app.listen(3000,()=>{console.log("running at 3000")});


