import Router from './components/router.js';
import nav from './components/nav.js';
import colorSchemeController from './components/color-scheme-controller.js';

(async () => {
    const partials = new Map([
        [document.querySelector('nav'), './partials/nav.html'],
        [document.querySelector('footer'), './partials/footer.html']
    ]);
    
    for (const [element, path] of partials) {
        const response = await window.fetch(path);
        element.innerHTML = await response.text();
    }
    
    nav(
        document.querySelector('nav'),
        document.querySelector('#nav__toggle'),
        document.querySelector('.nav__current'),
        'nav--content-visible',
        'nav__content--visible',
        800,
        {
            container: document.querySelector('.nav__content'),
            links: document.querySelector('.nav__content__links'),
            sections: {
                container: document.querySelector('.nav__content__sections'),
                titleSelector: 'nav__content__sections__title',
                linkSelector: 'nav__content__sections__link'
            }
        },
        new Router({
            container: document.querySelector('main'),
            views: [{
                name: 'me',
                template: './views/me.html'
            }, {
                name: 'art',
                template: './views/art.html',
                sections: new Map([
                    ['drawings', 'drawings'],
                    ['designs', '99designs'],
                    ['more', 'more'],
                    ['codepens', 'codepens'],
                    ['music', 'music']
                ]),
                module: '../modules/art.js'
            }, {
                name: 'contact',
                template: './views/contact.html'
            }],
            defaultState: { view: 'me', title: 'Me' }
        }, this)
    );
    
    colorSchemeController(document.querySelector('#color-scheme-selector'));
    
    /* :: Service Worker... */
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./service-worker.js');
        } catch (error) {
            console.log('Service Worker registration failed: ', error);
        }
    }
})();
