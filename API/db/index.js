import mongoose from "mongoose"


class APP_DB {
    constructor() {
        this._connect()
    }

    _connect() {
        mongoose.connect(
        // process.env.DB_HOST
        "mongodb://localhost/app-notes-db"
        , {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true
        });
    }

    createModel(name, objectSchema){
        return mongoose.model(name, new mongoose.Schema(objectSchema))
    }
}

export default new APP_DB()