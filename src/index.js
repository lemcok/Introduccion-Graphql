import { ApolloServer, gql, UserInputError } from 'apollo-server'
import { connectDB } from './database.js'
import Person from './models/Person.js'

 //la exclamacion "!" es para definir q es un campo requerido
 // apollo tiene varios tipos de datos como el "ID"
 // tambien puedes crear tu propio tipo de dato en apollo
 // simpre tienes q definir la Query por lo menos un metodo
 const typeDefs = gql`
  # enum YesNo {
  #   YES
  #   NO
  # }
   type Address {
     street: String!
     city: String!
   }

   type Person {
      name: String! 
      phone: String
      id: ID!
      # address1: String!
      address: Address!
      # city: String!
      # street: String!
      # check: String!
      # canDrink: Boolean
   }

   type Query {
      personsCount: Int!
      allPersons: [Person]!
      findPerson(name: String!): Person
   }

   type Mutation{
     addPerson(
       name: String!
       phone: String
       street: String!
       city: String!
     ):Person
     
     editNumber(
      name: String!
      phone: String!
     ):Person
   }
 `

 const resolvers = {
    Query: {
      personsCount: () => Person.collection.countDocuments(),

      allPersons: async(root, args) => {
        return Person.find({})
      },

      findPerson: async(root, args) => {
        const { name } = args
        return Person.findOne({ name })
      } 
    },

    Mutation: {
      
      addPerson: ( root, args ) => {
        const person = new Person({...args})
        return person.save()
      },

      editNumber: async(root, args) => {
        const person = await Person.findOne({ name: args.name })
        person.phone = args.phone
        return person.save()
      }
    },

    Person: {
      // name: ( root ) => root.name,
      // phone: ( root ) => root.phone, ////esto lo hace apollo por defecto
      // street: ( root ) => root.street,
      // city: ( root ) => root.city,
      // id: ( root ) => root.id,
      
    //   // address1: ( root ) => `${ root.street }, ${ root.city }`, //puedes resolver nuevos capos q son calculos pero tienes q describirlos en los Tipos definidos tmbn
    //   // check: () => "propiedad por defecto",
    //   // canDrink: ( root ) => root.age > 18 ,
      address: ( root ) => {
        return {
          street: root.street,
          city: root.city
        }
      }
    }
 }
 
 const server = new ApolloServer({
    typeDefs,
    resolvers
 })

 server.listen().then(({ url }) => {
    connectDB()
    console.log( `Server ready at ${ url }` )
 })