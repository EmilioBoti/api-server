const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

server.post('/payment', (req, res) => {
  const db = router.db
  const products = db.get('products')
  const items = req.body || []

  try {
    items.forEach(item => {
      const product = products.find({ id: item.productId }).value()
        if (product) {
          const newStock = Math.max(product.stock - item.quantity, 0)
          products.find({ id: item.productId }).assign({ stock: newStock }).write()
        }
      }
    )
    res.status(200).jsonp({ status: 'success', message: 'Payment processed successfully' })
  } catch(e) {
    console.log(e)
    res.status(500).jsonp({ status: 'failed', message: 'Internal error' })
  }

})

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000')
})
