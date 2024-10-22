const fs = require('fs').promises;

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
    } catch {
      this.products = [];
    }
  }

  async addProduct(product) {
    if (!product.title || !product.descripcion || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log('Todos los campos deben estar completos');
      return;
    }

    if (this.products.some(existingProduct => existingProduct.code === product.code)) {
      console.log('Ya existe un producto con el mismo código.');
      return;
    }

    product.id = this.getNextId();
    this.products.push(product);
    await this.saveProductsToFile();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(existingProduct => existingProduct.id === id);
    if (product) {
      return product;
    } else {
      console.log('El producto con el ID especificado no existe');
      return null;
    }
  }

  async updateProduct(id, updatedProduct) {
    const index = this.products.findIndex(existingProduct => existingProduct.id === id);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      await this.saveProductsToFile();
    } else {
      console.log('El producto con el ID especificado no existe');
    }
  }

  async deleteProduct(id) {
    const index = this.products.findIndex(existingProduct => existingProduct.id === id);
    if (index !== -1) {
      this.products.splice(index, 1);
      await this.saveProductsToFile();
    } else {
      console.log('El producto con el ID especificado no existe');
    }
  }

  getNextId() {
    const maxId = this.products.reduce((max, product) => (product.id > max ? product.id : max), 0);
    return maxId + 1;
  }

  async saveProductsToFile() {
    const productsJSON = JSON.stringify(this.products, null, 2);
    try {
      await fs.writeFile(this.path, productsJSON);
    } catch (error) {
      console.log('Error al guardar los productos en el archivo:', error);
    }
  }
}

(async () => {
  const productManager = new ProductManager('productos.json');
  await productManager.init();

  await productManager.addProduct({
    title: 'Producto 1',
    descripcion: 'Descripción del Producto 1',
    price: 19.99,
    thumbnail: 'thumbnail1.jpg',
    code: 'P001',
    stock: 100,
  });

  await productManager.addProduct({
    title: 'Producto 2',
    descripcion: 'Descripción del Producto 2',
    price: 29.99,
    thumbnail: 'thumbnail2.jpg',
    code: 'P002',
    stock: 50,
  });

  console.log('Lista de Productos:');
  console.log(productManager.getProducts());

  const product = productManager.getProductById(2);
  if (product) {
    console.log('Producto encontrado por ID:');
    console.log(product);
  }

  // await productManager.updateProduct(2, { price: 39.99, stock: 60 });

  // console.log('Lista de Productos actualizada:');
  // console.log(productManager.getProducts());

  // await productManager.deleteProduct(1);

  // console.log('Lista de Productos después de eliminar el producto con ID 1:');
  // console.log(productManager.getProducts());
})();