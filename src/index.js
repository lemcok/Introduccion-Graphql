const persons = [{
   age: "23", 
   "id": "e0e574fe-84d6-427b-acd7-9de4a6320e25",
   "name": "Carol",
   "phone": "186-132-2685",
   "street": "4867 Elmside Trail",
   "city": "Nicolet"
 }, {
   age: "16",
   "id": "0ae03af6-e4e7-49b8-838b-ddc32c8078f0",
   "name": "Shem",
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
   "street": "603 Northland Lane",
   "city": "Nebug"
 }]

 import { ApolloServer, gql, UserInputError } from 'apollo-server'
 import { v1 as uuid } from 'uuid'

 //la exclamacion "!" es para definir q es un campo requerido
 // apollo tiene varios tipos de datos como el "ID"
 // tambien puedes crear tu propio tipo de dato en apollo
 // simpre tienes q definir la Query por lo menos un metodo
 const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }
   type Address {
     street: String!
     city: String!
   }

   type Person {
      name: String! 
      phone: String
      id: ID!
      address1: String!
      address2: Address!
      check: String!
      canDrink: Boolean
   }

   type Query {
      personsCount: Int!
      allPersons(phone: YesNo): [Person]!
      findPerson(name: String!): Person
   }

   type Mutation{
     addPerson(
       name: String!
       phone: String
       street: String!
       city: String!
     ):Person
   }
 `

 const resolvers = {
    Query: {
      personsCount: () => persons.length,
      allPersons: (root, args) => {
        if(!args.phone) return persons

        const byPhone = persons => 
                          args.phone === "YES" ? persons.phone : !persons.phone //aqui he extraido solo el callback fuera
        
        return persons.filter( byPhone )
      },
      findPerson: (root, args) => {  //los args son los parametos q le vas pasarcomo el name
        const { name } = args
        return persons.find(person => person.name.toLocaleLowerCase() === name.toLocaleLowerCase())
      } 
    },
    Mutation: {
      addPerson: ( root, args ) => {
        if(persons.find( p => p.name === args.name)){
          // throw new Error(' Name must be unique') //imprimir el error asi normal
          throw new UserInputError(' Name must be unique',{
            invalidArgs: args.name
          }) //imprimir de forma mejor el error con 
        }
        // const { name, phone, street, city } = args
        const person = { ...args, id: uuid() }
        persons.push(person)
        return person
      }
    },
    Person: {
      // name: ( root ) => root.name,
      // phone: ( root ) => root.phone, ////esto lo hace apollo por defecto
      // street: ( root ) => root.street,
      // city: ( root ) => root.city,
      // id: ( root ) => root.id,
      
      address1: ( root ) => `${ root.street }, ${ root.city }`, //puedes resolver nuevos capos q son calculos pero tienes q describirlos en los Tipos definidos tmbn
      check: () => "propiedad por defecto",
      canDrink: ( root ) => root.age > 18 ,
      address2: ( root ) => {
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
    console.log( `Server ready at ${ url }` )
 })