import { MongoHelper } from '../infra/db/mongodb/helpers/mongo-helpers'
import env from './config/env'
import app from './config/app'

MongoHelper.connect(env.mongoUrl).then(async () => {
  app.listen(env.port, () => {
    console.log(`Server running\n\thttp://localhost:${env.port}`)
  })
}).catch(console.error)
