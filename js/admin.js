async function compressAndUpload(file) {
    const options = {
        maxSizeMB: 0.8,          // Máximo 800KB
        maxWidthOrHeight: 1024, // Redimensiona si es muy grande
        useWebWorker: true
    };
    
    try {
        const compressedFile = await imageCompression(file, options);
        console.log(`Comprimido: de ${file.size/1024}KB a ${compressedFile.size/1024}KB`);
        return compressedFile; // Este es el que mandás a Supabase Storage
    } catch (error) {
        console.error("Error comprimiendo:", error);
    }
}

