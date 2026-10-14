import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('./tasks.csv', import.meta.url)

async function importCsv() {
  // Cria a stream de leitura do arquivo CSV
  const stream = fs.createReadStream(csvPath)

  // Configura a leitura ignorando o cabeçalho (from_line: 2)
  const csvParse = parse({
    delimiter: ',',
    skip_empty_lines: true,
    from_line: 2
  })

  const linesParse = stream.pipe(csvParse)

  // Percorre linha a linha utilizando for await (async iterator)
  for await (const line of linesParse) {
    const [title, description] = line

    // Realiza uma requisição POST na API local para cadastrar a tarefa
    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    })
  }

  console.log('Importação do arquivo CSV concluída com sucesso!')
}

// Executa a função
importCsv()