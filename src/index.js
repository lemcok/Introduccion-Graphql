const persons = [{
   "id": "e0e574fe-84d6-427b-acd7-9de4a6320e25",
   "name": "Carol",
   "phone": "186-132-2685",
   "street": "4867 Elmside Trail",
   "city": "Nicolet"
 }, {
   "id": "0ae03af6-e4e7-49b8-838b-ddc32c8078f0",
   "name": "Shem",
   "phone": "366-576-6914",
   "street": "27 Claremont Lane",
   "city": "Kostopil"
 }, {
   "id": "b032fc0d-4367-4385-a5d5-7020f4acf7f3",
   "name": "Simona",
   "phone": "777-787-8229",
   "street": "172 Hanover Junction",
   "city": "Okegawa"
 }, {
   "id": "a4943a56-99ce-461b-930a-651107533c2a",
   "name": "Leena",
   "phone": "498-721-8407",
   "street": "7 Debs Court",
   "city": "Yangjingziwan"
 }, {
   "id": "09e93d8a-e3cd-47b6-adfb-c085cc270eed",
   "name": "Hetty",
   "phone": "530-807-3926",
   "street": "603 Northland Lane",
   "city": "Nebug"
 }]

 import { ApolloServer, gql } from 'apollo-server'

 //la exclamacion "!" es para definir q es un campo requerido
 // apollo tiene varios tipos de datos como el "ID"
 // tambien puedes crear tu propio tipo de dato en apollo
 // simpre tienes q definir la Query por lo menos un metodo
 const typeDefs = gql`
   type Person {
      name: String! 
      phone: String
      street: String!
      city: String!
      id: ID!
   }

   type Query {
      personsCount: Int!
      allPersons: [Person]!
      findPerson(name: String!): Person
   }
 `

 const resolvers = {
    Query: {
      personsCount: () => persons.length,
      allPersons: () => persons,
      findPerson: (root, args) => {  //los args son los parametos q le vas pasarcomo el name
        const { name } = args
        return persons.find(person => person.name.toLocaleLowerCase() === name.toLocaleLowerCase())
      } 
    }
 }
 
 const server = new ApolloServer({
    typeDefs,
    resolvers
 })


 server.listen().then(({ url }) => {
    console.log( `Server ready at ${ url }` )
 })