import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import Orders from './pages/Orders'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import ProductInformation from './pages/ProductInformation'
import GenerateBill from './pages/GenerateBill'
import { DataProvider } from './context/DataContext'
import './styles/index.css'

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="app">
          <Sidebar />
          <div className="main-content">
        
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/details" element={<ProductDetails />} />
                <Route path="/products/details/:id" element={<ProductDetails />} />
                <Route path="/products/information" element={<ProductInformation />} />
                <Route path="/products/information/:id" element={<ProductInformation />} />
                <Route path="/bills" element={<GenerateBill />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </DataProvider>
  )
}

export default App