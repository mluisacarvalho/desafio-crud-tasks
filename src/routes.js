import {randomUUID} from 'node:crypto'
import {Database} from './database.js'
import {buildRoutePath} from './utils/build-route-path.js'

const database = new Database()

export const routes = [
    //1. Criar Tarefa (POST /tasks)
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {title, description} = req.body ?? {}

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify({message: 'Title and description are required'}))
            }

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            database.insert('tasks', task)

            return res.writeHead(201).end(JSON.stringify(task))
        }
    },
    //2. Listar e Buscar Tarefas (GET /tasks)
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {search} = req.query 

            const tasks = database.select('tasks', search ? {title: search, description: search} : null)

            return res.writeHead(200).end(JSON.stringify(tasks))
        }
    },
    //3. Atualizar Tarefa (PUT /tasks/:id)
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params
            const {title, description} = req.body ?? {}

            if (!title || !description) {
                return res.writeHead(400).end(JSON.stringify({message: 'Informe title ou description to update'}))
            }

            const task = database.findById('tasks', id)

            if (!task) {
                return res.writeHead(404).end(JSON.stringify({message: 'Task not found'}))
            }

            database.update('tasks', id, {
                title: title ?? task.title,
                description: description ?? task.description,
                updated_at: new Date().toISOString()
            })

            return res.writeHead(204).end()
        }
    },
    //4. Deletar Tarefa (DELETE /tasks/:id)
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const {id} = req.params

            const task = database.findById('tasks', id)

            if (!task) {
                return res.writeHead(404).end(JSON.stringify({message: 'Task not found'}))
            }

            database.delete('tasks', id)

            return res.writeHead(204).end()
        }
    },
    //5. Marcar Tarefa como Concluída (PATCH /tasks/:id/complete)
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const {id} = req.params

            const task = database.findById('tasks', id)

            if (!task) {
                return res.writeHead(404).end(JSON.stringify({message: 'Task not found'}))
            }

            const iscompleted = !!task.completed_at
            const completed_at = iscompleted ? null : new Date().toISOString()

            database.update('tasks', id, {
                completed_at,
                updated_at: new Date().toISOString()
            })

            return res.writeHead(204).end()
        }
    }
]
