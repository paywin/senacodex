const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=============== SENACODEX SETUP ===============');

// 1. Copy backend/.env.example -> backend/.env
const envExamplePath = path.join(__dirname, 'backend', '.env.example');
const envPath = path.join(__dirname, 'backend', '.env');

try {
  if (!fs.existsSync(envPath)) {
    console.log('Copiando backend/.env.example para backend/.env...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✓ backend/.env criado com sucesso.');
  } else {
    console.log('✓ backend/.env já existe. Pulando cópia.');
  }
} catch (err) {
  console.error('Erro ao copiar .env:', err.message);
}

// 2. Install dependencies
console.log('\nInstalando dependências do monorepo (isso pode levar alguns instantes)...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: __dirname });
  console.log('✓ Dependências instaladas com sucesso.');
} catch (err) {
  console.error('Erro ao instalar dependências:', err.message);
  console.log('Tentando prosseguir mesmo assim...');
}

// 3. Print instructions and demo users
console.log('\n================================================');
console.log('✓ SETUP CONCLUÍDO COM SUCESSO!');
console.log('================================================\n');

console.log('Como executar a aplicação:');
console.log('  Modo Memória (Sem PostgreSQL):');
console.log('    npm run dev');
console.log('    (O servidor iniciará automaticamente com banco em memória local)');
console.log('\n  Modo PostgreSQL (Requer Docker):');
console.log('    npm run dev:full');
console.log('    (Inicia o container Docker do PostgreSQL e executa as migrações/seeders)');

console.log('\nContas de Demonstração Disponíveis:');
console.log('------------------------------------------------');
console.log('1. Coordenador Demo:');
console.log('   Email: admin@example.com');
console.log('   Senha: Admin123');
console.log('2. Aluno Demo:');
console.log('   Email: user@example.com');
console.log('   Senha: User123');
console.log('3. Aluno Senac:');
console.log('   Email: aluno@senac.com.br');
console.log('   Senha: Aluno@123');
console.log('4. Professor Senac:');
console.log('   Email: professor@senac.com.br');
console.log('   Senha: Professor@123');
console.log('5. Coordenador Senac:');
console.log('   Email: coordenador@senac.com.br');
console.log('   Senha: Coordenador@123');
console.log('------------------------------------------------\n');
console.log('Pressione Ctrl+C para encerrar os servidores no terminal.');
console.log('================================================');
