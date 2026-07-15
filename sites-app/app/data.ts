export type Product = {
  id: string; name: string; slug: string; shade: string; category: string;
  price: number; stock: number; badge: "Nouveau" | "Populaire" | "Édition limitée";
  image: string; summary: string; color: string;
};

export const products: Product[] = [
  { id: "star", name: "Lip Gloss Star", slug: "lip-gloss-star", shade: "Star", category: "Pailleté", price: 8500, stock: 18, badge: "Populaire", image: "/gloss-star-cutout.png", summary: "Un voile nacré aux reflets dorés pour une lumière délicate.", color: "#f7e9e6" },
  { id: "sienna", name: "Lip Gloss Sienna", slug: "lip-gloss-sienna", shade: "Sienna", category: "Rouge", price: 9000, stock: 7, badge: "Nouveau", image: "/gloss-sienna-cutout.png", summary: "Un rouge lumineux, franc et couture, au fini miroir.", color: "#ed2f45" },
  { id: "magic", name: "Lip Gloss Magic", slug: "lip-gloss-magic", shade: "Magic", category: "Transparent", price: 8500, stock: 12, badge: "Édition limitée", image: "/gloss-magic-cutout.png", summary: "Une brillance cristalline qui sublime la couleur naturelle des lèvres.", color: "#ddd3f4" },
];

export const settings = { whatsapp: "22670000000", snapchat: "jawna.gloss", instagram: "jawna.gloss", delivery: "Livraison à Ouagadougou et partout au Burkina Faso" };
export const money = (value: number) => `${new Intl.NumberFormat("fr-FR").format(value)} F CFA`;
export function whatsappUrl(product: Product, quantity = 1) {
  const message = `Bonjour JAWNAH, je souhaite commander le gloss ${product.name}, teinte ${product.shade}, quantité ${quantity}, au prix de ${money(product.price)} (total estimé : ${money(product.price * quantity)}). Est-il toujours disponible ?`;
  return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`;
}
