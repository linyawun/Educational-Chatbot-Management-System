import { useRef, useState } from 'react';

export const FormErrorMsg = ({ errors, name }) => {
  return (
    errors[name] && (
      <div className='invalid-feedback'>{errors?.[name]?.message}</div>
    )
  );
};
export const Input = ({
  register,
  errors,
  id,
  type,
  labelText,
  rules,
  placeholder = '',
  onChange,
  visibleIcon,
  disabled = false,
}) => {
  const [visible, setVisible] = useState(false);
  const visibleIconRef = useRef(null);
  function toggleVisible(e) {
    const passwordInput = visibleIconRef.current.previousSibling;
    passwordInput.type =
      passwordInput.type === 'password' ? 'text' : 'password';
    setVisible((pre) => !pre);
  }

  return (
    <>
      {labelText && (
        <label htmlFor={id} className='form-label'>
          {labelText}
        </label>
      )}
      <div className='input-group'>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={`form-control bg-light ${
            visibleIcon && 'border-right-0'
          } ${errors[id] ? 'is-invalid' : ''}`}
          {...register(id, rules)}
          onChange={onChange}
          disabled={disabled}
        />
        {visibleIcon && (
          <span
            type='button'
            className='input-group-text bg-light border-start-0'
            onClick={(e) => {
              toggleVisible(e);
            }}
            ref={visibleIconRef}
          >
            {visible ? (
              <i className='bi bi-eye-fill'></i>
            ) : (
              <i className='bi bi-eye-slash-fill'></i>
            )}
          </span>
        )}
        <FormErrorMsg errors={errors} name={id} />
      </div>
    </>
  );
};

export const Select = ({
  register,
  errors,
  labelText,
  id,
  rules,
  disabled,
  children,
}) => {
  return (
    <>
      <label htmlFor={id} className='form-label'>
        {labelText}
      </label>
      <select
        id={id}
        className={`form-select bg-light ${errors[id] ? 'is-invalid' : ''}`}
        {...register(id, rules)}
        disabled={disabled}
      >
        {children}
      </select>
      <FormErrorMsg errors={errors} name={id} />
    </>
  );
};

export const CheckboxRadio = ({
  register,
  errors,
  type,
  name,
  id,
  value,
  rules,
  labelText,
  hasErrorMsg,
}) => {
  return (
    <div className='form-check'>
      <input
        className={`form-check-input ${errors[name] ? 'is-invalid' : ''}`}
        type={type}
        id={id}
        value={value}
        {...register(name, rules)}
      />
      <label className='form-check-label' htmlFor={id}>
        {labelText}
      </label>

      {hasErrorMsg ? <FormErrorMsg errors={errors} name={name} /> : ''}
    </div>
  );
};
