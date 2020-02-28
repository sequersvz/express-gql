export default `
type Note {
    id: String!
    date: String!
    title: String!
    description: String!
    status: String
}

type actionNote {
    id: String!
    accessToken: String
    description: String
    title: String
}


type AuthPayload {
    accessToken: String
    refreshToken: String
    error: String
}

input User {
    username: String!
    password: String!
}


type Query {
    getNote(id: ID!, accessToken: ID!): Note
    getListNotes(accessToken: ID!): [Note]
}

type Mutation {
    signIn(input: User): AuthPayload
    signUp(input: User): AuthPayload
    refreshToken(refreshToken: ID!) : AuthPayload
    logOut(accessToken: ID!): AuthPayload
    deleteNote(input: actionNote!): Note
    editNote(input: actionNote!): Note
    createNote(input: actionNote!): Note
}`