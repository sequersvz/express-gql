import dotenv from "dotenv"
dotenv.config()
import express from "express"
import bodyParser from "body-parser"
import APP_DB from "./API/db"
import API_Routes from "./API/graphql"
const app = express()

app.disable("x-powered-by");

app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

app.set("PORT", process.env.PORT || 8000)


app.listen(app.get('PORT'), () => {
    console.log(`Server started on port ${app.get('PORT')}`);
})
API_Routes(app)