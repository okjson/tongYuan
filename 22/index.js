// 引入nodejs-websocket
const ws = require('nodejs-websocket');
// 定义监听的host地址跟port端口
const host = '127.0.0.1',
    port = 8000;
// 创建ws服务
const service = ws.createServer((conn) => {
    // 定义测试数据
    const data = ['消息1', '消息2', '消息3'];
    conn.on('text', (message) => {
        // 当收到消息的时候就开始定时推送
        console.log('message', message);
        setInterval(() => {
            // 随机推送message里的内容
            conn.sendText(data[(Math.random() * 2).toFixed(0)]);
        }, 5 * 1000);
    });
}).listen(port, host, () => {
    console.log('service---connection---');
});