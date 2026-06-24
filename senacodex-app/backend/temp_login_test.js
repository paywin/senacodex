const http = require('http');
const users = [
  { email: 'aluno@senac.com.br', password: 'Aluno@123' },
  { email: 'professor@senac.com.br', password: 'Professor@123' },
  { email: 'coordenador@senac.com.br', password: 'Coordenador@123' },
];

users.forEach((u) => {
  const data = JSON.stringify(u);
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
    },
  };

  const req = http.request(options, (res) => {
    let body = '';
    res.on('data', (chunk) => {
      body += chunk;
    });
    res.on('end', () => {
      console.log(res.statusCode, u.email, body);
    });
  });

  req.on('error', (e) => {
    console.error('ERR', u.email, e.message);
  });

  req.write(data);
  req.end();
});
