import React from 'react';

// Button component
export const Button = ({ children, onClick, className = '', disabled = false, ...props }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        disabled
          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
          : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Label component
export const Label = ({ children, className = '', ...props }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );
};

// Input component
export const Input = ({ className = '', ...props }) => {
  return (
    <input
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
};

// RadioGroup component
export const RadioGroup = ({ children, className = '', name, value, onValueChange, ...props }) => {
  const handleChange = (e) => {
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            name,
            checked: child.props.value === value,
            onChange: handleChange,
          });
        }
        return child;
      })}
    </div>
  );
};

// RadioGroupItem component
export const RadioGroupItem = ({ value, id, children, name, checked, onChange, ...props }) => {
  const handleClick = () => {
    if (onChange) {
      onChange({ target: { value } });
    }
  };

  return (
    <div 
      className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 pointer-events-none"
        {...props}
      />
      <label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer flex-1 pointer-events-none">
        {children}
      </label>
    </div>
  );
};

export default {
  Button,
  Label,
  Input,
  RadioGroup,
  RadioGroupItem,
};
