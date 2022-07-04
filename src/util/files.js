// Helper file containing useful JS functions

export function getImageEncoding(file) {
    return new Promise((resolve,reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        
        reader.onload = () => {
            resolve(reader.result);
        }

        reader.onerror = reject;
        
    });
}

