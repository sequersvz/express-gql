import {signIn, signUp, logOut, refreshToken} from "./auth"
import {getNote, getListNotes} from "./note"

export default {
    // Query: {
    //     getNote: (_,args) => getNote(_,args),
    //     getListNotes
    // },
    Mutation: {
        signIn,
        signUp,
        logOut,
        refreshToken
    }
}