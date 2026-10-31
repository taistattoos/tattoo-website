'use client';

import ChoiceChip from '@/components/ui/ChoiceChip';
import { inputClasses } from '@/lib/constants/contact-form';
import type { FormQuestion } from '@/types/contact-form';

type FormFieldProps = {
  question: FormQuestion;
  value: string | string[];
  onChange: (value: string | string[]) => void;
};

const LABEL_CLASSES = 'flex flex-col gap-1 text-sm text-white/70';

export default function FormField({ question, value, onChange }: FormFieldProps) {
  const { key, type, label, placeholder, required, options } = question;
  const text = typeof value === 'string' ? value : '';
  const selected = Array.isArray(value) ? value : [];
  const title = required ? `${label} *` : label;

  if (type === 'radio' || type === 'checkboxes') {
    return (
      <fieldset>
        <legend className='mb-3 text-sm text-white/70'>{title}</legend>
        <div className='flex flex-wrap gap-3'>
          {options.map((option) =>
            type === 'radio' ? (
              <ChoiceChip
                key={option.value}
                type='radio'
                name={key}
                value={option.value}
                label={option.label}
                checked={text === option.value}
                onChange={() => onChange(option.value)}
                required={required}
              />
            ) : (
              <ChoiceChip
                key={option.value}
                type='checkbox'
                name={key}
                value={option.value}
                label={option.label}
                checked={selected.includes(option.value)}
                onChange={() =>
                  onChange(
                    selected.includes(option.value)
                      ? selected.filter((item) => item !== option.value)
                      : [...selected, option.value],
                  )
                }
              />
            ),
          )}
        </div>
      </fieldset>
    );
  }

  if (type === 'select') {
    return (
      <label className={LABEL_CLASSES}>
        {title}
        <select
          required={required}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={inputClasses}
        >
          <option value='' className='bg-black'>
            {placeholder ?? ''}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className='bg-black'>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (type === 'textarea') {
    return (
      <label className={LABEL_CLASSES}>
        {title}
        <textarea
          rows={4}
          required={required}
          placeholder={placeholder}
          value={text}
          onChange={(event) => onChange(event.target.value)}
          className={inputClasses}
        />
      </label>
    );
  }

  return (
    <label className={LABEL_CLASSES}>
      {title}
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        className={inputClasses}
      />
    </label>
  );
}