import APP_DB from "../index"

module.exports =  APP_DB.createModel("notes", {
        date: Date,
        title: String,
        description: String,
        createdBy: String
    })