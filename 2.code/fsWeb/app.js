var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var upload = require('jquery-file-upload-middleware');
var routes = require('./routes/index');
// var upload = require('./routes/upload');

var app = express();
var formidable = require('formidable');

var JFUM = require('jfum');
var jfum = new JFUM({
    minFileSize: 204800,                      // 200 kB
    maxFileSize: 5242880,                     // 5 mB
    acceptFileTypes: /\.(gif|jpe?g|png|docx)$/i    // gif, jpg, jpeg, png
});
app.options('/upload', jfum.optionsHandler.bind(jfum));
app.use('/upload', jfum.postHandler.bind(jfum), function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("content-type", "multipart/form-data");

    console.log(req);
    // Check if upload failed or was aborted
    if (req.jfum.error) {
        // req.jfum.error
        console.log(req.jfum.error);
    } else {
        // Here are the uploaded files
        for (var i = 0; i < req.jfum.files.length; i++) {
            var file = req.jfum.files[i];

            // Check if file has errors
            if (file.errors.length > 0) {
                for (var j = 0; i < file.errors.length; i++) {
                    // file.errors[j].code
                    // file.errors[j].message
                    console.log(file.errors[j].code);
                    console.log(file.errors[j].message);
                }

            } else {
                // file.field - form field name
                // file.path - full path to file on disk
                // file.name - original file name
                // file.size - file size on disk
                // file.mime - file mime type
                console.log(file.path);
                console.log(file.name);
            }
        }
    }
});
// app.use('/upload', upload.fileHandler({
//     uploadDir: 'f:/programm/huanbao/fsWeb/public/report',
//     uploadUrl: '/report',
//     imageVersions: {
//         thumbnail: {
//             width: 80,
//             height: 80
//         }
//     },
//     accessControl:{
//         allowOrigin:'*',
//         allowMethods:'PUT,POST,GET,DELETE,OPTIONS'
//     }
// }));

// app.use('/upload', function (req, res) {
//     var formParse = new formidable.IncomingForm();
//     formParse.uploadDir = './public/temp/';//缓存地址
//     formParse.multiples = true;//设置为多文件上传
//     formParse.keepExtensions = true;//是否包含文件后缀
//     formParse.parse(req, function (error, fields, files) {
//         if (error) {
//             res.json({
//                 ret: 0,
//                 msg: '文件上传失败'
//             });
//             console.log(error);
//             return false;
//         }
//         console.log(fields);
//         console.log(files);
//     });
// });


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
// app.use('/upload',upload);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
