import { useState } from "react";
import { useData } from "../context/DataContext";
import { deleteProduct } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Products.css";
import "../styles/index.css";

// Edit Modal Component
const EditModal = ({ product, onClose, onEditDetails, onEditInfo }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>
          Edit Product
        </h3>
        <p style={{ marginBottom: "20px", color: "var(--text-secondary)" }}>
          Choose what you want to edit:
        </p>
        <div
          style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
        >
          <button
            className="btn-1"
            onClick={() => onEditDetails(product)}
            style={{ padding: "10px 20px" }}
          >
            Product Details
          </button>
          <button
            className="btn-1"
            onClick={() => onEditInfo(product)}
            style={{ padding: "10px 20px" }}
          >
            Product Information
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const { products, loading, refetch } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleDeleteProduct = async (productId, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        refetch();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleEditClick = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleEditDetails = (product) => {
    setShowEditModal(false);
    navigate(`/products/details/${product._id}`, { state: { product } });
  };

  const handleEditInfo = (product) => {
    setShowEditModal(false);
    navigate(`/products/information/${product._id}`, { state: { product } });
  };

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div className="card">Loading...</div>;

  return (
    <div className="products-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-subtitle">
            {products.length} products currently listed in your catalog.
          </p>
        </div>
        <div className="page-actions">
          <Link to="/products/details" className="btn btn-primary">
            + Add Details
          </Link>
          <Link to="/products/information" className="btn btn-outline">
            + Add Information
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
            />
          </div>
          <div className="filter-box">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-grid">
          {/* {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                <img 
                  src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                  alt={product.name}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">₹{product.sellingPrice || product.price}</span>
                  <span className="product-id">{product.id}</span>
                </div>
              </div>
              <div className="product-actions">
                <button 
                  className="icon-btn edit-btn"
                  onClick={(e) => handleEditClick(product, e)}
                  title="Edit"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button 
                  className="icon-btn delete-btn"
                  onClick={(e) => handleDeleteProduct(product.id, e)}
                  title="Delete"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))} */}
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img
                  src={
                    product.image ||
                    "https://via.placeholder.com/200x200?text=No+Image"
                  }
                  alt={product.name}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">
                    ₹{product.sellingPrice ?? product.price}
                  </span>
                  <span className="product-id"> #{product.productId}</span>
                </div>
              </div>
              <div className="product-actions">
                <button
                  className="icon-btn edit-btn"
                  onClick={(e) => handleEditClick(product, e)}
                  title="Edit"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={(e) => handleDeleteProduct(product._id, e)}
                  title="Delete"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedProduct && (
        <EditModal
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onEditDetails={handleEditDetails}
          onEditInfo={handleEditInfo}
        />
      )}
    </div>
  );
};

export default Products;
