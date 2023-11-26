import ProductsManager from '../dao/product.manager.js';
import CartsManager from '../dao/cart.manager.js';
import express from 'express';
import { buildResponsePaginated } from '../utils.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { limit = 10, page = 1, sort, category } = req.query;
  // sort es por precio, posibles valores asc/desc
  // search es por category
  const criteria = {};
  const options = { limit, page }
  if (sort) {
    options.sort = { price: sort };
  }
  if (category) {
    criteria.category = category;
  }
  try {
    const products = await ProductsManager.getProducts(criteria, options);
    const data = buildResponsePaginated({ ...products, sort, category }, 'http://localhost:8080/views');
    res.render('home', { title: 'Productos 🚀', products: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error obtaining products.' });
  }
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { title: 'Real Time Products 😎' });
});

router.get('/chat', (req, res) => {
  res.render('chat', { title: 'Chat de nuestro ecommerce 😎' });
});

// Ruta para visualizar un carrito específico
router.get('/carts/:cid', async (req, res) => {
  const cartId = req.params.cid;

  try {
      const cart = await CartsManager.getCartById(cartId);
      if (cart === -1) {
          res.status(404).json({ error: 'There is no cart with that ID.' });
      } else {
          // Renderiza la vista de carrito con los productos
          res.render('cart', { title: 'Carrito de Compras', cart });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error obtaining cart.' });
  }
});

export default router;

// import ProductManager from '../product-manager.js';
// import express from 'express';
// const router = express.Router();
// const productManager = new ProductManager('./products.json');



// router.get('/', (req, res) => {
//     const { query } = req;
//     const { limit } = query;
//     productManager.getProducts()
//         .then(products => {
//             if (!limit) {
//                 // No hay límite, pasa todos los productos
//                 res.render('home', { title: 'Productos 🚀', products });
//             } else {
//                 // Aplicar el límite y pasar los productos filtrados
//                 const result = products.slice(0, parseInt(limit));
//                 res.render('home', { title: 'Productos 🚀', products: result });
//             }
//         })
//         .catch(error => {
//             console.error(error);
//         });
// });

// router.get('/realtimeproducts', (req, res) => {
//     res.render('realTimeProducts', { title: 'Real Time Products 😎' });
//   });

// export default router;