fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then(response => response.json())
    .then(data => {
        const ufSelect = document.getElementById('uf');
        data.forEach(uf => {
            const option = document.createElement('option');
            option.value = uf.sigla;
            option.text = uf.sigla + ' - ' + uf.nome;
            ufSelect.appendChild(option);
        });
    })
    .catch(error => console.error('Erro ao obter a lista de UF:', error));

function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/[^\d]/g, ''); // Remover caracteres não numéricos
    
    if (cpfLimpo.length !== 11 || /^(\d)\1{10}$/.test(cpfLimpo)) {
        return false; // CPF não possui 11 dígitos ou todos os dígitos são iguais
    }

    const calculaDigito = (slice) => {
        let soma = 0;
        let resto;

        for (let i = 1; i <= slice.length; i++) {
            soma += parseInt(slice.charAt(i - 1)) * (slice.length + 1 - i);
        }

        resto = (soma * 10) % 11;

        return resto === 10 ? 0 : resto;
    };

    const primeiroDigito = calculaDigito(cpfLimpo.slice(0, 9));
    const segundoDigito = calculaDigito(cpfLimpo.slice(0, 10));

    return primeiroDigito === parseInt(cpfLimpo.charAt(9)) && segundoDigito === parseInt(cpfLimpo.charAt(10));
}

function exibirErroCPF() {
    showErrorMessage('CPF inválido. Por favor, verifique o número do CPF.');
}

function validateForm() {
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const uf = document.getElementById('uf').value;

    if (!nome || !cpf || !uf) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return false;
    }

    // Adicione outras lógicas de validação conforme necessário

    return true;
}

function showSuccessMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = 'Cadastro realizado com sucesso!';
    messageDiv.classList.remove('hidden');
}

function showErrorMessage(errorMessage) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = errorMessage || 'Erro ao cadastrar paciente. Por favor, tente novamente.';
    messageDiv.classList.remove('hidden');
}

function hideMessage() {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = '';
    messageDiv.classList.add('hidden');
}

function submitForm() {
    if (!validateForm()) {
        return;
    }

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataNasc = document.getElementById('dataNasc').value;
    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;
    const uf = document.getElementById('uf').value;

    if (!validarCPF(cpf)) {
        exibirErroCPF(); // Chamar a função de exibição de erro CPF
        return;
    }

    fetch('/api/cadastrarPaciente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, cpf, dataNasc, peso, altura, uf }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do servidor:', data);
        if (data.mensagem == 'Paciente cadastrado com sucesso!') {
            showSuccessMessage();
        } else {
            showErrorMessage('Erro no cadastro. Por favor, tente novamente.');
        }
    })
    .catch(error => {
        console.error('Erro no envio para o servidor:', error);
        showErrorMessage('Erro ao se comunicar com o servidor. Por favor, tente novamente.');
    });
}