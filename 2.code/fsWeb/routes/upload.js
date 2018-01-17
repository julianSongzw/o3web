/* eslint-disable max-len,camelcase,comma-dangle,space-before-function-paren,no-trailing-spaces,quotes */
/**

 * @Title: upload
 * @Description: 文件上传服务接口
 * @author songzw@cychina.cn （宋志玮）
 * @date 2017/12/12
 * @version V1.0
 * @Revision : $
 * @Id: $
 *
 * Company: 合肥安慧软件有限公司
 * Copyright: Copyright (c) 2017
 */
'use strict';
var upload = require('jquery-file-upload-middleware');
var express = require('express');
var router = express.Router();
upload.configure({
    uploadDir: 'f:/programm/huanbao/fsWeb/public/report',
    uploadUrl: '/report',
    imageVersions: {
        thumbnail: {
            width: 80,
            height: 80
        }
    }
});

router.use('/', function(req, res, next) {
    upload.fileHandler();
});

module.exports = router;