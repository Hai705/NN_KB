require('dotenv').config();
var cors = require('cors');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// --- CÁC ROUTE CŨ ---
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var commentsRouter = require('./routes/comments');
var cartsRouter = require('./routes/carts');
var ordersRouter = require('./routes/orders');
var wishlistRouter = require('./routes/wishlist');
var statisticalRouter = require('./routes/statistical');
var contactRouter = require('./routes/contacts');

// --- ROUTE MỚI (THANH TOÁN) ---
var paymentRouter = require('./routes/payment'); 

var mongoose = require('./config/index');

// Kết nối database (Đảm bảo file config/index.js của bạn đã đọc process.env.MONGO_URI)
mongoose.connect(); 

var app = express();

// =========================================================
// CẤU HÌNH CORS CHO DEPLOY (QUAN TRỌNG)
// =========================================================
// Khi deploy, Frontend (Vercel) và Backend (Render) khác domain.
// Cấu hình này cho phép Frontend gọi API mà không bị chặn.
app.use(cors({
    origin: '*', // Cho phép tất cả các domain truy cập (Hoặc thay bằng domain Vercel của bạn: 'https://shop-frontend.vercel.app')
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Các method cho phép
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Các header cho phép
    credentials: true // Cho phép gửi cookie/token nếu cần
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// --- ĐĂNG KÝ URL ---
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/comments', commentsRouter);
app.use('/carts', cartsRouter);
app.use('/orders', ordersRouter);
app.use('/wishlist', wishlistRouter);
app.use('/statistical', statisticalRouter);
app.use('/contacts', contactRouter);

// URL thanh toán: /payment/momo
app.use('/payment', paymentRouter); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
