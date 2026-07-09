import { useState, useEffect, useRef } from "react";
import { useData } from "../context/DataContext";
import { createBill, updateBill, getBill } from "../services/api";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import * as XLSX from "xlsx-js-style";
import "../styles/bills.css";
import "../styles/index.css";

const GenerateBill = () => {
  const { users, products, orders, loading } = useData();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // State for bill data
  const [bill, setBill] = useState({
    id: "",
    billNumber: `BILL-${Math.floor(Math.random() * 10000)}`,
    date: new Date().toISOString().split("T")[0],
    time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    shopName: "Super Mart",
    shopAddress: "1,Rajiv Nagar, uthukuli Road ,Mannarai,Tirupur",
    shopPhone: "Tel: 123-456-7890",
    shopVat: "VAT REG.NO 0123456789",
    tableNumber: "543",
    cashier: "SUPERVISOR",
    customerName: "",
    customerPhone: "",
    items: [],
    subtotal: 0,
    vatPercentage: 4,
    vatAmount: 0,
    total: 0,
    cash: 0,
    change: 0,
    notes: "",
  });

  const [selectedUser, setSelectedUser] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    id: "",
    name: "",
    quantity: 1,
    price: 0,
    vat: 18,
  });
  const [sectionView, setSectionView] = useState("shop");
  const billRef = useRef(null);

  // Load existing bill if editing
  useEffect(() => {
    if (id) {
      const fetchBill = async () => {
        try {
          const data = await getBill(id);
          setBill({
            id: data.id || "",
            billNumber:
              data.billNumber || `BILL-${Math.floor(Math.random() * 10000)}`,
            date: data.date || new Date().toISOString().split("T")[0],
            time:
              data.time ||
              new Date().toLocaleTimeString("en-GB", { hour12: false }),
            shopName: data.shopName || "Lorem's Restaurant",
            shopAddress: data.shopAddress || "12, MILKWAY Galaxy/ Earth",
            shopPhone: data.shopPhone || "Tel: 123-456-7890",
            shopVat: data.shopVat || "VAT REG.NO 0123456789",
            tableNumber: data.tableNumber || "543",
            cashier: data.cashier || "SUPERVISOR",
            customerName: data.customerName || "",
            customerPhone: data.customerPhone || "",
            items: data.items || [],
            subtotal: data.subtotal || 0,
            vatPercentage: data.vatPercentage || 18,
            vatAmount: data.vatAmount || 0,
            total: data.total || 0,
            cash: data.cash || 0,
            change: data.change || 0,
            notes: data.notes || "",
          });
          setEditMode(true);
        } catch (error) {
          console.error("Failed to fetch bill:", error);
        }
      };
      fetchBill();
    } else if (location.state?.bill) {
      setBill(location.state.bill);
      setEditMode(true);
    }
  }, [id, location.state]);

  // Load user data with detailed console logs
useEffect(() => {
  if (selectedUser) {
    // Find user by BOTH userId and id fields
    const user = users.find(u =>
      String(u.userId) === String(selectedUser) ||
      String(u.id) === String(selectedUser)
    );

    if (user) {
      // 🔥 CONSOLE LOG: Fetched User Data
      console.log('👤 Fetched User Data:', {
        userId: user.userId || user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        joined: user.joined || user.createdAt
      });

      // Get orders matching this user's ID
      const userOrders = (orders || []).filter(order =>
        String(order.userId) === String(user.userId || user.id)
      );

      // 🔥 CONSOLE LOG: All Orders for this User
      console.log('📦 All Orders for this User:', userOrders);

      let loadedItems = [];

      if (userOrders.length > 0) {
        // Get most recent order
        const latestOrder = [...userOrders].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )[0];

        // 🔥 CONSOLE LOG: Latest Order
        console.log('📄 Latest Order:', {
          orderId: latestOrder.orderId || latestOrder._id,
          userId: latestOrder.userId,
          items: latestOrder.items,
          totalAmount: latestOrder.totalAmount,
          createdAt: latestOrder.createdAt
        });

        // Map to bill items format
        loadedItems = (latestOrder.items || []).map((item, idx) => ({
          id: Date.now() + idx,
          name: item.name,
          quantity: item.qty || 1,
          price: Number(item.price) || 0,
          vat: bill.vatPercentage || 18
        }));

        // 🔥 CONSOLE LOG: Loaded Items
        console.log('🛒 Loaded Bill Items:', loadedItems);
      } else {
        console.log('⚠️ No orders found for user ID:', user.userId || user.id);
      }

      // Update bill state
      setBill(prev => ({
        ...prev,
        customerName: user.name || '',
        customerPhone: user.phone || user.email || '',
        items: loadedItems
      }));

      // 🔥 CONSOLE LOG: Customer Info Loaded
      console.log('📋 Customer Information Loaded:', {
        customerName: user.name,
        customerPhone: user.phone || user.email,
        itemsCount: loadedItems.length
      });

    } else {
      console.log('❌ User not found with ID:', selectedUser, 'Available users:', users.map(u => u.userId || u.id));
    }
  }
}, [selectedUser, users, orders]);

  // Calculate totals with console logs
  useEffect(() => {
    const subtotal = bill.items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    );
    const vatAmount = subtotal * (bill.vatPercentage / 100);
    const total = subtotal + vatAmount;
    const change = bill.cash - total;

    // Console log: Financial Summary
    console.log("💰 Financial Summary:", {
      subtotal: subtotal.toFixed(2),
      vatAmount: vatAmount.toFixed(2),
      vatPercentage: bill.vatPercentage,
      total: total.toFixed(2),
      cash: bill.cash.toFixed(2),
      change: change.toFixed(2),
    });

    setBill((prev) => ({
      ...prev,
      subtotal,
      vatAmount,
      total,
      change,
    }));
  }, [bill.items, bill.vatPercentage, bill.cash]);

  // Handlers
  const handleShopInfoChange = (e) => {
    const { name, value } = e.target;
    setBill((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillInfoChange = (e) => {
    const { name, value } = e.target;
    setBill((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...bill.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setBill((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    if (newItem.name && newItem.price > 0) {
      setBill((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            id: Date.now(),
            name: newItem.name,
            quantity: newItem.quantity,
            price: newItem.price,
            vat: newItem.vat,
          },
        ],
      }));
      setNewItem({ id: "", name: "", quantity: 1, price: 0, vat: 18 });
    }
  };

  const removeItem = (id) => {
    setBill((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const startEditItem = (item) => {
    setEditingItem({ ...item });
  };

  const saveEditItem = () => {
    if (editingItem) {
      setBill((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === editingItem.id ? editingItem : item,
        ),
      }));
      setEditingItem(null);
    }
  };

  // Excel Download
  const downloadExcel = () => {
    const COLS = 5;
    const thin = { style: "thin", color: { rgb: "999999" } };
    const dashed = { style: "dashed", color: { rgb: "333333" } };

    const centerBold = (size = 11) => ({
      font: { bold: true, sz: size },
      alignment: { horizontal: "center", vertical: "center" },
    });
    const center = (size = 10) => ({
      font: { sz: size },
      alignment: { horizontal: "center", vertical: "center" },
    });
    const left = (size = 10, bold = false) => ({
      font: { sz: size, bold },
      alignment: { horizontal: "left", vertical: "center" },
    });
    const right = (size = 10, bold = false) => ({
      font: { sz: size, bold },
      alignment: { horizontal: "right", vertical: "center" },
    });
    const headerCell = {
      font: { bold: true, sz: 10 },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "F8F9FA" } },
      border: { top: thin, bottom: thin, left: thin, right: thin },
    };
    const bodyCell = (align = "center") => ({
      font: { sz: 10 },
      alignment: { horizontal: align, vertical: "center" },
      border: {
        top: { style: "hair", color: { rgb: "CCCCCC" } },
        bottom: { style: "hair", color: { rgb: "CCCCCC" } },
        left: thin,
        right: thin,
      },
    });

    const rows = [];
    const merges = [];
    const pushRow = (cells) => {
      rows.push(cells);
      return rows.length - 1;
    };
    const cell = (v, s) => ({ v, t: typeof v === "number" ? "n" : "s", s });
    const blankRow = () => Array.from({ length: COLS }, () => cell("", {}));

    // Shop header block
    let r = pushRow([
      cell(bill.shopName, centerBold(16)),
      ...Array(COLS - 1).fill(cell("", {})),
    ]);
    merges.push({ s: { r, c: 0 }, e: { r, c: COLS - 1 } });
    r = pushRow([
      cell(bill.shopAddress, center(10)),
      ...Array(COLS - 1).fill(cell("", {})),
    ]);
    merges.push({ s: { r, c: 0 }, e: { r, c: COLS - 1 } });
    r = pushRow([
      cell(bill.shopPhone, center(10)),
      ...Array(COLS - 1).fill(cell("", {})),
    ]);
    merges.push({ s: { r, c: 0 }, e: { r, c: COLS - 1 } });
    r = pushRow([
      cell(bill.shopVat, center(10)),
      ...Array(COLS - 1).fill(cell("", {})),
    ]);
    merges.push({ s: { r, c: 0 }, e: { r, c: COLS - 1 } });

    rows.push(blankRow());

    // Meta section
    r = pushRow([
      cell(`TABLE NO: ${bill.tableNumber}`, left(10, true)),
      cell("", {}),
      cell(`RECEIPT: ${bill.billNumber}`, left(10, true)),
      cell("", {}),
      cell("", {}),
    ]);
    merges.push({ s: { r, c: 0 }, e: { r, c: 1 } });
    merges.push({ s: { r, c: 2 }, e: { r, c: 4 } });

    r = pushRow([
      cell(`DATE ${bill.date}`, left(10)),
      cell("", {}),
      cell(`TIME ${bill.time}`, left(10)),
      cell("", {}),
      cell("", {}),
    ]);
    merges.push({ s: { r, c: 0 }, e: { r, c: 1 } });
    merges.push({ s: { r, c: 2 }, e: { r, c: 4 } });

    r = pushRow([
      cell(`CASHIER: ${bill.cashier}`, left(10)),
      cell("", {}),
      cell(bill.customerName ? `CUSTOMER: ${bill.customerName}` : "", left(10)),
      cell("", {}),
      cell("", {}),
    ]);
    merges.push({ s: { r, c: 0 }, e: { r, c: 1 } });
    merges.push({ s: { r, c: 2 }, e: { r, c: 4 } });

    if (bill.customerPhone) {
      r = pushRow([
        cell(`PHONE: ${bill.customerPhone}`, left(10)),
        ...Array(COLS - 1).fill(cell("", {})),
      ]);
      merges.push({ s: { r, c: 0 }, e: { r, c: COLS - 1 } });
    }

    rows.push(blankRow());

    // Items header
    pushRow([
      cell("QTY", headerCell),
      cell("DESCRIPTION", headerCell),
      cell("PRICE", headerCell),
      cell("AMOUNT", headerCell),
      cell("VAT%", headerCell),
    ]);

    // Items
    bill.items.forEach((item) => {
      pushRow([
        cell(item.quantity, bodyCell("center")),
        cell(item.name, bodyCell("left")),
        cell(Number(item.price.toFixed(2)), bodyCell("right")),
        cell(
          Number((item.quantity * item.price).toFixed(2)),
          bodyCell("right"),
        ),
        cell(`${item.vat || bill.vatPercentage}%`, bodyCell("center")),
      ]);
    });

    rows.push(blankRow());

    // Totals
    const totalRow = (label, value, big = false) => {
      pushRow([
        cell("", {}),
        cell("", {}),
        cell(label, right(big ? 13 : 10, true)),
        cell(Number(value.toFixed(2)), right(big ? 13 : 10, true)),
        cell("", {}),
      ]);
    };
    totalRow("SUBTOTAL", bill.subtotal);
    totalRow("TOTAL", bill.total, true);
    totalRow("CASH", bill.cash);
    totalRow(bill.change < 0 ? "DUE" : "CHANGE", Math.abs(bill.change));

    rows.push(blankRow());

    // VAT breakdown
    r = pushRow([
      cell("VAT%", left(9, true)),
      cell("NET", center(9)),
      cell("VAT", right(9, true)),
      cell("", {}),
      cell("", {}),
    ]);
    r = pushRow([
      cell(`${bill.vatPercentage}%`, left(9)),
      cell(Number(bill.subtotal.toFixed(2)), center(9)),
      cell(Number(bill.vatAmount.toFixed(2)), right(9)),
      cell("", {}),
      cell("", {}),
    ]);

    rows.push(blankRow());

    // Footer
    r = pushRow([
      cell("THANK YOU", centerBold(14)),
      ...Array(COLS - 1).fill(cell("", {})),
    ]);
    merges.push({ s: { r, c: 0 }, e: { r, c: COLS - 1 } });

    if (bill.notes) {
      rows.push(blankRow());
      r = pushRow([
        cell(bill.notes, center(10)),
        ...Array(COLS - 1).fill(cell("", {})),
      ]);
      merges.push({ s: { r, c: 0 }, e: { r, c: COLS - 1 } });
    }

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws["!merges"] = merges;
    ws["!cols"] = [
      { wch: 8 },
      { wch: 38 },
      { wch: 12 },
      { wch: 12 },
      { wch: 8 },
    ];
    ws["!rows"] = rows.map(() => ({ hpt: 18 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bill");
    XLSX.writeFile(wb, `Bill_${bill.billNumber.replace(/\//g, "-")}.xlsx`);
  };

  const saveBill = async () => {
    try {
      if (editMode && id) {
        await updateBill(id, bill);
      } else {
        await createBill(bill);
      }
      alert(`Bill ${editMode ? "updated" : "saved"} successfully!`);
      navigate("/bills");
    } catch (error) {
      console.error("Failed to save bill:", error);
      alert("Failed to save bill");
    }
  };

  const printBill = () => {
    window.print();
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const resetBill = () => {
    setBill({
      id: "",
      billNumber: `BILL-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("en-GB", { hour12: false }),
      shopName: "Lorem's Restaurant",
      shopAddress: "12, MILKWAY Galaxy/ Earth",
      shopPhone: "Tel: 123-456-7890",
      shopVat: "VAT REG.NO 0123456789",
      tableNumber: "543",
      cashier: "SUPERVISOR",
      customerName: "",
      customerPhone: "",
      items: [],
      subtotal: 0,
      vatPercentage: 18,
      vatAmount: 0,
      total: 0,
      cash: 0,
      change: 0,
      notes: "",
    });
    setSelectedUser("");
    setNewItem({ id: "", name: "", quantity: 1, price: 0, vat: 18 });
    setEditingItem(null);
    setEditMode(false);
  };

  const addFromProducts = (product) => {
    if (product) {
      setNewItem((prev) => ({
        ...prev,
        name: product.name,
        price: product.price || 0,
      }));
    }
  };

  if (loading) return <div className="card">Loading...</div>;

  const showShopSection = sectionView === "shop";
  const showBillSection = sectionView === "bill";
  const showCustomerSection = sectionView === "customer";

  return (
    <div className="bill-page">
      <div className="page-header">
        <h1 className="page-title">
          {editMode ? "Edit Bill" : "Generate New Bill"}
        </h1>
        <p className="page-subtitle">
          Create, edit, and manage restaurant bills.
        </p>
      </div>

      <div className="bill-editor">
        {!showPreview ? (
          <div className="card">
            {/* SECTION VIEW SELECTOR */}
            <div className="section-view-bar">
              <label className="section-view-label" htmlFor="sectionView">
                View
              </label>
              <select
                id="sectionView"
                className="form-select section-view-select"
                value={sectionView}
                onChange={(e) => setSectionView(e.target.value)}
              >
                <option value="shop">Shop Information</option>
                <option value="bill">Bill Information</option>
                <option value="customer">Customer Information</option>
              </select>
            </div>

            {/* SHOP INFORMATION SECTION */}
            {showShopSection && (
              <div className="editor-section">
                <h3>🏪 Shop Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Shop Name</label>
                    <input
                      type="text"
                      name="shopName"
                      value={bill.shopName}
                      onChange={handleShopInfoChange}
                      className="form-input"
                      placeholder="Restaurant Name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Shop Address</label>
                    <input
                      type="text"
                      name="shopAddress"
                      value={bill.shopAddress}
                      onChange={handleShopInfoChange}
                      className="form-input"
                      placeholder="Address"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      name="shopPhone"
                      value={bill.shopPhone}
                      onChange={handleShopInfoChange}
                      className="form-input"
                      placeholder="Phone"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">VAT Registration</label>
                    <input
                      type="text"
                      name="shopVat"
                      value={bill.shopVat}
                      onChange={handleShopInfoChange}
                      className="form-input"
                      placeholder="VAT REG.NO"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BILL INFORMATION SECTION */}
            {showBillSection && (
              <div className="editor-section">
                <h3>📄 Bill Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Bill Number</label>
                    <input
                      type="text"
                      name="billNumber"
                      value={bill.billNumber}
                      onChange={handleBillInfoChange}
                      className="form-input"
                      placeholder="Bill Number"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={bill.date}
                      onChange={handleBillInfoChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={bill.time}
                      onChange={handleBillInfoChange}
                      className="form-input"
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Table Number</label>
                    <input
                      type="text"
                      name="tableNumber"
                      value={bill.tableNumber}
                      onChange={handleBillInfoChange}
                      className="form-input"
                      placeholder="Table No"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cashier</label>
                    <input
                      type="text"
                      name="cashier"
                      value={bill.cashier}
                      onChange={handleBillInfoChange}
                      className="form-input"
                      placeholder="Cashier Name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">VAT %</label>
                    <input
                      type="number"
                      name="vatPercentage"
                      value={bill.vatPercentage}
                      onChange={handleBillInfoChange}
                      className="form-input"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CUSTOMER SECTION */}
            {showCustomerSection && (
              <>
                <div className="editor-section">
                  <h3>👤 Customer Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Select User (Optional)
                      </label>
                      <select
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="form-select"
                      >
                        <option value="">
                          Select a user or enter manually
                        </option>
                        {users.map((user) => (
                          <option
                            key={user.userId || user.id}
                            value={user.userId || user.id}
                          >
                            {user.name} ({user.email}) - ID:{" "}
                            {user.userId || user.id}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Customer Name</label>
                      <input
                        type="text"
                        name="customerName"
                        value={bill.customerName}
                        onChange={handleBillInfoChange}
                        className="form-input"
                        placeholder="Customer Name"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Customer Phone</label>
                      <input
                        type="text"
                        name="customerPhone"
                        value={bill.customerPhone}
                        onChange={handleBillInfoChange}
                        className="form-input"
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                </div>

                {/* ADD ITEMS SECTION */}
                <div className="editor-section">
                  <h3>🍽️ Add Items</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Product Name</label>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <select
                          value={newItem.name}
                          onChange={(e) =>
                            setNewItem((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="form-select"
                          style={{ flex: 1 }}
                        >
                          <option value="">Select from products</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.name}>
                              {product.name} (₹{product.price})
                            </option>
                          ))}
                        </select>
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            addFromProducts(
                              products.find((p) => p.name === newItem.name),
                            )
                          }
                        >
                          Load
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Quantity</label>
                      <input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            quantity: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="form-input"
                        min="1"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price (₹)</label>
                      <input
                        type="number"
                        value={newItem.price}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            price: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="form-input"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">VAT %</label>
                      <input
                        type="number"
                        value={newItem.vat}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            vat: parseInt(e.target.value) || 0,
                          }))
                        }
                        className="form-input"
                        min="0"
                      />
                    </div>
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={addItem}
                    disabled={!newItem.name || newItem.price <= 0}
                  >
                    + Add Item
                  </button>
                </div>

                {/* ITEMS LIST SECTION */}
                <div className="editor-section">
                  <h3>📋 Bill Items ({bill.items.length})</h3>
                  <div className="items-table-container">
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Item Name</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Amount</th>
                          <th>VAT%</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bill.items.map((item, index) => (
                          <tr key={item.id}>
                            <td>{index + 1}</td>
                            <td>
                              {editingItem?.id === item.id ? (
                                <input
                                  type="text"
                                  value={editingItem.name}
                                  onChange={(e) =>
                                    setEditingItem((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                  className="form-input"
                                  style={{ width: "100%" }}
                                />
                              ) : (
                                item.name
                              )}
                            </td>
                            <td>
                              {editingItem?.id === item.id ? (
                                <input
                                  type="number"
                                  value={editingItem.quantity}
                                  onChange={(e) =>
                                    setEditingItem((prev) => ({
                                      ...prev,
                                      quantity: parseInt(e.target.value) || 1,
                                    }))
                                  }
                                  className="form-input"
                                  style={{ width: "60px" }}
                                />
                              ) : (
                                item.quantity
                              )}
                            </td>
                            <td>
                              {editingItem?.id === item.id ? (
                                <input
                                  type="number"
                                  value={editingItem.price}
                                  onChange={(e) =>
                                    setEditingItem((prev) => ({
                                      ...prev,
                                      price: parseFloat(e.target.value) || 0,
                                    }))
                                  }
                                  className="form-input"
                                  style={{ width: "80px" }}
                                />
                              ) : (
                                `₹${item.price.toFixed(2)}`
                              )}
                            </td>
                            <td>₹{(item.quantity * item.price).toFixed(2)}</td>
                            <td>
                              {editingItem?.id === item.id ? (
                                <input
                                  type="number"
                                  value={editingItem.vat}
                                  onChange={(e) =>
                                    setEditingItem((prev) => ({
                                      ...prev,
                                      vat: parseInt(e.target.value) || 0,
                                    }))
                                  }
                                  className="form-input"
                                  style={{ width: "50px" }}
                                />
                              ) : (
                                `${item.vat || bill.vatPercentage}%`
                              )}
                            </td>
                            <td>
                              {editingItem?.id === item.id ? (
                                <>
                                  <button
                                    className="btn btn-success btn-sm"
                                    onClick={saveEditItem}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => setEditingItem(null)}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="btn btn-outline btn-sm"
                                    onClick={() => startEditItem(item)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => removeItem(item.id)}
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* FINANCIAL SUMMARY SECTION */}
                <div className="editor-section">
                  <h3>💰 Financial Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-card">
                      <label>Subtotal</label>
                      <span>₹{bill.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-card">
                      <label>VAT ({bill.vatPercentage}%)</label>
                      <span>₹{bill.vatAmount.toFixed(2)}</span>
                    </div>
                    <div className="summary-card">
                      <label>Total</label>
                      <span>₹{bill.total.toFixed(2)}</span>
                    </div>
                    <div className="summary-card">
                      <label>Cash Received</label>
                      <input
                        type="number"
                        value={bill.cash}
                        onChange={(e) =>
                          setBill((prev) => ({
                            ...prev,
                            cash: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="form-input"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="summary-card">
                      <label>
                        {bill.change < 0 ? "Balance Due" : "Change"}
                      </label>
                      <span>₹{Math.abs(bill.change).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* NOTES SECTION */}
                <div className="editor-section">
                  <h3>📝 Additional Notes</h3>
                  <textarea
                    value={bill.notes}
                    onChange={(e) =>
                      setBill((prev) => ({ ...prev, notes: e.target.value }))
                    }
                    className="form-textarea"
                    rows="3"
                    placeholder="Any additional notes..."
                  />
                </div>
              </>
            )}

            {/* ACTIONS */}
            <div className="form-actions" style={{ marginTop: "24px" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={resetBill}
              >
                Reset
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={togglePreview}
                disabled={bill.items.length === 0}
              >
                Preview Bill
              </button>
              <button
                type="button"
                className="btn btn-success"
                onClick={saveBill}
                disabled={bill.items.length === 0}
              >
                {editMode ? "Update Bill" : "Save Bill"}
              </button>
            </div>
          </div>
        ) : (
          // PREVIEW MODE
          <div className="bill-preview-container" ref={billRef}>
            <div className="bill-actions-bar">
              <button className="btn btn-outline" onClick={togglePreview}>
                Back to Editor
              </button>
              <button className="btn btn-primary" onClick={saveBill}>
                {editMode ? "Update Bill" : "Save Bill"}
              </button>
              <button className="btn btn-outline" onClick={printBill}>
                Print Bill
              </button>
              <button className="btn btn-success" onClick={downloadExcel}>
                Download Excel
              </button>
            </div>
            <BillPreview bill={bill} />
          </div>
        )}
      </div>
    </div>
  );
};

// Bill Preview Component (Thermal Printer Style)
const BillPreview = ({ bill }) => {
  return (
    <div className="thermal-bill">
      <div className="bill-header-section">
        <h2 className="shop-name">{bill.shopName}</h2>
        <p className="shop-address">{bill.shopAddress}</p>
        <p className="shop-contact">{bill.shopPhone}</p>
        <p className="shop-vat">{bill.shopVat}</p>
      </div>

      <div className="bill-meta-section">
        <div className="meta-row">
          <span>TABLE NO: {bill.tableNumber}</span>
          <span>RECEIPT: {bill.billNumber}</span>
        </div>
        <div className="meta-row">
          <span>DATE {bill.date}</span>
          <span>TIME {bill.time}</span>
        </div>
        <div className="meta-row">
          <span>CASHIER: {bill.cashier}</span>
          {bill.customerName && <span>CUSTOMER: {bill.customerName}</span>}
        </div>
        {bill.customerPhone && (
          <div className="meta-row">
            <span>PHONE: {bill.customerPhone}</span>
          </div>
        )}
      </div>

      <div className="bill-items-section">
        <table className="bill-items-table">
          <thead>
            <tr>
              <th>QTY</th>
              <th>DESCRIPTION</th>
              <th>PRICE</th>
              <th>AMOUNT</th>
              <th>VAT</th>
            </tr>
          </thead>
          <tbody>
            {bill.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.quantity}</td>
                <td style={{ textAlign: "left" }}>{item.name}</td>
                <td style={{ textAlign: "right" }}>{item.price.toFixed(2)}</td>
                <td style={{ textAlign: "right" }}>
                  {(item.quantity * item.price).toFixed(2)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {item.vat || bill.vatPercentage}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bill-totals-section">
        <div className="total-row">
          <span>SUBTOTAL</span>
          <span>{bill.subtotal?.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>TOTAL</span>
          <span>{bill.total?.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>CASH</span>
          <span>{bill.cash?.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>{(bill.change ?? 0) < 0 ? "DUE" : "CHANGE"}</span>
          <span>{Math.abs(bill.change ?? 0).toFixed(2)}</span>
        </div>
      </div>

      <div className="bill-vat-section">
        <div className="vat-row">
          <span>VAT%</span>
          <span>{bill.vatPercentage}%</span>
        </div>
        <div className="vat-row">
          <span>NET</span>
          <span>{bill.subtotal?.toFixed(2)}</span>
        </div>
        <div className="vat-row">
          <span>VAT</span>
          <span>{bill.vatAmount?.toFixed(2)}</span>
        </div>
      </div>

      <div className="bill-footer-section">
        <h3>THANK YOU</h3>
      </div>
    </div>
  );
};

export default GenerateBill;
