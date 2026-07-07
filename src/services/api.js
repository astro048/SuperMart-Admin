// Base URL of your Express + MongoDB backend.
// Vite: set VITE_API_URL in .env. Create React App: set REACT_APP_API_URL instead
// and swap the line below to `process.env.REACT_APP_API_URL`.
const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:5000/api' 

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`)
  }
  return data
}

// ===== USERS =====
export const getUsers = async () => {
  const res = await fetch(`${API_BASE}/users`)
  return handleResponse(res)
}

export const getUser = async (id) => {
  const res = await fetch(`${API_BASE}/users/${id}`)
  return handleResponse(res)
}

export const createUser = async (user) => {
  const res = await fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  return handleResponse(res)
}

export const updateUser = async (id, user) => {
  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
  return handleResponse(res)
}

export const deleteUser = async (id) => {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
  return handleResponse(res)
}

// ===== ORDERS =====
export const getOrders = async () => {
  const res = await fetch(`${API_BASE}/orders`)
  return handleResponse(res)
}

export const getOrder = async (id) => {
  const res = await fetch(`${API_BASE}/orders/${id}`)
  return handleResponse(res)
}

export const createOrder = async (order) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  return handleResponse(res)
}

export const updateOrder = async (id, order) => {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
  return handleResponse(res)
}

export const deleteOrder = async (id) => {
  const res = await fetch(`${API_BASE}/orders/${id}`, { method: 'DELETE' })
  return handleResponse(res)
}

// ===== PRODUCTS =====
export const getProducts = async () => {
  const res = await fetch(`${API_BASE}/products`)
  return handleResponse(res)
}

export const getProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`)
  return handleResponse(res)
}

export const createProduct = async (product) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  return handleResponse(res)
}

export const updateProduct = async (id, product) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  return handleResponse(res)
}

export const deleteProduct = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' })
  return handleResponse(res)
}

// ===== BILLS =====
export const getBills = async () => {
  const res = await fetch(`${API_BASE}/bills`)
  return handleResponse(res)
}

export const getBill = async (id) => {
  const res = await fetch(`${API_BASE}/bills/${id}`)
  return handleResponse(res)
}

export const createBill = async (bill) => {
  const res = await fetch(`${API_BASE}/bills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bill)
  })
  return handleResponse(res)
}

export const updateBill = async (id, bill) => {
  const res = await fetch(`${API_BASE}/bills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bill)
  })
  return handleResponse(res)
}

export const deleteBill = async (id) => {
  const res = await fetch(`${API_BASE}/bills/${id}`, { method: 'DELETE' })
  return handleResponse(res)
}

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_BASE}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  return handleResponse(res)
}

export const registerUser = async (userData) => {
  const res = await fetch(`${API_BASE}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  })
  return handleResponse(res)
}