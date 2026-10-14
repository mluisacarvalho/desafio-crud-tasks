import http from 'node:http'
import {json} from './middlewares/json.js'
import {routes} from './routes.js'
import {extractQueryParams} from './utils/extract-query-params.js'

const server = http.createServer(async (req, res) => {
    const {method, url} = req

    //Processa o corpo da requisição
    await json(req, res)

    //Encontra a rota que corresponde ao método e à URL da requisição
    const route = routes.find(r => {
        return r.method === method && r.path.test(url)
    })

    if (route) {
        //Extrai os parâmetros da rota (ex.: :id) e os adiciona ao objeto req.params
        const routeParams = req.url.match(route.path)

        const {query, ...params} = routeParams.groups

        req.params = params
        req.query = query ? extractQueryParams(query) : {}

        //Chama o manipulador da rota
        return route.handler(req, res)
    }

    return res.writeHead(404).end(JSON.stringify({message: 'Route not found'}))
})

server.listen(3333, () => {
    console.log('Server executando na porta HTTP http://localhost:3333')
})