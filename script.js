window.addEventListener('load', function() {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Сообщаем Telegram, что приложение готово
    tg.expand(); // Раскрываем приложение на весь экран

    const container = document.getElementById('article-container');

    // Загружаем нашу базу знаний
    fetch('knowledge_base.json')
        .then(response => response.json())
        .then(knowledge_base => {
            // Получаем индекс статьи из URL (например, .../index.html#5)
            const articleIndex = parseInt(window.location.hash.substring(1), 10);

            if (isNaN(articleIndex) || articleIndex < 0 || articleIndex >= knowledge_base.length) {
                container.innerHTML = '<h1>Ошибка: Статья не найдена</h1>';
                return;
            }

            const article = knowledge_base[articleIndex];
            displayArticle(article);
        })
        .catch(error => {
            console.error('Ошибка загрузки базы знаний:', error);
            container.innerHTML = '<h1>Не удалось загрузить данные</h1>';
        });

    function displayArticle(article) {
        // Очищаем контейнер от надписи "Загрузка..."
        container.innerHTML = '';

        // Создаем заголовок
        const titleElement = document.createElement('h1');
        titleElement.innerText = article.title;
        container.appendChild(titleElement);

        // Проходим по всем блокам и создаем соответствующие HTML-элементы
        article.body.forEach(block => {
            if (block.type === 'text') {
                const p = document.createElement('p');
                p.innerHTML = block.content.replace(/\n/g, '<br>'); // Сохраняем переносы строк
                container.appendChild(p);
            } else if (block.type === 'image') {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                img.src = block.url;
                const figcaption = document.createElement('figcaption');
                figcaption.innerText = block.caption;
                
                figure.appendChild(img);
                figure.appendChild(figcaption);
                container.appendChild(figure);
            }
        });
    }
});