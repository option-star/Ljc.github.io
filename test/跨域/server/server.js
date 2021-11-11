const http = require('http'); // 引入http模块

const server = http.createServer(); // 创建服务器对象

server.listen(3000, () => { // 开启服务器监听3000端口
    console.log('Server is running...');
});

//4. 监听浏览器请求并进行处理
server.on('request', (req, res) => {
    // end方法能够将数据返回给浏览器，浏览器会显示该字符串
    res.end('Hello Nodejs');
});