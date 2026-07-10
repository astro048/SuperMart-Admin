import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getProduct, createProduct, updateProduct } from "../services/api";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import { toast } from "react-toastify";
import "../styles/form.css";

const ProductInformation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState({
    id: "",
    category: "Oils",
    brand: "",
    productType: "",
    modelName: "",
    ingredients: "",
    usedFor: "",
    unit: "1 Unit",
    packagingType: "",
    storageInstruction: "",
    weight: "",
    disclaimer: "",
    manufacturer: "",
    countryOfOrigin: "",
    shelfLife: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.product) {
      const passedProduct = location.state.product;
      setProduct({
        id: passedProduct.id || "",
        category: passedProduct.category || "Oils",
        brand: passedProduct.brand || "",
        productType: passedProduct.productType || "",
        modelName: passedProduct.modelName || "",
        ingredients: passedProduct.ingredients || "",
        usedFor: passedProduct.usedFor || "",
        unit: passedProduct.unit || "1 Unit",
        packagingType: passedProduct.packagingType || "",
        storageInstruction: passedProduct.storageInstruction || "",
        weight: passedProduct.weight || "",
        disclaimer: passedProduct.disclaimer || "",
        manufacturer: passedProduct.manufacturer || "",
        countryOfOrigin: passedProduct.countryOfOrigin || "",
        shelfLife: passedProduct.shelfLife || "",
      });
    } else if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const data = await getProduct(id);
          setProduct({
            id: data.id || "",
            category: data.category || "Oils",
            brand: data.brand || "",
            productType: data.productType || "",
            modelName: data.modelName || "",
            ingredients: data.ingredients || "",
            usedFor: data.usedFor || "",
            unit: data.unit || "1 Unit",
            packagingType: data.packagingType || "",
            storageInstruction: data.storageInstruction || "",
            weight: data.weight || "",
            disclaimer: data.disclaimer || "",
            manufacturer: data.manufacturer || "",
            countryOfOrigin: data.countryOfOrigin || "",
            shelfLife: data.shelfLife || "",
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
        toast.success("✅ Product updated successfully!");
      } else {
        await createProduct(payload);
        toast.success("✅ Product added successfully!");
      }

      setTimeout(() => {
        navigate("/products");
      }, 1200);
    } catch (err) {
      console.error(err);
      setError(err.message);

      toast.error(err.message || "❌ Failed to save product.");
    } finally {
      setLoading(false);
    }
  };
  const handleReset = () => {
    setProduct(emptyProduct);
    toast.info("🔄 Form reset successfully.");
  };

  const categories = [
    "Oils",
    "Grains",
    "Dairy",
    "Vegetables",
    "Meat",
    "Beverages",
    "Snacks",
  ];
  const units = ["1 Unit", "1 kg", "500 g", "250 g", "1 L", "500 ml", "100 ml"];
  const packagingTypes = [
    "Plastic Bottle / Pouch",
    "Glass Jar",
    "Paper Box",
    "Can",
    "Bag",
  ];

  return (
    <div className="form-page">
      <div className="page-header">
        <h1 className="page-title">
          {id ? "Edit Product — Information" : "Add Product — Information"}
        </h1>
        <p className="page-subtitle">
          Category-driven highlights, packaging and regulatory details.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">PRODUCT ID *</label>
                <div className="input-with-button">
                  <input
                    type="text"
                    name="id"
                    value={product.id}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Type ID and press Enter to load"
                    required
                  />
                  {id && (
                    <button type="button" className="btn btn-outline btn-sm">
                      Load product
                    </button>
                  )}
                </div>
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
            </div>

            <div className="form-section-header">
              <h3>PRODUCT HIGHLIGHTS</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">BRAND</label>
                <input
                  type="text"
                  name="brand"
                  value={product.brand}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Local Brand"
                />
              </div>
              <div className="form-group">
                <label className="form-label">PRODUCT TYPE</label>
                <input
                  type="text"
                  name="productType"
                  value={product.productType}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Refined Cooking Oil"
                />
              </div>
              <div className="form-group">
                <label className="form-label">MODEL NAME</label>
                <input
                  type="text"
                  name="modelName"
                  value={product.modelName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="-"
                />
              </div>
              <div className="form-group">
                <label className="form-label">INGREDIENTS</label>
                <input
                  type="text"
                  name="ingredients"
                  value={product.ingredients}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="100% Refined Sunflower Oil"
                />
              </div>
              <div className="form-group">
                <label className="form-label">USED FOR</label>
                <input
                  type="text"
                  name="usedFor"
                  value={product.usedFor}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Cooking, Frying, Sautéing"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">UNIT</label>
                <FormSelect
                  name="unit"
                  value={product.unit}
                  onChange={handleChange}
                  options={units.map((unit) => ({ value: unit, label: unit }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">PACKAGING TYPE</label>
                <FormSelect
                  name="packagingType"
                  value={product.packagingType}
                  onChange={handleChange}
                  options={packagingTypes.map((pkg) => ({
                    value: pkg,
                    label: pkg,
                  }))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">STORAGE INSTRUCTION</label>
                <input
                  type="text"
                  name="storageInstruction"
                  value={product.storageInstruction}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Store in a cool, dry place away from direct sunlight"
                />
              </div>
              <div className="form-group">
                <label className="form-label">WEIGHT</label>
                <input
                  type="text"
                  name="weight"
                  value={product.weight}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="1 L"
                />
              </div>
            </div>

            <div className="form-section-header">
              <h3>INFORMATION</h3>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label className="form-label">DISCLAIMER</label>
                <textarea
                  name="disclaimer"
                  value={product.disclaimer}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Image shown is for representation purposes only. Actual product packaging may vary."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  MANUFACTURER / MARKETER NAME
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={product.manufacturer}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Marketed by Local Foods Pvt. Ltd."
                />
              </div>
              <div className="form-group">
                <label className="form-label">COUNTRY OF ORIGIN</label>
                <input
                  type="text"
                  name="countryOfOrigin"
                  value={product.countryOfOrigin}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="India"
                />
              </div>
              <div className="form-group">
                <label className="form-label">SHELF LIFE</label>
                <input
                  type="text"
                  name="shelfLife"
                  value={product.shelfLife}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="12 Months from date of packaging"
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
            Reset to category defaults
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Save Product Information"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductInformation;
