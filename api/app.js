let express = require('express')
  , path = require('path')
  , favicon = require('serve-favicon')
  , logger = require('morgan')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , mongoose = require('mongoose')
  , { syncDB } = require('./syncDB')
  , { subscribeToBlockchainEvents } = require('./blockchainEventsWorker')
  , blockchainEventHandlers = require('./handleBlockchainEvents')
  , protos = require('./proto_processing/protos')

let app = express();

let config = require('./config');

mongoose.connect(config.mongoUrl);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected correctly to server");
});

let routes = require('./routes/index');
/* let accounts = require('./routes/accounts');
let assets = require('./routes/assets');
let holdings = require('./routes/holdings');
let offers = require('./routes/offers');
let offerHistory = require('./routes/offerHistory');
let payoffHistory = require('./routes/payoffHistory');
let transferHistory = require('./routes/transferHistory');
let blocks = require('./routes/blocks');
let blockchains = require('./routes/blockchains');
let transactions = require('./routes/transactions');
let fcm = require('./routes/fcm'); */

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, x-access-token");
  return next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
/* app.use('/accounts', accounts);
app.use('/assets', assets);
app.use('/holdings', holdings);
app.use('/offers', offers);
app.use('/offerHistory', offerHistory);
app.use('/payoffs', payoffHistory);
app.use('/transfers', transferHistory);
app.use('/blockchains', blockchains);
app.use('/blocks', blocks);
app.use('/transactions', transactions);
app.use('/fcm', fcm); */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

//protos.compile().then(() => console.log("Protos compiled"))

syncDB(function () {
  subscribeToBlockchainEvents(blockchainEventHandlers)
});



module.exports = app;
