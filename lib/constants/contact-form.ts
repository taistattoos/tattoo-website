import { FormStateInterface } from "@/types/form";

export const initialState: FormStateInterface = {
  name: '',
  email: '',
  contactMethod: 'form_now',
  whatsappNumber: '',
  placement: '',
  placementOther: '',
  size: '',
  colors: [],
  message: '',
};

export const inputClasses =
  'w-full rounded-md border border-white/15 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-white/40';