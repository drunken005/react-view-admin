/**
 * Created on 2017/6/2.
 * @fileoverview 请填写简要的文件说明.
 * @author westwood
 */
 
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

const port = process.env.PORT || 8787;
app.listen(port, function () {
    console.log(`app listening on port ${port}`)
});
