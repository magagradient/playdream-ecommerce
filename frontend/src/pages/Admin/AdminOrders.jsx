import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

export default function AdminOrders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setOrders(data.data || []))
      .finally(() => setLoading(false));
  }, [token]);

  const statusColor = (status) => {
    if (status === "paid") return "bg-[#381e72] text-[#ffb4ab]";
    if (status === "pending") return "bg-[#1d1b20] text-[#cbc4d2]";
    return "bg-[#690005] text-[#ffb4ab]";
  };

  if (loading) return <p className="text-[#cbc4d2] text-xs uppercase tracking-widest">[CARGANDO...]</p>;

  return (
    <div>
      <div className="mb-8">
        <div className="inline-block px-2 py-1 bg-[#ffb4ab] text-[#690005] text-xs font-semibold uppercase tracking-[0.4em] mb-3">
          ADMIN
        </div>
        <h1 className="text-[#e6e0e9] text-3xl font-bold uppercase tracking-tighter">
          ORDENES
        </h1>
        <p className="text-[#494551] text-xs uppercase tracking-widest mt-1">
          // {orders.length} ORDENES EN TOTAL
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {orders.map((o) => (
          <div key={o.id_order} className="border border-[#494551] hover:border-[#ffb4ab]/40 transition-colors">

            <div
              className="flex items-center justify-between px-4 py-3 cursor-pointer"
              onClick={() => setExpanded(expanded === o.id_order ? null : o.id_order)}
            >
              <div className="flex items-center gap-6">
                <span className="text-[#494551] text-xs uppercase tracking-widest w-8">
                  #{o.id_order}
                </span>
                <span className="text-[#e6e0e9] text-xs uppercase tracking-widest">
                  {o.user?.name || "--"}
                </span>
                <span className="text-[#494551] text-xs">
                  {new Date(o.order_date).toLocaleDateString("es-AR")}
                </span>
                <span className="text-[#cbc4d2] text-xs">
                  ${o.total}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs uppercase tracking-widest ${statusColor(o.status)}`}>
                  {o.status}
                </span>
                <span className="text-[#494551] text-xs">
                  {expanded === o.id_order ? "A" : "V"}
                </span>
              </div>
            </div>

            {expanded === o.id_order && (
              <div className="border-t border-[#494551] px-4 py-4 bg-[#1d1b20]">
                <p className="text-[#494551] text-xs uppercase tracking-widest mb-3">
                  // EMAIL: {o.user?.email}
                </p>
                <table className="w-full text-xs uppercase tracking-widest">
                  <thead>
                    <tr className="text-[#494551] border-b border-[#494551]">
                      <th className="text-left py-2 pr-4">Producto</th>
                      <th className="text-left py-2 pr-4">Precio</th>
                      <th className="text-left py-2 pr-4">Artista</th>
                      <th className="text-left py-2">Musica</th>
                    </tr>
                  </thead>
                  <tbody>
                    {o.orderedProducts?.map((p) => (
                      <tr key={p.id_product} className="border-b border-[#494551]/40">
                        <td className="py-2 pr-4 text-[#e6e0e9]">{p.title}</td>
                        <td className="py-2 pr-4 text-[#cbc4d2]">${p.OrdersProducts?.unit_price}</td>
                        <td className="py-2 pr-4 text-[#cbc4d2]">
                          {p.OrdersProducts?.artist_name || <span className="text-[#494551]">--</span>}
                        </td>
                        <td className="py-2 text-[#cbc4d2]">
                          {p.OrdersProducts?.music_url ? (
                            
                            <a href={p.OrdersProducts.music_url} target="_blank" rel="noreferrer" className="text-[#ffb4ab] hover:underline">ABRIR</a>
                          ) : (
                            <span className="text-[#494551]">--</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}