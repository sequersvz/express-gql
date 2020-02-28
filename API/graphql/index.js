import graphqlHTTP from "express-graphql"
import resolvers from "../controllers"
import graphqlSchema from "./graphql.schema"
import { makeExecutableSchema } from 'graphql-tools';


export default (app) => {
    app.use((req, res, next) => {
        // Website you wish to allow to connect
        res.setHeader("Access-Control-Allow-Origin", `http://localhost:${app.get("PORT")}/`);

        // Request methods you wish to allow
        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, DELETE"
        );
        // Request headers you wish to allow
        res.header(
          "Access-Control-Allow-Headers",
          "Origin, X-Requested-With, Content-Type, Accept, X-Amz-Security-Token, x-amz-date, Authorization, count"
        );
        res.header("Access-Control-Expose-Headers", "count");
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader("Access-Control-Allow-Credentials", false);

        res.setHeader("Content-Type", "application/json")
    
        next();
      });

      const schema = makeExecutableSchema({
        typeDefs: graphqlSchema,
        resolvers
      })

        app.use("/graphql", graphqlHTTP({
            schema: schema,
            graphiql: true
        }) )
}

