import APP_DB from "../index"

module.exports =  APP_DB.createModel("user", {
        username: String,
        password: String,
        createdDate: Date,
        refreshToken: String
    })