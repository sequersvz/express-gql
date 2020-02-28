import Note from "../db/model/note"
const jwt = require("jsonwebtoken")

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_TOKEN, (jwtError, jwtUser) => {
        if(jwtError) return null
        return jwtUser.id
    })
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
        }, {projection: "-createdBy", useFindAndModify: false}, (error, note) => {
            if (error) res({status: "error editing note"})

            res({status: "note updated successfully", id: note.id})
        })
    })
}

const getListNotes = (_,{accessToken}) => {
    const userId = verifyToken(accessToken)

    return Note.find({createdBy: userId}, "-createdBy -__v")
    .then((note) => {
        if(note.length > 0) {
            return {status: "notes fetched", notes: note}
        }

        return {status: "user doesnt has notes yet"}
    })
    .catch((v) => {status: v})
}

const getNote = (_,{id, accessToken}) => {

    const userId = verifyToken(accessToken)

    return new Promise(res => {
        Note.findOne({_id: id, createdBy: userId}, "-createdBy -__v", (error, note) => {
            if(error) res({status: "error fetching note"})
            if(note === null) {
                res({status: "note not found"})
            }

            return res({status: "take your note", note})
        })
    }) 
 

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
        : res({status: "created", 
        note: {id: note._id, date: note.date, title: note.title, description: note.description}
    })) )
    })
}


export {
    deleteNote,
    editNote,
    getListNotes,
    getNote,
    createNote
}