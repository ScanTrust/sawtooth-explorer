let express = require('express'),
  path = require('path'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  { subscribeToBlockchainEvents } = require('./lib/events/subscriber'),
  blockchainEventHandlers = require('./lib/events/handlers'),
  proxy = require('http-proxy-middleware'),
  passport = require('passport')

  config = require('./config'),
  { normalizeError } = require('./authentication')
//  { syncDB } = require('./lib/syncDBHTTP') // looks like this file could be removed bc we never request /state or /blocks (except /blocks/<blockId> in block-commit handler)

let app = express();

app.use(
  config.SAWTOOTH_PROXY_PATH,
  proxy({
    target: config.blockchain.REST_API_URL,
    pathRewrite: { ['^' + config.SAWTOOTH_PROXY_PATH]: '/' },
    changeOrigin: true
  })
);

mongoose.connect(config.MONGO_URL);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Connected to db server");
});

let routes = require('./routes/index');
let auth = require('./routes/auth');
let stateElements = require('./routes/stateElements');
let transactions = require('./routes/transactions');
let blocks = require('./routes/blocks');
let signers = require('./routes/signers');
let txnFamilies = require('./routes/txnFamilies');

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
// right after setting necessary headers
app.options('*', function (req, res) {
  res.status(200).end('ok')
})

app.use(express.static(path.join(__dirname, 'public')));

function authenticateJwt(req, res, next) {
  passport.authenticate('jwt', { session: false }, function(info, user, err) {
    console.log({err, user, info})
    if (err) return next(err);
    if (!user) return next(Error('Unauthorized'));
    req.user = user;
    next();
  })(req, res, next);
}

app.use([
  '/signers/*',
  '/txnFamilies/*'
], authenticateJwt)

app.use('/', routes);
app.use('/auth', auth);
app.use('/stateElements', stateElements);
app.use('/transactions', transactions);
app.use('/blocks', blocks);
app.use('/signers', signers);
app.use('/txnFamilies', txnFamilies);

app.use([
  '/auth',
  '/stateElements',
  '/transactions',
  '/blocks',
  '/signers',
  '/txnFamilies'
], function (err, req, res, next) {
  next(normalizeError(err))
})

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
    console.log({err})
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
      ok: false
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    ok: false
  });
});

subscribeToBlockchainEvents(blockchainEventHandlers)

module.exports = app;
