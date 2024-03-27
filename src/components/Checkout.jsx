import { useContext } from 'react';
import Modal from './UI/Modal.jsx';
import UserProgressContext from '../context/UserProgressContext.jsx';
import CartContext from '../context/CartContext.jsx';
import { currencyFormatter } from '../util/formatting.js';
import Input from './UI/Input.jsx';
import Button from './UI/Button.jsx';
import useHttp from '../hooks/useHttp.jsx';
import Error from './Error.jsx';

const requestConfig = {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
};

export default function Checkout() {
  const userProgressCtx = useContext(UserProgressContext);
  const cartCtx = useContext(CartContext);

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp('https://foodbackend-z.vercel.app/orders', requestConfig);

  const cartTotal = cartCtx.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  function closeModal() {
    userProgressCtx.hideCheckout();
  }

  function handleFinish() {
    userProgressCtx.hideCheckout();
    cartCtx.clearCart();
    clearData();
  }

  function handleSubmitOrder(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());
    sendRequest(
      JSON.stringify({
        order: {
          customer: customerData,
          items: cartCtx.items,
        },
      })
    );
  }

  let actions = (
    <>
      <Button textOnly type="button" onClick={closeModal}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal
        open={userProgressCtx.userProgress === 'checkout'}
        onClose={closeModal}
      >
        <h2>Order submitted successfully !</h2>
        <p>Thank you for your order.</p>
        <p>
          We will get back to you with more details via email within the next
          few minutes
        </p>

        <p>Enjoy your meal !</p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      className="checkout"
      open={userProgressCtx.userProgress === 'checkout'}
      onClose={closeModal}
    >
      <form onSubmit={handleSubmitOrder}>
        <h2>Checkout</h2>
        <p>Total amount : {currencyFormatter.format(cartTotal)}</p>

        <Input label="Full Name" type="text" id="name" />
        <Input label="Email Adress" type="email" id="email" />
        <Input label="Street" type="text" id="street" />
        <div className="control-row">
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>
        {error && <Error title="Failed to submit order !" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
