import { useContext } from 'react';
import Modal from './UI/Modal.jsx';
import CartContext from '../context/CartContext.jsx';
import { currencyFormatter } from '../util/formatting';
import Button from './UI/Button.jsx';
import UserProgressContext from '../context/UserProgressContext.jsx';
import CartItem from './CartItem.jsx';

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const cartTotal = cartCtx.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  function closeModal() {
    userProgressCtx.hideCart();
  }

  function goToCheckout() {
    userProgressCtx.showCheckout();
  }

  return (
    <Modal
      className="cart"
      onClose={userProgressCtx.userProgress === 'cart' ? closeModal : null}
      open={userProgressCtx.userProgress === 'cart'}
    >
      <h2>Your Cart</h2>
      <ul>
        {cartCtx.items.map((item) => (
          <CartItem
            key={item.id}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            onDecrease={() => cartCtx.removeItem(item.id)}
            onIncrease={() => cartCtx.addItem(item)}
          />
        ))}
      </ul>
      <p className="cart-total">{currencyFormatter.format(cartTotal)}</p>
      <p className="modal-actions">
        <Button textOnly onClick={closeModal}>
          Close
        </Button>
        {cartCtx.items.length > 0 && (
          <Button onClick={goToCheckout}>Go to Checkout</Button>
        )}
      </p>
    </Modal>
  );
}
