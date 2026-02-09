import ProductList from "@/components/products/ProductList";
import { getProducts } from "@/lib/api";

export default async function ProductsPage() {
  const data = await getProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-700">
        Productos de Ahorro
      </h1>
      <p className="mt-2 text-slate-500">
        Explora nuestras cuentas de ahorro y encuentra la que mejor se adapte a
        tus necesidades.
      </p>

      <div className="mt-8">
        <ProductList products={data} />
      </div>
    </div>
  );
}
