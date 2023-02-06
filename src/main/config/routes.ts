import fs from 'fs'
import { Express, Router } from 'express'
import path from 'path'

const routesFilesPath = path.join(__dirname, '..', 'routes')

const getAllRoutesFiles = (): fs.Dirent[] => {
  const allFiles = fs.readdirSync(
    routesFilesPath,
    {
      encoding: 'utf-8',
      withFileTypes: true
    })
  return allFiles.filter(({ name }) => Boolean(name.match(/\.routes\.ts/)))
}

const importFile = async (router: Router, file: fs.Dirent): Promise<void> => {
  const appendRoute = (await import(`${routesFilesPath}/${file.name}`)).default
  appendRoute(router)
}

export default (app: Express): void => {
  const router = Router()
  app.use(router)
  const routesFiles = getAllRoutesFiles()
  for (const file of routesFiles) {
    void importFile(router, file)
  }
}
