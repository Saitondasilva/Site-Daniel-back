// test-db.js
const { pool } = require('./config/database');

async function testConnection() {
    try {
        console.log('🔍 Testando conexão com o banco de dados...');
        
        // Testar conexão
        const [result] = await pool.query('SELECT 1 + 1 AS test');
        console.log('✅ Conexão bem sucedida!');
        console.log('📊 Teste:', result[0].test);
        
        // Listar tabelas
        const [tables] = await pool.query('SHOW TABLES');
        console.log('📋 Tabelas encontradas:');
        tables.forEach(table => {
            console.log('   -', Object.values(table)[0]);
        });
        
        // Verificar tabela categorias
        const [count] = await pool.query('SELECT COUNT(*) as total FROM categorias');
        console.log('📊 Total de categorias:', count[0].total);
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
        console.error('📝 Detalhes:', error);
    } finally {
        process.exit();
    }
}

testConnection();