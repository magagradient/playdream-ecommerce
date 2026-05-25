import { useState } from "react";
import ProductList from "../components/ProductList";

function ArtistModal({ product, onClose }) {
  if (!product) return null;

  const credit = product.soldCredit;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center px-4" onClick={onClose}>
      <div className="w-full max-w-md border border-[#494551] bg-[#141218] p-8" style={{ fontFamily: "Space Grotesk" }} onClick={e => e.stopPropagation()}>
        
        <div className="flex justify-between items-start mb-6">
          <div className="inline-block px-2 py-1 bg-[#381e72] text-[#e6e0e9] text-xs font-semibold uppercase tracking-[0.5em]">
            ARTISTA
          </div>
          <button onClick={onClose} className="text-[#494551] hover:text-[#ffb4ab] text-xs uppercase tracking-widest transition-colors">
            [CERRAR]
          </button>
        </div>

        <h2 className="text-[28px] font-bold text-[#e6e0e9] uppercase tracking-tighter leading-none mb-2">
          {product.title}
        </h2>

        {credit ? (
          <div className="space-y-4 mt-6">
            {credit.artist_name && (
              <div className="border-l border-[#ffb4ab] pl-4">
                <p className="text-[#cbc4d2] text-xs uppercase tracking-widest mb-1">ARTISTA</p>
                <p className="text-[#e6e0e9] text-sm">{credit.artist_name}</p>
              </div>
            )}
            {credit.artist_bio && (
              <div className="border-l border-[#494551] pl-4">
                <p className="text-[#cbc4d2] text-xs uppercase tracking-widest mb-1">BIO</p>
                <p className="text-[#e6e0e9] text-sm">{credit.artist_bio}</p>
              </div>
            )}
            {credit.music_url && (
              <a href={credit.music_url} target="_blank" rel="noreferrer" className="block w-full py-3 border border-[#ffb4ab] text-[#ffb4ab] text-xs uppercase tracking-widest text-center hover:bg-[#ffb4ab] hover:text-[#690005] transition-all mt-4">
                ESCUCHAR_MUSICA
              </a>
            )}
          </div>
        ) : (
          <p className="text-[#494551] text-xs uppercase tracking-widest mt-6 border-l border-[#494551] pl-4">
            ARTISTA_PENDIENTE
          </p>
        )}

      </div>
    </div>
  );
}

export default function Sold() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleCardClick = async (product) => {
    try {
      const res = await fetch(`http://localhost:3000/api/products/${product.id_product}/sold-credit`);
      const data = await res.json();
      setSelectedProduct({ ...product, soldCredit: data.data });
    } catch (error) {
      setSelectedProduct({ ...product, soldCredit: null });
    }
  };

  return (
    <section className="min-h-screen bg-[#141218] px-16 py-12" style={{ fontFamily: "Space Grotesk" }}>
      <div className="mb-10">
        <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.5em] mb-4">
          ARCHIVO
        </div>
        <h1 className="text-[40px] font-bold text-[#e6e0e9] uppercase tracking-tighter leading-none mb-2">
          OBRAS_VENDIDAS
        </h1>
        <p className="text-[#494551] text-xs uppercase tracking-widest border-l border-[#ffb4ab] pl-4">
          ESTAS OBRAS YA TIENEN DUENO
        </p>
      </div>

      <ProductList isSold={true} onCardClick={handleCardClick} />
      <ArtistModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </section>
  );
}