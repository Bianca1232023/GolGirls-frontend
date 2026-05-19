import './styles.scss'

interface Option {
  value: string | number
  label: string
}

interface InputFieldProps {
  label: string
  value: string
  onChange: (val: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'number'
  options?: Option[]
  required?: boolean
}

const InputField = ({ label, value, onChange, placeholder, type = 'text', options, required }: InputFieldProps) => {
  return (
    <div className="input-field">
      <label className="input-field__label">{label}</label>
      {options ? (
        <select
          className="input-field__control input-field__control--select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        >
          <option value="">{placeholder ?? 'Selecione...'}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          className="input-field__control"
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  )
}

export default InputField
