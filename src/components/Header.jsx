import imgLogo from '../assets/logo.jpg';
import Button from './UI/Button';
import { useContext } from 'react';
import CartContext from '../context/CartContext.jsx';
import UserProgressContext from '../context/UserProgressContext.jsx';

export default function Header() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartItems = cartCtx.items.reduce((acc, item) => acc + item.quantity, 0);

  function handleShowCart() {
    userProgressCtx.showCart();
  }
  return (
    <header id="main-header">
      <div id="title">
        <img src={imgLogo} alt="A restaurant logo" />
        <h1>Z'FOOD</h1>
      </div>
      <nav>
        <Button textOnly onClick={handleShowCart}>
          Card ({cartItems})
        </Button>
      </nav>
    </header>
  );
}
