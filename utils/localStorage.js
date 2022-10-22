
// Saves a image to localStorage
const saveImageToLocalStorage = (imgObject) => {
    localStorage.setItem('savedImage', JSON.stringify(imgObject));
};

// Loads a image from localStorage
const loadSavedImageFromLocalStorage = () => {
    const savedImage = localStorage.getItem('savedImage');
    if (savedImage) {
        return JSON.parse(savedImage);
    }
    return null;
};

export {loadSavedImageFromLocalStorage, saveImageToLocalStorage};