// Motor de E-commerce Avançado - AX SPORTS
let carrinho = JSON.parse(localStorage.getItem('ax_carrinho')) || [];

// Atualiza a interface ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    atualizarCarrinhoUI();
});

function mudarTema(corPrincipal, corSecundaria) {
    document.documentElement.style.setProperty('--cor-primaria', corPrincipal);
    document.documentElement.style.setProperty('--cor-secundaria', corSecundaria);
}

function selecionarTamanho(botaoClicado) {
    const container = botaoClicado.parentElement;
    const botoes = container.getElementsByClassName('btn-tamanho');
    for (let b of botoes) {
        b.classList.remove('ativo');
    }
    botaoClicado.classList.add('ativo');
}

function toggleMenu() {
    const menu = document.getElementById('dropdownMenu');
    menu.classList.toggle('show');
}

function toggleCart() {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    drawer.classList.toggle('open');
    overlay.classList.toggle('open');
}

function adicionarAoCarrinho(botao) {
    const card = botao.closest('.card-produto');
    const id = card.getAttribute('data-id');
    const nome = card.getAttribute('data-nome');
    const preco = parseFloat(card.getAttribute('data-preco'));
    const imagem = card.getAttribute('data-img');
    
    // Pega o tamanho selecionado
    const botaoTamanhoAtivo = card.querySelector('.btn-tamanho.ativo');
    const tamanho = botaoTamanhoAtivo ? botaoTamanhoAtivo.innerText : 'M';

    // Verifica se o mesmo produto com o mesmo tamanho já está no carrinho
    const itemExistente = carrinho.find(item => item.id === id && item.tamanho === tamanho);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
            id: id,
            nome: nome,
            preco: preco,
            imagem: imagem,
            tamanho: tamanho,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarCarrinhoUI();
    toggleCart(); // Abre a gaveta do carrinho automaticamente
}

function alterarQuantidade(id, tamanho, delta) {
    const item = carrinho.find(i => i.id === id && i.tamanho === tamanho);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(i => !(i.id === id && i.tamanho === tamanho));
        }
    }
    salvarCarrinho();
    atualizarCarrinhoUI();
}

function salvarCarrinho() {
    localStorage.setItem('ax_carrinho', JSON.stringify(carrinho));
}

function atualizarCarrinhoUI() {
    const container = document.getElementById('cartItemsContainer');
    const countBadge = document.getElementById('cartCount');
    const totalPriceEl = document.getElementById('cartTotalPrice');

    if (!container || !countBadge || !totalPriceEl) return;

    // Total de itens na badge
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    countBadge.innerText = totalItens;

    if (carrinho.length === 0) {
        container.innerHTML = `<p class="cart-empty">Sua sacola está vazia.</p>`;
        totalPriceEl.innerText = 'R$ 0,00';
        return;
    }

    let html = '';
    let totalPreco = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalPreco += subtotal;

        html += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}">
                <div class="cart-item-details">
                    <h4>${item.nome}</h4>
                    <p class="cart-item-size">Tam: <strong>${item.tamanho}</strong></p>
                    <p class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <div class="cart-item-qty">
                        <button onclick="alterarQuantidade('${item.id}', '${item.tamanho}', -1)">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="alterarQuantidade('${item.id}', '${item.tamanho}', 1)">+</button>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    totalPriceEl.innerText = `R$ ${totalPreco.toFixed(2).replace('.', ',')}`;
}

function finalizarCompraWhatsApp() {
    if (carrinho.length === 0) {
        alert('Sua sacola está vazia!');
        return;
    }

    let mensagem = "🛒 *NOVO PEDIDO - AX SPORTS*\n\n";
    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.quantidade;
        total += subtotal;
        mensagem += `${index + 1}. *${item.nome}*\n   Tamanho: ${item.tamanho} | Qtd: ${item.quantidade} | Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}\n\n`;
    });

    mensagem += `💰 *Valor Total do Pedido:* R$ ${total.toFixed(2).replace('.', ',')}\n\nPor favor, gostaria de prosseguir com o pagamento e entrega!`;

    // Substitua pelos seus números de WhatsApp com DDI e DDD (ex: 5531999999999)
    const numeroWhatsApp = "5500000000000"; 
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
}

// Fecha menus ao clicar fora
window.onclick = function(event) {
    if (!event.target.matches('.menu-toggle-btn') && !event.target.matches('.menu-toggle-btn *')) {
        const menu = document.getElementById('dropdownMenu');
        if (menu && menu.classList.contains('show')) {
            menu.classList.remove('show');
        }
    }
};
