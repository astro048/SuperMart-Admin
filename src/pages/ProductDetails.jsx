import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getProducts, createProduct, updateProduct } from "../services/api";
import { generateProductId } from "../utils/productId";
import FormSelect from "../components/FormSelect";
import "../styles/form.css";

const emptyProduct = {
  name: "",
  brand: "",
  category: "Oils",
  sellingPrice: "",
  originalPrice: "",
  stockQuantity: "",
  tagline: "",
  image: "",
  description: "",
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(emptyProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.product) {
      const p = location.state.product;
      setProduct({
        name: p.name || "",
        brand: p.brand || "",
        category: p.category || "Oils",
        sellingPrice: p.sellingPrice ?? p.price ?? "",
        originalPrice: p.originalPrice ?? "",
        stockQuantity: p.stockQuantity ?? "",
        tagline: p.tagline || "",
        image: p.image || "",
        description: p.description || "",
      });
    } else if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const data = await getProduct(id);
          setProduct({
            name: data.name || "",
            brand: data.brand || "",
            category: data.category || "Oils",
            sellingPrice: data.sellingPrice ?? data.price ?? "",
            originalPrice: data.originalPrice ?? "",
            stockQuantity: data.stockQuantity ?? "",
            tagline: data.tagline || "",
            image: data.image || "",
            description: data.description || "",
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setError(null)
  //   try {
  //     setLoading(true)
  //     const payload = {
  //       ...product,
  //       sellingPrice: Number(product.sellingPrice) || 0,
  //       originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
  //       stockQuantity: product.stockQuantity ? Number(product.stockQuantity) : 0
  //     }
  //     if (id) {
  //       await updateProduct(id, payload)
  //     } else {
  //       await createProduct(payload)
  //     }
  //     navigate('/products')
  //   } catch (err) {
  //     setError(err.message)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      const existingProducts = await getProducts();

      const productId = id
        ? location.state?.product?.productId
        : generateProductId(product.category, existingProducts);

      const payload = {
        ...product,
        productId,
        sellingPrice: Number(product.sellingPrice) || 0,
        originalPrice: product.originalPrice
          ? Number(product.originalPrice)
          : undefined,
        stockQuantity: product.stockQuantity
          ? Number(product.stockQuantity)
          : 0,
      };

      if (id) {
        await updateProduct(id, payload);

        toast.success("Product updated successfully!");
      } else {
        await createProduct(payload);

        toast.success("Product created successfully!");
      }

      navigate("/products");
    } catch (err) {
      console.error(err);

      setError(err.message);

      toast.error(err.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => setProduct(emptyProduct);

  const categories = [
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy",
    "Snacks",
    "Drinks",
    "Bakery",
    "Frozen Food",
    "Personal Care",
    "Cleaning ,Oils & Ghee",
  ];

  return (
    <div className="form-page">
      <div className="page-header">
        <h1 className="page-title">
          {id ? "Edit Product — Details" : "Add Product — Details"}
        </h1>
        <p className="page-subtitle">
          Enter the core details customers see on the product card.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">PRODUCT NAME *</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Premium Basmati Rice"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">BRAND</label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Fortune"
                />
              </div>
              <div className="form-group">
                <label className="form-label">CATEGORY *</label>
                <FormSelect
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  options={categories.map((cat) => ({
                    value: cat,
                    label: cat,
                  }))}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">SELLING PRICE (₹) *</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={product.sellingPrice}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="110"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ORIGINAL PRICE (₹)</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={product.originalPrice}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="150"
                />
              </div>
              <div className="form-group">
                <label className="form-label">STOCK QUANTITY</label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={product.stockQuantity}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="50"
                />
              </div>
              <div className="form-group">
                <label className="form-label">TAGLINE</label>
                <input
                  type="text"
                  name="tagline"
                  value={product.tagline}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Fresh from the farm"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label className="form-label">IMAGE URL *</label>
                <input
                  type="url"
                  name="image"
                  value={product.image}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="https://..."
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label className="form-label">DESCRIPTION *</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe the product..."
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Product Details"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductDetails;
