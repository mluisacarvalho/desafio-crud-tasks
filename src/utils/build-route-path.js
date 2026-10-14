export function buildRoutePath(path) {

    //Captura os parâmetros dinâmicos da rota (ex.: :id) e cria uma expressão regular para capturá-los
    const routeParametersRegex = /:([a-zA-Z]+)/g
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9-_]+)')

    //Permite aceitar query parameters ao final da URL (?search=...)
    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)

    return pathRegex
}