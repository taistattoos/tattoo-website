type ChoiceChipProps = {
  type: 'checkbox' | 'radio';
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
  required?: boolean;
};

export default function ChoiceChip({ type, name, value, label, checked, onChange, required }: ChoiceChipProps) {
  return (
    <label className='cursor-pointer'>
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        required={required}
        className='peer sr-only'
      />
      <span className='flex min-h-12 items-center justify-center border border-white/20 px-5 py-3 text-sm uppercase tracking-[0.15em] text-white/60 transition-colors duration-300 hover:border-white/50 peer-checked:border-white peer-checked:bg-white peer-checked:text-black peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white'>
        {label}
      </span>
    </label>
  );
}