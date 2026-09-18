# Repositorio Preparcial Y parcial
## Juan Felipe Ochoa - 202320053

### Como correr
* Estar en carpeta ../shophub-proyecto/shophub -> cd shophub-proyecto/shophub
* Instalar npm -> Comando **npm install** en consola
* Correr aplicación -> comnado **npm run dev** en consola
* Acceder a http://localhost:3000/ para ver aplicación


### Preguntas Parcial

#### 1. (Evolución del Contexto)
Se añadieron los contextos *removeFromCart*, *clearCart*, donde permiten quitar productos de carrito y vaciar el carrito. Al usar el *{useState}* en el page general y utilizando  *{useCart}* en el page del carrito se puede asegurar la inmutabilidad, para eso funciona el controler

#### 2. (Cálculo de Totales)
Para el cálculo de Totales se manejó desde el CarContext, acá con las dos const *getTotal* y *getQuantity* se logró conseguir estos valores buscados. Se utilizó la función **reduce()** para poder irle sumando al contador (en el caso de cantidad) o suma (en el caso de precio) cada vez que se añadiera un item distinto.

#### 3. (Arquitectura del Formulario)
Se creó un contexto aparte, *CheckoutContext*, que guarda el estado del formulario (*form*, *touched*, *isSubmitting*, *completedOrder*) y expone *handleChange*, *handleBlur*, *submitCheckout* y *resetCheckout*. La página `/checkout` solo consume ese contexto con *useCheckout()* y pinta los inputs, así la lógica queda separada de la vista. La validación se hace con la función *validateCheckout*, que se recalcula en cada render a partir del *form* (nombre mínimo 5 caracteres, correo válido con regex y aceptar términos); el botón "Confirmar pedido" se deshabilita mientras haya errores, se esté enviando o el carrito esté vacío, y los errores solo se muestran cuando el campo ya fue tocado (*onBlur*). Al enviar, *submitCheckout* hace *preventDefault()*, simula el envío al servidor con una promesa de 2s, guarda el pedido en *completedOrder*, llama a *clearCart()* del *CartContext* y reinicia el formulario. *CheckoutProvider* va dentro de *CartProvider* en el layout porque necesita leer el carrito con *useCart()*.
