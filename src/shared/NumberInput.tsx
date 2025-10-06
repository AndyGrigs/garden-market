import { useEffect, useState } from 'react';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  type?: 'integer' | 'decimal';
  placeholder?: string;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  disabled?: boolean;
  label?: string;
}


const NumberInput = ({
            value,
            onChange,
            type = 'decimal',
            placeholder = '0',
            className = '',
            min = 0,
            max,
            step,
            required = false,
            disabled = false,
            label
}: NumberInputProps) => {
    const [displayValue, setDisplayValue] = useState('');

    useEffect(()=>{
        setDisplayValue(value === 0 ? '': value.toString())
    }, [value]);
 
    const pattern = type === 'integer' ? '[0-9]*' : '[0-9]*\\.?[0-9]*';
    const inputMode = type === 'integer' ? 'numeric' : 'decimal';
    const regex = type === 'integer' ? /^\d*$/ : /^\d*\.?\d*$/;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '0' || value === 0) {
      setDisplayValue('');
    }
  };

   const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === '') {
      setDisplayValue('');
      onChange(0);
    } else {
      // Форматуємо значення при втраті фокусу
      const numValue = type === 'integer' 
        ? parseInt(e.target.value) || 0
        : parseFloat(e.target.value) || 0;
      
      // Перевіряємо межі
      const clampedValue = Math.max(min, max ? Math.min(max, numValue) : numValue);
      setDisplayValue(clampedValue === 0 ? '' : clampedValue.toString());
      onChange(clampedValue);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Дозволяємо пусте значення або валідне число
    if (newValue === '' || regex.test(newValue)) {
      setDisplayValue(newValue);
      
      if (newValue === '') {
        onChange(0);
      } else {
        const numValue = type === 'integer' 
          ? parseInt(newValue) || 0
          : parseFloat(newValue) || 0;
        onChange(numValue);
      }
    }
  };

  return (
      <div>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="text"
        inputMode={inputMode}
        pattern={pattern}
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 ${className}`}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
      />
    </div>
  )
}

export default NumberInput