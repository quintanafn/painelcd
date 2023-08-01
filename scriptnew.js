let profilesData = []; // Armazenara os perfis dos clientes obtidos da planilha
let currentProfileIndex = 0; // Índice do perfil atual sendo exibido

const Key = "AIzaSyD69bNGiYwbA24b2u7jytQIdYwCGJ6dM-Q";
const spreadsheetId = "1j2NcRWjP7QC5unRgbC_FvZbgrQpsV7jrcil16ECnUvw";
const sheetName = "dados";
let rowIndex = parseInt(localStorage.getItem("perfilAtual")) || 1;

// Carrega os dados dos clientes
function carregarPerfilCliente() {
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A${rowIndex}:K${rowIndex}?key=${Key}`)
    .then((response) => response.json())
    .then((data) => {
      exibirPerfilCliente(data.values[0])
    console.log(data.values[0])
  })
    
    .catch((error) => console.error("Erro ao obter dados da planilha:", error));
}


// Exibi os dados do perfil atual na página
function exibirPerfilCliente(profile) {
  document.querySelector('.niche .field-content').textContent = profile[5];
  document.querySelector('.status .field-content').textContent = profile[4];
  document.querySelector('#company-photo').src = profile[2];
  document.querySelector('.company-name .field-content').textContent = profile[0];
  document.querySelector('.name').value = profile[1];
  document.querySelector('.phone-number .field-content').textContent = profile[3];
  document.querySelector('.cnpjs').value = profile[7];
  document.querySelector('.observation').value = profile[6];
}

// Carregar os dados dos clientes
function carregarPerfisClientes() {
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}?key=${Key}`)
    .then((response) => response.json())
    .then((data) => {
      profilesData = data.values;
      exibirPerfilCliente(profilesData[currentProfileIndex]);
    })
    .catch((error) => console.error("Erro ao obter dados da planilha:", error));
}

function nextProfile() {
  currentProfileIndex++;
  if (currentProfileIndex >= profilesData.length) {
    currentProfileIndex = 0;
  }
  exibirPerfilCliente(profilesData[currentProfileIndex]);
}

function previousProfile() {
  currentProfileIndex--;
  if (currentProfileIndex < 0) {
    currentProfileIndex = profilesData.length - 1;
  }
  exibirPerfilCliente(profilesData[currentProfileIndex]);
}

// Chamar o carregamento dos perfis dos clientes quando a página for carregada
document.addEventListener('DOMContentLoaded', carregarPerfisClientes);

// Salva o índice do perfil atual no armazenamento local
function salvarPerfilAtual() {
  localStorage.setItem('perfilAtual', currentProfileIndex);
}

// Restaura o perfil atual do armazenamento local
function restaurarPerfilAtual() {
  const savedIndex = localStorage.getItem('perfilAtual');
  if (savedIndex !== null) {
    currentProfileIndex = parseInt(savedIndex);
    exibirPerfilCliente(profilesData[currentProfileIndex]);
  }
}

// Restaura o perfil atual quando a página for carregada
document.addEventListener('DOMContentLoaded', restaurarPerfilAtual);

// Salvar o perfil atual quando houver mudança de perfil
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.navigation-buttons').addEventListener('click', salvarPerfilAtual);
});

/*function atualizarNomeResponsavel() {
  const nameInput = document.getElementById('nameInput');
  const newName = nameInput.value.trim();

  // Verifica se o novo nome não está vazio
  if (newName !== '') {
    // Atualiza o valor no objeto profilesData
    profilesData[currentProfileIndex][1] = newName;

    // Envia as alterações para a planilha
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}!A${currentProfileIndex + 2}?valueInputOption=RAW&key=${Key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[newName]],
      }),
    })
    .then((response) => {
      if (response.ok) {
        console.log('Nome atualizado com sucesso!');
      } else {
        console.error('Erro ao atualizar nome:', response.statusText);
      }
    })
    .catch((error) => console.error('Erro ao atualizar nome:', error));
  } else {
    console.error('O nome não pode estar vazio.');
  }
}*/

const atualizarNomeResponsavel = () => {
  const rowIndex = 8; // Supondo que está atualizando a linha 8
  const range = `dados!A${rowIndex}`;

  const requestBody = {
    values: [[document.querySelector('.name').value]]
  };

  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW&key=${Key}`, {
    method: 'PUT',
    headers: {
      "Authorization": `Bearer ${Key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
  .then(response => {
    console.log(response)
    return response.json()})
  .then(data => {
    console.log('Dados atualizados:', data);
  })
  .catch(error => {
    console.error('Erro ao atualizar nome:', error);
  });
};

