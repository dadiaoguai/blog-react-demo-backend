const
  express = require('express'),
  config = require('config'),
  path = require('path')

const app = express()

app.use(express.static('dist'))

app.get('*', (req, res) => {
  res.sendFile(path.join(require('process').cwd(), 'index.html'))
})

app.listen(config.serverPort, () => console.log(`listening on port ${config.serverPort}!`))

