import { notFound } from "next/navigation";
import { products } from "../../data";
import { ProductDetail } from "../../components/product-detail";
import { PageShell } from "../../components/site-chrome";

export function generateStaticParams() { return products.map(product => ({ slug: product.slug })); }
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const product = products.find(item => item.slug === slug); if (!product) notFound();
  return <PageShell><ProductDetail product={product}/></PageShell>;
}
