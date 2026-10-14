export function extractQueryParams(query) {
    if (!query) return {}

    //Converte a string de query "?search=Task&title=01" em um objeto JS
    return query.substr(1).split('&').reduce((queryParams, param) => {
        const [key, value] = param.split('=')
        queryParams[key] = decodeURIComponent(value)
        return queryParams
    }, {})
}