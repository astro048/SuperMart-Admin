import '../styles/bills.css'

const BillPreview = ({ bill }) => {
  return (
    <div className="thermal-bill">
      {/* Header */}
      <div className="bill-header-section">
        <h2 className="shop-name">{bill.shopName}</h2>
        <p className="shop-address">{bill.shopAddress}</p>
        <p className="shop-contact">{bill.shopPhone}</p>
        <p className="shop-vat">{bill.shopVat}</p>
      </div>

      {/* Meta */}
      <div className="bill-meta-section">
        <div className="meta-row"><span>TABLE NO: {bill.tableNumber}</span><span>RECEIPT: {bill.billNumber}</span></div>
        <div className="meta-row"><span>DATE {bill.date}</span><span>TIME {bill.time}</span></div>
        <div className="meta-row"><span>CASHIER: {bill.cashier}</span>{bill.customerName && <span>CUSTOMER: {bill.customerName}</span>}</div>
        {bill.customerPhone && <div className="meta-row"><span>PHONE: {bill.customerPhone}</span></div>}
      </div>

      {/* Items Table */}
      <div className="bill-items-section">
        <table className="bill-items-table">
          <thead>
            <tr><th>QTY</th><th>DESCRIPTION</th><th>PRICE</th><th>AMOUNT</th><th>VAT</th></tr>
          </thead>
          <tbody>
            {bill.items?.map((item, index) => (
              <tr key={index}>
                <td>{item.quantity}</td>
                <td style={{ textAlign: 'left' }}>{item.name}</td>
                <td style={{ textAlign: 'right' }}>{item.price.toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{(item.quantity * item.price).toFixed(2)}</td>
                <td style={{ textAlign: 'center' }}>{item.vat || bill.vatPercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="bill-totals-section">
        <div className="total-row"><span>SUBTOTAL</span><span>{bill.subtotal?.toFixed(2)}</span></div>
        <div className="total-row"><span>TOTAL</span><span>{bill.total?.toFixed(2)}</span></div>
        <div className="total-row"><span>CASH</span><span>{bill.cash?.toFixed(2)}</span></div>
        <div className="total-row"><span>CHANGE</span><span>{bill.change?.toFixed(2)}</span></div>
      </div>

      {/* VAT Breakdown */}
      <div className="bill-vat-section">
        <div className="vat-row"><span>VAT%</span><span>{bill.vatPercentage}%</span></div>
        <div className="vat-row"><span>NET</span><span>{bill.subtotal?.toFixed(2)}</span></div>
        <div className="vat-row"><span>VAT</span><span>{bill.vatAmount?.toFixed(2)}</span></div>
      </div>

      {/* Footer */}
      <div className="bill-footer-section">
        <h3>THANK YOU</h3>
      </div>
    </div>
  )
}

export default BillPreview