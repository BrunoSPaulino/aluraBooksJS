let livros = [];
const endpointDaAPI = 'https://guilhermeonrails.github.io/casadocodigo/livros.json';

// FUNÇÃO PARA BUSCAR OS LIVROS DA API.

getBuscarLivrosDaAPI();
async function getBuscarLivrosDaAPI() {
    const res = await fetch(endpointDaAPI);
    livros = await res.json();
    livros = livros.map(livro => {
        return {
          ...livro,
            disponivel: livro.quantidade > 0
        }
    });
    let livrosComDesconto = aplicarDesconto(livros);
    exibirOsLivrosNaTela(livrosComDesconto);
};

// FUNÇÃO PARA EXIBIR OS LIVROS NA TELA.

const elementoParaInserirLivros = document.getElementById('livros');
const elementoComValorTotalDeLivrosDisponiveis = document.getElementById('valor_total_livros_disponiveis');
function exibirOsLivrosNaTela(listaDeLivros) {
    elementoComValorTotalDeLivrosDisponiveis.innerHTML = '';
    elementoParaInserirLivros.innerHTML = '';
    listaDeLivros.forEach(livro => {
        let disponibilidade = livro.quantidade > 0 ? 'livro__imagens' : 'livro__imagens indisponivel';
        elementoParaInserirLivros.innerHTML += `
            <div class="livro">
                <img class="${disponibilidade}" src="${livro.imagem}" alt="${livro.alt}" />
                <h2 class="livro__titulo">
                    ${livro.titulo}
                </h2>
                <p class="livro__descricao">${livro.autor}</p>
                <p class="livro__preco" id="preco">R$${livro.preco.toFixed(2)}</p>
                <div class="tags">
                    <span class="tag-categoria">${livro.categoria}</span>
                    ${livro.disponivel? '<span class="tag-disponivel">disponível</span>' : '<span class="tag-indisponivel">indisponível</span>'}
                </div>
            </div>
        `;
    });
};

// FUNÇÃO PARA APLICAR DESCONTO.

function aplicarDesconto(livros) {
    const desconto = 0;
    livrosComDesconto = livros.map(livro => {
        return {
           ...livro,
            preco: livro.preco - (livro.preco * desconto)};
    });
    return livrosComDesconto;
};

// FUNÇÃO PARA FILTRAR OS LIVROS POR CATEGORIA.

const botoes = document.querySelectorAll('.btn');
botoes.forEach(btn => btn.addEventListener('click', filtrarLivros));
function filtrarLivros() {
    const elementoBtn = document.getElementById(this.id);
    const categoria = elementoBtn.value;
    let livrosFiltrados = categoria == 'disponivel' ? filtrarPorDisponibilidade() : filtrarPorCategoria(categoria);
    exibirOsLivrosNaTela(livrosFiltrados);
    if (categoria == 'disponivel') {
        const valorTotal = calcularValorTotalDeLivrosDisponiveis(livrosFiltrados);
        exibirValorTotalDosLivrosDisponiveisNaTela(valorTotal);
    }
};

function calcularValorTotalDeLivrosDisponiveis(livrosFiltrados) {
    return livrosFiltrados.reduce((acc, livro) => acc + livro.preco, 0).toFixed(2);
}

function filtrarPorCategoria(categoria) {
    return livros.filter(livro => livro.categoria == categoria);
}

function filtrarPorDisponibilidade() {
    return livros.filter(livro => livro.quantidade > 0);
}

function exibirValorTotalDosLivrosDisponiveisNaTela(valorTotal) {
    elementoComValorTotalDeLivrosDisponiveis.innerHTML = `
    <div class="livros__disponiveis">
      <p>Todos os livros disponíveis por R$ <span id="valor">${valorTotal}</span></p>
    </div>
    `;
};

// FUNÇÃO PARA MOSTRAR TODOS OS LIVROS DISPONÍVEIS DA GALERIA.

const btnTodos = document.getElementById('btnLivrosDisponiveis');
btnTodos.addEventListener('click', mostrarTodosDisponiveis);
function mostrarTodosDisponiveis() {
    const livrosDisponiveis = filtrarPorDisponibilidade();
    exibirOsLivrosNaTela(livrosDisponiveis);
    const valorTotal = calcularValorTotalDeLivrosDisponiveis(livrosDisponiveis);
    exibirValorTotalDosLivrosDisponiveisNaTela(valorTotal);
};

// FUNÇÃO PARA ORDENAR OS LIVROS POR PREÇO.

let ordemCrescente = true;
const btnOrdenar = document.getElementById('btnOrdenarPorPreco');
btnOrdenar.addEventListener('click', ordenarPorPreco);
function ordenarPorPreco() {
    if (ordemCrescente) {
        let livrosOrdenados = livros.sort((a, b) => a.preco - b.preco);
        exibirOsLivrosNaTela(livrosOrdenados);
    } else {
        let livrosOrdenados = livros.sort((a, b) => b.preco - a.preco);
        exibirOsLivrosNaTela(livrosOrdenados);
    }
    ordemCrescente =!ordemCrescente;
};

// FUNÇÃO PARA FILTRAR OS LIVROS POR ORDEM ALFABÉTICA.

let ordemAlfabeticaCrescente = true;
const btnOrdenarAlfabetica = document.getElementById('btnOrdenarPorAlfabetica');
btnOrdenarAlfabetica.addEventListener('click', ordenarAlfabetica);
function ordenarAlfabetica() {
    if (ordemAlfabeticaCrescente) {
        let livrosOrdenados = livros.sort((a, b) => a.titulo.localeCompare(b.titulo));
        exibirOsLivrosNaTela(livrosOrdenados);
    } else {
        let livrosOrdenados = livros.sort((a, b) => b.titulo.localeCompare(a.titulo));
        exibirOsLivrosNaTela(livrosOrdenados);
    }
    ordemAlfabeticaCrescente =!ordemAlfabeticaCrescente;
};

// FUNÇÃO PARA BUSCAR OS LIVROS POR AUTOR.

let buscarLivros = true;
const inputBusca = document.getElementById('btnOrdenarPorAutor');
inputBusca.addEventListener('click', buscarLivrosPorAutor);
function buscarLivrosPorAutor() {
    if (buscarLivros) {
        let livrosOrdenados = livros.sort((a, b) => a.autor.localeCompare(b.autor));
        exibirOsLivrosNaTela(livrosOrdenados);
    } else {
        let livrosOrdenados = livros.sort((a, b) => b.autor.localeCompare(a.autor));
        exibirOsLivrosNaTela(livrosOrdenados);
    }
    buscarLivros =!buscarLivros;
};

// FUNÇÃO PARA BUSCAR OS LIVROS POR TÍTULO.

let buscarTitulo = true;
const inputBuscaTitulo = document.getElementById('btnOrdenarPorTitulo');
inputBuscaTitulo.addEventListener('click', buscarLivrosPorTitulo);
function buscarLivrosPorTitulo() {
    if (buscarTitulo) {
        let livrosOrdenados = livros.sort((a, b) => a.titulo.localeCompare(b.titulo));
        exibirOsLivrosNaTela(livrosOrdenados);
    } else {
        let livrosOrdenados = livros.sort((a, b) => b.titulo.localeCompare(a.titulo));
        exibirOsLivrosNaTela(livrosOrdenados);
    }
    buscarTitulo =!buscarTitulo;
};