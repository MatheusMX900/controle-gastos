// Seletores dos elementos do DOM
const form = document.getElementById('form-gasto');
const descricaoInput = document.getElementById('descricao');
const valorInput = document.getElementById('valor');
const categoriaInput = document.getElementById('categoria');
const listaGastos = document.getElementById('lista-gastos');
const valorTotal = document.getElementById('valor-total');

// Recupera os gastos do localStorage (ou inicia vazio)
let gastos = JSON.parse(localStorage.getItem('gastos')) || [];

// Lista de categorias fixas
const categorias = ['Alimentação', 'Transporte', 'Lazer', 'Outros'];
let valoresPorCategoria = [0, 0, 0, 0];

// 🎯 Gráfico com Chart.js
const ctx = document.getElementById('graficoGastos').getContext('2d');
const grafico = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: categorias,
    datasets: [{
      label: 'Gastos por categoria',
      data: valoresPorCategoria,
      backgroundColor: ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0'],
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

// Atualiza os dados do gráfico com base nos gastos
function atualizarGrafico(gastos) {
  valoresPorCategoria = [0, 0, 0, 0];

  gastos.forEach(gasto => {
    const index = categorias.indexOf(gasto.categoria);
    if (index !== -1) {
      valoresPorCategoria[index] += gasto.valor;
    }
  });

  grafico.data.datasets[0].data = valoresPorCategoria;
  grafico.update();
}

// Salva os gastos no localStorage
function salvarGastos() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
}

// Renderiza os itens na tela
function renderizarGastos() {
  listaGastos.innerHTML = '';

  gastos.forEach((gasto, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${gasto.descricao} - R$ ${gasto.valor.toFixed(2)} 
      (${gasto.categoria}) 
      <button onclick="removerGasto(${index})">X</button>
    `;
    listaGastos.appendChild(li);
  });
}

// Atualiza o total de gastos
function atualizarTotal() {
  const total = gastos.reduce((soma, gasto) => soma + gasto.valor, 0);
  valorTotal.textContent = total.toFixed(2);
}

// Remove um gasto
function removerGasto(index) {
  gastos.splice(index, 1);
  salvarGastos();
  renderizarGastos();
  atualizarTotal();
  atualizarGrafico(gastos);
}

// Evento de adicionar gasto
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const descricao = descricaoInput.value;
  const valor = parseFloat(valorInput.value);
  const categoria = categoriaInput.value;

  if (!descricao || isNaN(valor) || !categoria) return;

  const novoGasto = { descricao, valor, categoria };
  gastos.push(novoGasto);

  salvarGastos();
  renderizarGastos();
  atualizarTotal();
  atualizarGrafico(gastos);

  form.reset();
});

// Renderiza tudo ao carregar a página
renderizarGastos();
atualizarTotal();
atualizarGrafico(gastos);