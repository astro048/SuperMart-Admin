import { Link } from 'react-router-dom'
import '../styles/Products.css'

const ProductCard = ({ product, onDelete }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
          alt={product.name}
        />
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">₹{product.price}</span>
          <span className="product-id">#{product.id}</span>
        </div>
      </div>
      <div className="product-actions">
        <Link to={`/products/details/${product.id}`} className="btn btn-outline btn-sm">
          Edit Details
        </Link>
        <Link to={`/products/information/${product.id}`} className="btn btn-outline btn-sm">
          Edit Info
        </Link>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(product.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default ProductCard
