const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conectando ao banco de dados MySQL
const sequelize = new Sequelize('clinica', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
});

// Definindo o modelo do paciente
const pacientes = sequelize.define('pacientes', {
    nome: { type: Sequelize.STRING, allowNull: false },
    cpf: { type: Sequelize.STRING, unique: true, allowNull: false },
    dataNasc: { type: Sequelize.DATE, allowNull: false },
    peso: { type: Sequelize.FLOAT },
    altura: { type: Sequelize.FLOAT },
    uf: { type: Sequelize.STRING, allowNull: false },
});

// Sincronizando o modelo com o banco de dados
sequelize.sync()
    .then(() => {
        console.log('Banco de dados sincronizado');
    })
    .catch(err => {
        console.error('Erro ao sincronizar o banco de dados:', err);
    });

// Rota para cadastrar paciente
app.post('/api/cadastrarPaciente', async (req, res) => {
    try {
        // Lógica para validar e cadastrar o paciente no banco de dados
        const pacienteData = req.body;
        
        // Criando um registro no banco de dados
        const novoPaciente = await pacientes.create(pacienteData);

        // Exemplo de resposta
        res.json({ message: 'Paciente cadastrado com sucesso!', pacientes });
    } catch (error) {
        console.error('Erro ao cadastrar paciente:', error);
        res.status(500).json({ error: 'Erro ao cadastrar paciente.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
