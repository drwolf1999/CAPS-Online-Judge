const express = require('express');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const constantsSecret = require('./constants/Secret.js');

require('./middleware/passport/passport')(passport);

/**
 * DB 설정
 * */
// [ CONFIGURE mongoose ]

// CONNECT TO MONGODB SERVER
const db = mongoose.connection;
db.on('error', console.error);
db.once('open', function () {
    // CONNECTED TO MONGODB SERVER
    console.log("Connected to mongod server");
});
mongoose.set('useCreateIndex', true);
mongoose.connect(constantsSecret.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    auth: {
        user: constantsSecret.user,
        password: constantsSecret.pwd,
    }
})
    .then(() => {
        console.log('Connected to mongod Server Successfully');
    })
    .catch((error) => {
        console.log('error : ' + error);
    });
autoIncrement.initialize(mongoose.connection);

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

// CORS handling
// 브라우저 보안 문제.
// 브라우저만! postman 등 툴은 상관 없음.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, Access-Token, Uid');
    res.header('Access-Control-Expose-Headers', 'Origin, Content-Type, Accept, Authorization, Access-Token, Uid');
    // 브라우저가 요청 보내기 전에 보냄.
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    // 계속 진행
    next();
});

let router = require('./routes/index');

app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.locals.user = req.user;
});

module.exports = app;
