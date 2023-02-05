import request from 'supertest'

import app from '../config/app'

describe('Body Parser Middleware', () => {
  it('Should parse body as JSON', async () => {
    app.post('/body_parse', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/body_parse')
      .send({ name: 'test' })
      .expect({ name: 'test' })
  })
})
