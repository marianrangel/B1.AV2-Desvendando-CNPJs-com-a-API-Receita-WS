function validarCNPJ(cnpj) {
    return cnpj.length === 14 && !isNaN(cnpj);
}

function exibirMensagem(mensagem, tipo = 'erro') {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = `<p class="${tipo}">${mensagem}</p>`;
    resultadoDiv.style.display = 'block';
}

async function consultarCNPJ() {
    const cnpj = document.getElementById('cnpj').value.trim().replace(/[^\d]+/g, '');
    const resultadoDiv = document.getElementById('resultado');

    if (!validarCNPJ(cnpj)) {
        exibirMensagem("Por favor, insira um CNPJ válido.");
        return;
    }

    resultadoDiv.style.display = 'none';
    resultadoDiv.innerHTML = '';

    const url = `https://api.allorigins.win/get?url=https://receitaws.com.br/v1/cnpj/${cnpj}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            switch (response.status) {
                case 400:
                    throw new Error("CNPJ inválido. Verifique e tente novamente.");
                case 404:
                    throw new Error("CNPJ não encontrado na base de dados.");
                case 429:
                    throw new Error("Muitas requisições! Aguarde um momento e tente novamente.");
                case 500:
                case 504:
                    throw new Error("Erro no servidor. Tente novamente mais tarde.");
                default:
                    throw new Error("Erro desconhecido. Tente novamente.");
            }
        }
        
        const data = await response.json();
        const apiResponse = JSON.parse(data.contents);

        if (apiResponse.status === 'ERROR') {
            exibirMensagem(apiResponse.message);
        } else {
            resultadoDiv.innerHTML = `
                <h3>Resultado da Consulta</h3>
                <p><strong>Nome:</strong> ${apiResponse.nome}</p>
                <p><strong>Nome Fantasia:</strong> ${apiResponse.fantasia}</p>
                <p><strong>Situação:</strong> ${apiResponse.situacao}</p>
                <p><strong>Atividade Principal:</strong> ${apiResponse.atividade_principal[0]?.text || 'Não disponível'}</p>
            `;
            resultadoDiv.style.display = 'block';
        }
    } catch (error) {
        exibirMensagem(error.message);
    }
}