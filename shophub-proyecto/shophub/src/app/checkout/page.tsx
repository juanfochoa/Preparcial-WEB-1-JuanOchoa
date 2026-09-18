"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useCheckout } from "@/context/CheckoutContext";

const PAYMENT_LABELS: Record<string, string> = {
  tarjeta: "Tarjeta de crédito / débito",
  pse: "PSE",
  efectivo: "Efectivo contra entrega",
};

export default function CheckoutPage() {
  const { cart, getTotal } = useCart();

  const {
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
  } = useCheckout();

  const isButtonDisabled = !isFormValid || isSubmitting || cart.length === 0;

  if (completedOrder) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.successIcon}>✓</div>
        <h1 style={styles.heading}>¡Pedido completado!</h1>
        <p style={styles.emptyText}>
          Gracias, {completedOrder.fullName}. Enviamos la confirmación a{" "}
          <strong>{completedOrder.email}</strong>.
        </p>

        <div style={styles.orderDetail}>
          {completedOrder.items.map((item) => (
            <div key={item.id} style={styles.orderDetailRow}>
              <span>
                {item.title} × {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div style={styles.orderDetailTotal}>
            <span>Total ({PAYMENT_LABELS[completedOrder.paymentMethod]})</span>
            <span>${completedOrder.total.toFixed(2)}</span>
          </div>
        </div>

        <Link href="/" style={styles.backLink} onClick={resetCheckout}>
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <h1 style={styles.heading}>Checkout</h1>
        <p style={styles.emptyText}>
          No tienes productos en el carrito para finalizar la compra.
        </p>
        <Link href="/" style={styles.backLink}>
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Checkout</h1>

      <div style={styles.layout}>
        <section style={styles.summary}>
          <h2 style={styles.sectionTitle}>Resumen de compra</h2>

          {cart.map((item) => (
            <div key={item.id} style={styles.summaryItem}>
              <img
                src={item.thumbnail}
                alt={item.title}
                style={styles.summaryImage}
              />
              <div style={styles.summaryInfo}>
                <p style={styles.summaryTitle}>{item.title}</p>
                <p style={styles.summaryMeta}>
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p style={styles.summarySubtotal}>
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div style={styles.summaryTotal}>
            <span>Total a pagar</span>
            <span>${getTotal().toFixed(2)}</span>
          </div>

          <Link href="/carrito" style={styles.editLink}>
            Editar carrito
          </Link>
        </section>

        <form style={styles.form} onSubmit={submitCheckout} noValidate>
          <h2 style={styles.sectionTitle}>Datos de facturación</h2>

          <div style={styles.field}>
            <label htmlFor="fullName" style={styles.label}>
              Nombre completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              placeholder="Ej: Juan Pérez"
              style={{
                ...styles.input,
                ...(touched.fullName && errors.fullName ? styles.inputError : {}),
              }}
            />
            {touched.fullName && errors.fullName && (
              <span style={styles.errorText}>{errors.fullName}</span>
            )}
          </div>

          <div style={styles.field}>
            <label htmlFor="email" style={styles.label}>
              Correo de facturación
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              placeholder="correo@ejemplo.com"
              style={{
                ...styles.input,
                ...(touched.email && errors.email ? styles.inputError : {}),
              }}
            />
            {touched.email && errors.email && (
              <span style={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div style={styles.field}>
            <label htmlFor="paymentMethod" style={styles.label}>
              Método de pago
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              style={styles.input}
            >
              {Object.entries(PAYMENT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.checkboxField}>
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              checked={form.acceptTerms}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isSubmitting}
              style={styles.checkbox}
            />
            <label htmlFor="acceptTerms" style={styles.checkboxLabel}>
              Acepto los términos y condiciones
            </label>
          </div>

          {isSubmitting && (
            <p style={styles.loadingText}>
              Procesando tu pedido, por favor espera…
            </p>
          )}

          <button
            type="submit"
            disabled={isButtonDisabled}
            style={{
              ...styles.submitButton,
              ...(isButtonDisabled ? styles.submitButtonDisabled : {}),
            }}
          >
            {isSubmitting ? "Procesando…" : "Confirmar pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "8px 0 40px",
  },
  heading: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a2e",
    marginBottom: "24px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    alignItems: "start",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: "0 0 16px",
  },
  // ---------- Resumen ----------
  summary: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },
  summaryItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  summaryImage: {
    width: "56px",
    height: "56px",
    objectFit: "cover",
    borderRadius: "8px",
    flexShrink: 0,
  },
  summaryInfo: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  summaryTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a1a2e",
    margin: 0,
  },
  summaryMeta: {
    fontSize: "12px",
    color: "#888",
    margin: 0,
  },
  summarySubtotal: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
    flexShrink: 0,
  },
  summaryTotal: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    padding: "16px 20px",
    backgroundColor: "#1a1a2e",
    color: "#ffffff",
    borderRadius: "10px",
    fontSize: "18px",
    fontWeight: 800,
  },
  editLink: {
    display: "inline-block",
    marginTop: "12px",
    color: "#e94560",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "13px",
  },
  
  form: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#1a1a2e",
  },
  input: {
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#1a1a2e",
  },
  inputError: {
    borderColor: "#e94560",
  },
  errorText: {
    fontSize: "12px",
    color: "#e94560",
  },
  checkboxField: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
  },
  checkboxLabel: {
    fontSize: "14px",
    color: "#1a1a2e",
    cursor: "pointer",
  },
  loadingText: {
    fontSize: "13px",
    color: "#888",
    margin: 0,
    fontStyle: "italic",
  },
  submitButton: {
    padding: "12px 20px",
    backgroundColor: "#e94560",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 700,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  emptyContainer: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#888",
  },
  emptyText: {
    fontSize: "16px",
    marginBottom: "20px",
  },
  successIcon: {
    width: "64px",
    height: "64px",
    margin: "0 auto 16px",
    borderRadius: "50%",
    backgroundColor: "#22c55e",
    color: "#ffffff",
    fontSize: "32px",
    fontWeight: 800,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  orderDetail: {
    maxWidth: "480px",
    margin: "0 auto 24px",
    padding: "16px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    textAlign: "left",
    color: "#1a1a2e",
    fontSize: "14px",
  },
  orderDetailRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "6px 0",
    borderBottom: "1px solid #f0f0f0",
  },
  orderDetailTotal: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    paddingTop: "12px",
    fontWeight: 800,
  },
  backLink: {
    display: "inline-block",
    color: "#e94560",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "14px",
  },
};
