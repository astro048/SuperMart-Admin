import { createContext, useState, useEffect, useContext } from 'react'
import { getUsers, getOrders, getProducts } from '../services/api'

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersData, ordersData, productsData] = await Promise.all([
        getUsers(),
        getOrders(),
        getProducts()
      ])
      setUsers(usersData)
      setOrders(ordersData)
      setProducts(productsData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => fetchData()

  return (
    <DataContext.Provider value={{ users, orders, products, loading, error, refetch, setUsers, setOrders, setProducts }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}