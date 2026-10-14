export async function json(req, res){
    const buffers = []

    //Coleta os pedaços de (chunks) de dados que chegam na requisição HTTP
    for await(const chunk of req){
        buffers.push(chunk)
    }

    try{
        //Concatena os chunks e converte de JSON para objeto JavaScript
        req.body = JSON.parse(Buffer.concat(buffers).toString())
    } catch{
        req.body = null
    }

    //Define o cabeçalho informado que a resposta da API será sempre em JSON
    res.setHeader('Content-Type', 'application/json')
}