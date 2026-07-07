import '../styles/form.css'

const FormSelect = ({ label, name, value, onChange, options, required = false, ...props }) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}{required && ' *'}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="form-select"
        required={required}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label || option.value}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FormSelect