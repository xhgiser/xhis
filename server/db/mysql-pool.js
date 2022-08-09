// 连接mysql数据库
var mysql = require('mysql');
//建立连接池
var mspool = mysql.createPool({
    host: 'localhost',
    user: 'root', //用户名
    password: 'root', //密码
    database: 'xhis', //要连接数据库名
    //设置超时时间解决握手不活动超时问题
    connectionLimit: 1000,
    connectTimeout: 60 * 60 * 1000,
    acquireTimeout: 60 * 60 * 1000,
    timeout: 60 * 60 * 1000,
});
// 取出连接
function getPoolConnection() {
    let p = new Promise((resolve, reject) => {
        // 从连接池中取出连接 err:错误信息 conn：从连接池中取出的连接对象，通过这个对象去访问数据库
        mspool.getConnection((err, conn) => {
            // 成功信息
            if (err) {
                // 失败信息
                reject("mysql数据库连接失败!失败原因：" + err);
            } else {
                resolve(conn);
            }
        });
    })
    return p;
}
//执行sql
function execute(sql) {
    return new Promise(function(resolve, reject) {
        var connection;
        //then中有2个参数，第⼀个参数是状态变为成功后应该执⾏的回调函数，第⼆个参数是状态变为失败后应该执⾏的回调函数
        getPoolConnection().then(function(conn) {
            conn.query(sql, function(err, result) {
                if (err) {
                    console.log("sql错误");
                    console.log(err);
                    reject(err);
                } else {
                    resolve(result);
                    console.log("sql执行完成");
                    // console.log(result)
                    conn.release();
                    // console.log("释放完成");
                }
            });
        }).catch(function(err) {
            reject(err)
        })
    });
}
module.exports = {
    getPoolConnection,
    execute
};
