// Save the array to localStorage
const saveArrayToLocalStorage = (arrayName, array) => {
    localStorage.setItem(arrayName, JSON.stringify(array));
}

//Retreive array from localStorage
const retreiveArrayFromLocalStorage = (ArrayName) => {
    const storedArray = localStorage.getItem(arrayName);
    return storedArray ? JSON.parse(storedArray) : [];
}
