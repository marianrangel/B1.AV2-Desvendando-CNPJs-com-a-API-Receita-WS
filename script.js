// script.js
function consultarCNPJ() {
    const cnpj = document.getElementById('cnpj').value.trim().replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
    const resultadoDiv = document.getElementById('resultado');

    if (!cnpj || cnpj.length !== 14) {
        alert("Por favor, insira um CNPJ válido.");
        return;
    }

    // Limpar resultados anteriores
    resultadoDiv.style.display = 'none';
    resultadoDiv.innerHTML = '';

    // Utilizando o AllOrigins como proxy
    const url = `https://api.allorigins.win/get?url=https://receitaws.com.br/v1/cnpj/${cnpj}`;

    // Requisição HTTP
    fetch(url)
        .then(response => response.json())  // AllOrigins retorna o conteúdo como JSON, já faz a conversão
        .then(data => {
            // O conteúdo retornado está dentro da propriedade "contents" no JSON do AllOrigins
            const apiResponse = JSON.parse(data.contents);

            if (apiResponse.status === 'ERROR') {
                resultadoDiv.innerHTML = `<p>Erro: ${apiResponse.message}</p>`;
                resultadoDiv.style.display = 'block';
            } else {
                // Exibindo os dados retornados
                resultadoDiv.innerHTML = `
                    <h3>Resultado da Consulta</h3>
                    <p><strong>Nome:</strong> ${apiResponse.nome}</p>
                    <p><strong>Nome Fantasia:</strong> ${apiResponse.fantasia}</p>
                    <p><strong>Situação:</strong> ${apiResponse.situacao}</p>
                    <p><strong>Atividade Principal:</strong> ${apiResponse.atividade_principal[0]?.text || 'Não disponível'}</p>
                `;
                resultadoDiv.style.display = 'block';
            }
        })
        .catch(error => {
            resultadoDiv.innerHTML = `<p style="color: red;">${error.message}</p>`;
            resultadoDiv.style.display = 'block';
        });
}
