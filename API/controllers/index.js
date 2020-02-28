import {signIn, signUp, logOut, refreshToken} from "./auth"
import {  deleteNote,
    editNote,
    getListNotes,
    getNote,
    createNote} from "./note"

export default {
    Query: {
        getNote,
        getListNotes
    },
    Mutation: {
        // Auth Mutations
        signIn,
        signUp,
        logOut,
        refreshToken,
        // Notes mutations 
        deleteNote,
        editNote,
        createNote
    }
}