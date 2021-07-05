export const setItemInStorage = (key, item) => localStorage.setItem(key, JSON.stringify(item))
export const getItemFromStorage = (key) => localStorage.getItem(key)