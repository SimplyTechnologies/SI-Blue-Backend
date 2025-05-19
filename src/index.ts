import express from "express"
import config from "./configs/config.js"
import { initModels } from"./models/index.js"
import { usersRouter, vehiclesRouter } from "./routes/index.js"
import { customersRouter } from "./routes/index.js"


const app = express()


app.use(express.json())

const port: number = config.port

app.use("/api/users", usersRouter)
app.use("/api/vehicles", vehiclesRouter)
app.use("/api/customers", customersRouter)

initModels()
    .then(() => {
        console.log("Models initialized")
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`)
        })
    })
    .catch((err) => {
        console.log("Models didn't initialize")
        console.log(err.stack)
    })
