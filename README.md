# Repositorio Preparcial Y parcial
## Juan Felipe Ochoa - 202320053

### Como correr
* Estar en carpeta ../shophub-proyecto/shophub -> cd shophub-proyecto/shophub
* Instalar npm -> Comando **npm install** en consola
* Correr aplicación -> comnado **npm run dev** en consola
* Acceder a http://localhost:3000/ para ver aplicación


### Preguntas Parcial

#### 1. (Evolución del Contexto)
Al *CartContext* se le agregaron dos funciones nuevas: *removeFromCart(id)*, que quita un producto del carrito, y *clearCart()*, que lo vacía por completo. Ambas se declaran en la interface *CartContextType*, se implementan dentro del *CartProvider* y se exponen en el *value* del Provider, así cualquier componente puede usarlas con el hook *useCart()*. Para mantener la inmutabilidad nunca se modifica el array original: *removeFromCart* usa **filter()**, que retorna un array nuevo sin el producto con ese *id*, y *clearCart* llama a *setCart([])* con un array vacío nuevo. De esta forma React detecta el cambio de estado y vuelve a renderizar los componentes que dependen del carrito.

#### 2. (Cálculo de Totales)
Los totales se calculan en el *CartContext* con dos funciones: *getTotal()*, que devuelve el precio total, y *getQuantity()*, que devuelve la cantidad total de unidades. Las dos usan **reduce()** sobre el array *cart*, empezando en 0: *getTotal* suma `item.price * item.quantity` de cada producto y *getQuantity* suma solo `item.quantity`. Se calculan a partir del estado en cada render en lugar de guardarse en otro *useState*, así siempre están sincronizados con el carrito y no hay que actualizarlos a mano cada vez que se agrega o quita un producto.

#### 3. (Arquitectura del Formulario)
Se creó un contexto aparte, *CheckoutContext*, que guarda el estado del formulario (*form*, *touched*, *isSubmitting*, *completedOrder*) y expone *handleChange*, *handleBlur*, *submitCheckout* y *resetCheckout*. La página `/checkout` solo consume ese contexto con *useCheckout()* y pinta los inputs, así la lógica queda separada de la vista. La validación se hace con la función *validateCheckout*, que se recalcula en cada render a partir del *form* (nombre mínimo 5 caracteres, correo válido con regex y aceptar términos); el botón "Confirmar pedido" se deshabilita mientras haya errores, se esté enviando o el carrito esté vacío, y los errores solo se muestran cuando el campo ya fue tocado (*onBlur*). Al enviar, *submitCheckout* hace *preventDefault()*, simula el envío al servidor con una promesa de 2s, guarda el pedido en *completedOrder*, llama a *clearCart()* del *CartContext* y reinicia el formulario. *CheckoutProvider* va dentro de *CartProvider* en el layout porque necesita leer el carrito con *useCart()*.
