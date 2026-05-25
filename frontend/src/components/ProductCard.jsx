import { useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { useCart } from "../context/CartContext";
import { useLocation } from "../context/LocationContext";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onCardClick }) {
  const { isFavorite, add, remove } = useFavorites();
  const { toggleCart, addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const { formatPrice } = useLocation();

  if (!product) return null;

  const images = Array.isArray(product.images) ? product.images : [];
  const coverImage = images.find(img => img.image_type === "cover") || images[0] || null;
  const hoverImage = images.find(img => img.image_type !== "cover" && img.id_image !== coverImage?.id_image) || null;
  const coverSrc = coverImage?.image_url || `https://picsum.photos/500/500?random=${product.id_product}`;
  const hoverSrc = hoverImage?.image_url || null;
  const fav = isFavorite(product.id_product);

  const toggleFavorite = () => {
    if (fav) remove(product.id_product);
    else add(product);
  };

  const imageBlock = (
    <div
      className="aspect-square relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={coverSrc}
        alt={product.title || "producto"}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isHovered && hoverSrc ? "opacity-0" : "opacity-100"}`}
      />
      {hoverSrc && (
        <img
          src={hoverSrc}
          alt={product.title || "producto"}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="absolute top-4 left-4 bg-[#141218]/90 text-[#ffb4ab] text-xs px-2 py-1 backdrop-blur-sm border border-[#ffb4ab] uppercase tracking-widest">
        {product.id_product?.toString().padStart(2, "0")}_{product.title?.split(" ")[0]?.toUpperCase()}
      </div>
    </div>
  );

  return (
    <div
      className="group relative bg-[#1d1b20] border border-[#494551] overflow-hidden hover:border-[#ffb4ab] transition-colors"
      style={{ fontFamily: "Space Grotesk" }}
    >
      {onCardClick ? (
        <div onClick={() => onCardClick(product)} className="cursor-pointer">
          {imageBlock}
        </div>
      ) : (
        <Link to={`/products/${product.id_product}`}>
          {imageBlock}
        </Link>
      )}

      <div className="p-4 flex justify-between items-center">
        <div>
          <h3 className="text-[#e6e0e9] font-bold uppercase tracking-tight text-sm mb-1">
            {product.title || "Producto sin nombre"}
          </h3>
          <p className="text-[#cbc4d2] text-xs uppercase">
            {formatPrice(product.price || 0)} // LIC_BASIC
          </p>
          {onCardClick && (
            <button
              onClick={(e) => { e.preventDefault(); onCardClick(product); }}
              className="text-[#381e72] text-xs uppercase tracking-widest hover:text-[#ffb4ab] transition-colors mt-1"
            >
              VER_ARTISTA
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleFavorite}
            className={`w-10 h-10 border flex items-center justify-center transition-all ${fav
              ? "bg-[#381e72] border-[#381e72] text-[#e6e0e9]"
              : "border-[#494551] text-[#cbc4d2] hover:border-[#381e72] hover:text-[#381e72]"
              }`}
          >
            ♥
          </button>
          <button
            onClick={(e) => { e.preventDefault(); addToCart(product.id_product); }}
            className="w-10 h-10 bg-[#ffb4ab] text-[#690005] flex items-center justify-center hover:bg-transparent hover:border hover:border-[#ffb4ab] hover:text-[#ffb4ab] transition-all"
          >
            <span className="material-symbols-outlined text-base">add_shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}