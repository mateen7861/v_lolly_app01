const { ApolloServer, gql } = require("apollo-server-lambda")
const faunadb = require("faunadb"),
  q = faunadb.query
const shortid = require("shortid")

const typeDefs = gql`
  type Query {
    getLollies: [lolly]
  }
  type lolly {
    id: ID!
    color1: String!
    color2: String!
    color3: String!
    sender: String!
    reciever: String!
    message: String!
    link: String!
  }
  type Mutation {
    addLolly(
      color1: String!
      color2: String!
      color3: String!
      sender: String!
      reciever: String!
      message: String!
    ): lolly
  }
`
var adminClient = new faunadb.Client({
  secret: process.env.FAUNA,
})

const resolvers = {
  Query: {
    getLollies: async (root, args, context) => {
      try {
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Match(q.Index("lolly"))),
            q.Lambda(x => q.Get(x))
          )
        )
        console.log(result.data)

        return result.data.map(d => {
          return {
            id: d.ts,
            color1: d.data.color1,
            color2: d.data.color2,
            color3: d.data.color3,
            reciever: d.data.reciever,
            sender: d.data.sender,
            message: d.data.message,
            link: d.data.link,
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
  },
  Mutation: {
    addLolly: async (
      _,
      { color1, color2, color3, sender, reciever, message }
    ) => {
      console.log(color1, color2, color3, sender, reciever, message)
      const result = await adminClient.query(
        q.Create(q.Collection("lollies"), {
          data: {
            color1,
            color2,
            color3,
            sender,
            reciever,
            message,
            link: shortid.generate(),
          },
        })
      )

      return result.data
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
