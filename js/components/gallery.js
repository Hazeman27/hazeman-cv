export default function gallery(entries, itemSelector, lightbox) {
    
    lightbox.init();
    
    for (const entry of entries) {
        entry.addEventListener('click', (event) => {
            lightbox.open(event.target.closest(itemSelector));
        });
    }
}