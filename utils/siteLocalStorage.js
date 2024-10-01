export const siteLocalStorage = () => {

    return localStorage.getItem('site') ? localStorage.getItem('site') : localStorage.setItem('site', 'donggi')
}
    