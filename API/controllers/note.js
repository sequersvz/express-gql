import Note from "../db/model/note"
import User from "../db/model/user"
const jwt = require("jsonwebtoken")

const verifyToken = (token) => {
    return new Promise(res => {
        jwt.verify(token, process.env.JWT_TOKEN, (jwtError, jwtUser) => {
            if(jwtError) res("")


            User.findById(jwtUser.id, (error,user) => {
                if(user.refreshToken) {
                    res(jwtUser.id)
                }
                res("")
            })
        })

        // User.findById({}, (error, user) => {
    
    
        //     res({error: "password or username incorrect"})
        // })

        
    })

}

const verifyRefreshToken = (accessToken) => {

}

const deleteNote = (_,{input}) => {
    const {id, accessToken} = input
    const userId = verifyToken(accessToken)
    return new Promise(res => {
        Note.findOneAndDelete({_id: id, createdBy: userId}, (error, note) => {
            if (error) res({status: "error deleting note"})

            res({status: "note was deleted successfully", id: note.id})
        })
    })
}

const editNote = (_,{input}) => {
    const {id, title, description, accessToken} = input
    const userId = verifyToken(accessToken)

    return new Promise(res => {
        Note.findOneAndUpdate({_id: id, createdBy: userId}, {
            date: new Date(),
            title: title,
            description: description
        }, {projection: "-createdBy", useFindAndModify: false, new: true}, (error, note) => {
            if (error) res({status: "error editing note"})

            res({id: note._id, date: note.date, title: note.title, description: note.description, status: "Note updated"})
        })
    })
}

const getListNotes = async (_,{accessToken}) => {
    const userId = await verifyToken(accessToken)
    console.log(userId)
    return Note.find({createdBy: userId}, "-createdBy -__v")
    .then((note) => {
        if(note.length > 0) {
            return note
        }


        return []
    })
    .catch((v) => {status: v})
}

const getNote = (_,{id, accessToken}) => {

    const userId = verifyToken(accessToken)
    

    // return new Promise(res => {
    //     Note.findOne({_id: id, createdBy: userId}, "-createdBy -__v", (error, note) => {
    //         if(error) res({status: "error fetching note"})
    //         if(note === null) {
    //             res({status: "note not found"})
    //         }

    //         return res({status: "take your note", id: note._id, date: note.date, title: note.title, description: note.description})
    //     })
    // }) 

    return Note.findOne({_id: id, createdBy: userId}, "-createdBy -__v").then((note) => note ? {status: "take your note", id: note._id, date: note.date, title: note.title, description: note.description} 
    : {status: "error fetching note"}).catch(error => {status: error})
 

}

const createNote = (_,{input}) => {

    const {title, description, accessToken} = input
    const userId = verifyToken(accessToken)

    return new Promise(res => {
        new Note({
            date: new Date(),
            title: title,
            description: description,
            createdBy: userId
        }).save((error, note) => (error 
            ? res({status: "request error, try later"}) 
        : res({id: note._id, date: note.date, title: note.title, description: note.description})) )
    })
}


export {
    deleteNote,
    editNote,
    getListNotes,
    getNote,
    createNote
}