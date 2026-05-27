import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function CartSidebar() {
  const { cart, loading, isOpen, toggleCart, clearCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const goToCheckout = () => {
    toggleCart();
    navigate("/cart/checkout");
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-full z-[60] flex flex-col p-8 bg-[#381e72] text-error border-l border-error shadow-[0_0_15px_rgba(255,0,0,0.4)] w-80 transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      style={{ fontFamily: "Space Grotesk" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b border-error pb-1">
        <div>
          <h2 className="text-on-surface font-bold text-xl">SUBSURFACE_CART</h2>
          <p className="opacity-70 text-xs">[SYSTEM_READY]</p>
        </div>
        <button onClick={toggleCart} className="text-on-surface-variant hover:text-error transition-all material-symbols-outlined">
          close
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {loading && <p className="text-on-surface-variant text-xs">Cargando...</p>}

        {!loading && cart.length === 0 && (
          <p className="text-on-surface-variant text-xs">[CARRITO_VACÍO]</p>
        )}

        {!loading && cart.map((item) => (
          <div
            key={item.id_item}
            className="flex justify-between items-center p-1 border border-outline-variant hover:border-error transition-all group"
          >
            <span className="material-symbols-outlined">album</span>
            <span className="flex-1 ml-1 text-on-surface text-xs uppercase">
              {item.product?.title}
            </span>
            <span className="text-on-surface-variant text-xs mr-2">
              ${item.product?.price}
            </span>
            <span
              className="material-symbols-outlined group-hover:text-error cursor-pointer"
              onClick={() => removeFromCart(item.id_item)}
            >
              delete_forever
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 space-y-4">
        <button onClick={goToCheckout} className="w-full bg-error text-on-error font-bold py-4 uppercase tracking-widest hover:shadow-[0_0_20px_#ff0000] transition-all">
          EXECUTE_PURCHASE
        </button>
        <button onClick={goToCheckout} className="w-full text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1">
          <span className="material-symbols-outlined">payments</span> CHECKOUT
        </button>
        <button onClick={clearCart} className="w-full text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1">
          <span className="material-symbols-outlined">delete_forever</span> CLEAR
        </button>
      </div>
    </aside>
  );
}