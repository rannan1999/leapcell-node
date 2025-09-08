const http = require('http');
const { execSync } = require('child_process');

// 从环境变量加载敏感数据
const PORT = process.env.PORT || 3000;
const NEZHA_SERVER = process.env.NEZHA_SERVER || 'nezha.mingfei1981.eu.org:443';
const NEZHA_KEY = process.env.NEZHA_KEY || '1gKM6VXPAoG2026ccb';

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Server is running');
});

// 执行启动脚本逻辑
const startScript = () => {
  try {
    // 赋予 swith 可执行权限
    execSync('chmod +x ./main/swith');

    // 在后台启动 swith
    execSync(`nohup ./main/swith -s "${NEZHA_SERVER}" -p "${NEZHA_KEY}" --tls > /dev/null 2>&1 &`);

    // 可选：启动后删除 swith（如果不需要保留，取消注释以下行）
    // execSync('rm ./main/swith');
  } catch (error) {
    console.error('startScript 错误:', error.message, error.stack);
    process.exit(1); // 失败时退出
  }
};

// 启动 HTTP 服务器并运行脚本
server.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
  startScript(); // 服务器启动后运行脚本
});

// 处理进程终止以清理
process.on('SIGINT', () => {
  console.log('服务器正在关闭');
  server.close(() => {
    process.exit(0);
  });
});