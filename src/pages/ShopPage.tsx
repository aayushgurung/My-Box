import { useEffect, useState } from 'react';
import { ArrowDown, Check, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import { formatPrice, products } from '../data/products';
export default function ShopPage() {
  const [category, setCategory] = useState<'all' | 'boxes' | 'tickets'>('all');
  const [cart, setCart] = useState<Record<string, number>>(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem('mybox-shop-basket') || '{}');
      return Object.fromEntries(products.map(product => [product.id, Math.min(99, Math.max(0, Math.floor(Number(stored?.[product.id]) || 0)))]));
    } catch { return {}; }
  });
  useEffect(() => {
    try { sessionStorage.setItem('mybox-shop-basket', JSON.stringify(cart)); } catch { /* The basket still works if storage is unavailable. */ }
  }, [cart]);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(''), 4000);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const items = products.filter(product => (cart[product.id] || 0) > 0);
  const count = Object.values(cart).reduce((sum, amount) => sum + amount, 0);
  const total = items.reduce((sum, item) => sum + item.price * cart[item.id], 0);
  const adjust = (id: string, amount: number) => { setCart(current => ({ ...current, [id]: Math.min(99, Math.max(0, (current[id] || 0) + amount)) })); setNotice(''); };
  return <><section className="public-shop-hero"><div><span className="eyebrow"><span className="eyebrow-dot" />THE MYBOX COLLECTION</span><h1>A place to receive.<br /><em>A simple way to send.</em></h1><p>Make room for deliveries with a parcel box, or get ready to send with a delivery ticket. Your everyday essentials, together.</p><a href="#collection" className="text-button">Find your next essential <ArrowDown size={17} /></a></div><div className="public-shop-mark" aria-hidden="true"><ShoppingBag size={90} strokeWidth={1} /><span>Small things.<br /><strong>Simpler days.</strong></span></div></section><section className="public-shop-section" id="collection"><div className="public-shop-heading"><div><span className="eyebrow">CHOOSE WHAT WORKS FOR YOU</span><h2>Delivery essentials.</h2></div><a href="#basket" className="public-basket-link"><ShoppingBag size={18} />Your basket<span>{count}</span></a></div><p className="public-shop-preview">Sample products and GBP prices for this university project. Orders and payments are not enabled.</p><div className="public-shop-filters" role="group" aria-label="Filter products">{([{ key: 'all', label: 'All essentials' }, { key: 'boxes', label: 'Parcel boxes' }, { key: 'tickets', label: 'Delivery tickets' }] as const).map(item => <button key={item.key} aria-pressed={category === item.key} onClick={() => setCategory(item.key)}>{item.label}</button>)}</div><div className="public-shop-layout"><div className="public-product-grid">{products.filter(product => category === 'all' || product.category === category).map(product => <ProductCard key={product.id} product={product} onAdd={() => { adjust(product.id, 1); setNotice(`${product.name} added to your basket.`); }} />)}</div><aside className="public-basket" id="basket"><div className="public-basket-heading"><ShoppingBag size={20} /><h2>Your basket</h2><span>{count}</span></div>{!items.length ? <div className="public-basket-empty"><ShoppingBag size={35} strokeWidth={1} /><h3>A little room for something useful.</h3><p>Add a parcel box or delivery ticket to start your selection.</p></div> : <><ul className="public-basket-items">{items.map(product => <li key={product.id}><div><strong>{product.name}</strong><span>{formatPrice(product.price * cart[product.id])}</span></div><div className="public-basket-item-controls"><div className="public-quantity"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => adjust(product.id, -1)}><Minus size={13} /></button><span aria-label={`${product.name} quantity`}>{cart[product.id]}</span><button aria-label={`Increase ${product.name} quantity`} disabled={cart[product.id] >= 99} onClick={() => adjust(product.id, 1)}><Plus size={13} /></button></div><button className="public-remove" aria-label={`Remove ${product.name}`} onClick={() => setCart(current => ({ ...current, [product.id]: 0 }))}><Trash2 size={14} /></button></div></li>)}</ul><div className="public-basket-total"><span>Sample subtotal</span><strong>{formatPrice(total)}</strong></div><p className="public-basket-disclaimer">Shipping and any applicable taxes are not calculated. This basket is a preview; nothing is ordered or charged.</p><button className="public-clear-basket" onClick={() => { setCart({}); setNotice('Basket cleared.'); }}>Clear basket</button></>}<div className="public-basket-footnote"><Check size={15} />Find what fits your delivery routine.</div></aside></div><p className="public-cart-notice" role="status">{notice}</p></section><section className="public-shop-help"><span className="eyebrow">A LITTLE CLARITY</span><h2>Boxes to receive.<br /><em>Tickets to send.</em></h2><div><article><h3>What's a parcel box?</h3><p>A designated place at your home for incoming parcels. Choose the size that suits your delivery routine.</p></article><article><h3>What's a delivery ticket?</h3><p>A ticket represents a delivery service. Service availability, parcel limits and final terms will be confirmed before sales launch.</p></article></div></section></>;
}

