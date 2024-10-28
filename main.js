// Selecione os botões e os itens de cada categoria
const categoryButtons = document.querySelectorAll('.category-button');
const technologyItems = document.querySelectorAll('.technology');
const toolItems = document.querySelectorAll('.tool');

// Adicione um evento de clique para cada botão
categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Atualizar estilo do botão ativo
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Verifique a categoria selecionada
        const category = button.getAttribute('data-category');

        // Mostrar/esconder itens com base na categoria
        if (category === 'technologies') {
            technologyItems.forEach(item => item.style.display = 'block');
            toolItems.forEach(item => item.style.display = 'none');
        } else if (category === 'tools') {
            technologyItems.forEach(item => item.style.display = 'none');
            toolItems.forEach(item => item.style.display = 'block');
        }
    });
});
