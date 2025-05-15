const express = require("express")
const settings = require("./configs/settings")

const { usersRouter, customersRouter, vehiclesRouter} = require("./routes/index")

const PORT = settings.APP_PORT || 3001

const app = express()
app.use(express.json())

app.use("api/users", usersRouter)
app.use("api/vehicle", vehiclesRouter)
app.use("api/customer", customersRouter)

app.listen(() => {
    console.log(`Server is running on ${PORT}`)
})