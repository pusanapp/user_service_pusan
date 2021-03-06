const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors')
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user_route');
const authRouter = require('./routes/auth_route');
const jwtRouter = require('./routes/jwt_router');
const panelUserRouter = require('./routes/panel_user_route')
const app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/user', usersRouter);
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/token', jwtRouter)
app.use('/api/v1/panel-user', panelUserRouter)
module.exports = app;
