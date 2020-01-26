export default function gallery(entries, itemClassName, lightbox) {
    
    lightbox.init();
    
    for (const entry of entries) {
        
        entry.addEventListener('click', (event) => {
            
            const item = event.composedPath().find(e => {
                return e.className === itemClassName;
            });
            
            if (item)
                lightbox.open(item);
        });
    }
}
