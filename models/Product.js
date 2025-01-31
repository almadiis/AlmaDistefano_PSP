const mongoose = require('mongoose');


const productSchema = mongoose.Schema(
    {
      name: { type: String, required: true }, // El nombre del producto es obligatorio y es de tipo texto
      price: { type: Number, required: true }, // El precio es obligatorio y es de tipo numérico
      description: { type: String }, // La descripción no es obligatoria, pero si se proporciona, es de tipo texto
      stock: { type: Number, default: 0 }, // El inventario es numérico, y si no se especifica, será 0 por defecto
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }, // Esto crea una relación con la colección 'User', indicando qué usuario creó este producto
    },
    { timestamps: true }
  );


module.exports = mongoose.model('Product', productSchema);

const Product = require('../models/Product');


// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    console.log(`Usuario autenticado: ${req.user.email}`); // Información del usuario autenticado
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Crear un producto
exports.createProduct = async (req, res) => {
  try {
    // Asocia el producto al usuario autenticado
    const product = new Product({ ...req.body, createdBy: req.user.id });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Actualizar un producto
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );


    // Verifica si el usuario autenticado es el propietario del producto
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }


    if (updatedProduct.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar este producto' });
    }


    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);


    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }


    // Verifica si el usuario autenticado es el propietario del producto
    if (product.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este producto' });
    }


    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
