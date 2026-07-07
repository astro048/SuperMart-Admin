import '../styles/form.css'


const FormInput = ({ label, type = 'text', name, value, onChange, placeholder, required = false, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}{required && ' *'}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-input"
        required={required}
        {...props}
      />
    </div>
  )
}

export default FormInput