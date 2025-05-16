const express = require('express');
const settings = require('./configs/config');
const initModels = require('./models/index');

const { usersRouter, customersRouter, vehiclesRouter } = require('./routes/index');

const PORT = settings.APP_PORT || 3001;

const app = express();
app.use(express.json());

app.use('api/users', usersRouter);
app.use('api/vehicle', vehiclesRouter);
app.use('api/customer', customersRouter);

initModels()
  .then(() => {
    console.log('Model inited');
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch(err => {
    console.log("Models didn't init");
    console.log(err.stack);
  });
