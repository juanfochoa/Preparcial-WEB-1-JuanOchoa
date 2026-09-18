"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  ChangeEvent,
  FormEvent,
} from "react";
import { useCart } from "@/context/CartContext";
import { CartItem } from "@/types/product";

export interface CheckoutForm {
  fullName: string;
  email: string;
  paymentMethod: string;
  acceptTerms: boolean;
}

export type CheckoutErrors = Partial<Record<keyof CheckoutForm, string>>;

export type TouchedFields = Record<keyof CheckoutForm, boolean>;

export interface CompletedOrder {
  items: CartItem[];
  total: number;
  fullName: string;
  email: string;
  paymentMethod: string;
}

interface CheckoutContextType {
  // Estado
  form: CheckoutForm;
  touched: TouchedFields;
  errors: CheckoutErrors;
  isFormValid: boolean;
  isSubmitting: boolean;
  completedOrder: CompletedOrder | null;

  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  submitCheckout: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  resetCheckout: () => void;
}

const initialForm: CheckoutForm = {
  fullName: "",
  email: "",
  paymentMethod: "tarjeta",
  acceptTerms: false,
};

const initialTouched: TouchedFields = {
  fullName: false,
  email: false,
  paymentMethod: false,
  acceptTerms: false,
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCheckout(form: CheckoutForm): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (form.fullName.trim().length < 5) {
    errors.fullName = "El nombre debe tener al menos 5 caracteres.";
  }

  if (!EMAIL_REGEX.test(form.email.trim())) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  if (!form.acceptTerms) {
    errors.acceptTerms = "Debes aceptar los términos y condiciones.";
  }

  return errors;
}

function sendOrderToServer(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

const CheckoutContext = createContext<CheckoutContextType | null>(null);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { cart, clearCart, getTotal } = useCart();

  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [touched, setTouched] = useState<TouchedFields>(initialTouched);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  const errors = validateCheckout(form);
  const isFormValid = Object.keys(errors).length === 0;

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value } = e.target;
    const newValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const submitCheckout = async (e: FormEvent<HTMLFormElement>) => {
    // Evita la recarga nativa de la página que hace <form>.
    e.preventDefault();

    if (!isFormValid || isSubmitting || cart.length === 0) return;

    setIsSubmitting(true);

    try {
      await sendOrderToServer();

      setCompletedOrder({
        items: cart,
        total: getTotal(),
        fullName: form.fullName,
        email: form.email,
        paymentMethod: form.paymentMethod,
      });

      clearCart();

      setForm(initialForm);
      setTouched(initialTouched);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCheckout = () => {
    setForm(initialForm);
    setTouched(initialTouched);
    setCompletedOrder(null);
  };

  return (
    <CheckoutContext.Provider
      value={{
        form,
        touched,
        errors,
        isFormValid,
        isSubmitting,
        completedOrder,
        handleChange,
        handleBlur,
        submitCheckout,
        resetCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}
export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error("useCheckout debe usarse dentro de un CheckoutProvider");
  }

  return context;
}