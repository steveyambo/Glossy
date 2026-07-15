import { sql } from "drizzle-orm";
import { integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

const timestamps = {
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};

export const users = sqliteTable("users", {
  id: text("id").primaryKey(), email: text("email").notNull(), firstName: text("first_name"), lastName: text("last_name"), phone: text("phone"), avatarUrl: text("avatar_url"), role: text("role", { enum:["CLIENT","ADMIN"] }).notNull().default("CLIENT"), ...timestamps,
}, table => [uniqueIndex("users_email_idx").on(table.email)]);

export const productCategories = sqliteTable("product_categories", {
  id: integer("id").primaryKey({ autoIncrement:true }), name: text("name").notNull(), slug: text("slug").notNull(), ...timestamps,
}, table => [uniqueIndex("categories_slug_idx").on(table.slug)]);

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement:true }), name: text("name").notNull(), slug: text("slug").notNull(), shade: text("shade").notNull(), description: text("description").notNull().default(""), price: real("price").notNull(), stockQuantity: integer("stock_quantity").notNull().default(0), lowStockThreshold: integer("low_stock_threshold").notNull().default(8), status: text("status", { enum:["ACTIVE","INACTIVE","ARCHIVED"] }).notNull().default("ACTIVE"), categoryId: integer("category_id").references(()=>productCategories.id), badge: text("badge"), imageUrl: text("image_url"), videoUrl: text("video_url"), model3DUrl: text("model_3d_url"), displayOrder: integer("display_order").notNull().default(0), ...timestamps,
}, table => [uniqueIndex("products_slug_idx").on(table.slug)]);

export const productImages = sqliteTable("product_images", {
  id: integer("id").primaryKey({ autoIncrement:true }), productId: integer("product_id").notNull().references(()=>products.id,{onDelete:"cascade"}), url: text("url").notNull(), alt: text("alt").notNull().default(""), displayOrder: integer("display_order").notNull().default(0), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const favorites = sqliteTable("favorites", {
  id: integer("id").primaryKey({ autoIncrement:true }), userId: text("user_id").notNull().references(()=>users.id,{onDelete:"cascade"}), productId: integer("product_id").notNull().references(()=>products.id,{onDelete:"cascade"}), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
}, table => [uniqueIndex("favorites_user_product_idx").on(table.userId,table.productId)]);

export const sales = sqliteTable("sales", {
  id: integer("id").primaryKey({ autoIncrement:true }), customerId: text("customer_id").references(()=>users.id), customerName: text("customer_name").notNull(), channel: text("channel", { enum:["WHATSAPP","SNAPCHAT"] }).notNull(), status: text("status", { enum:["NEW","CONFIRMED","PREPARING","DELIVERED","CANCELLED"] }).notNull().default("NEW"), total: real("total").notNull().default(0), adminComment: text("admin_comment"), stockDeducted: integer("stock_deducted",{mode:"boolean"}).notNull().default(false), ...timestamps,
});

export const saleItems = sqliteTable("sale_items", {
  id: integer("id").primaryKey({ autoIncrement:true }), saleId: integer("sale_id").notNull().references(()=>sales.id,{onDelete:"cascade"}), productId: integer("product_id").notNull().references(()=>products.id), quantity: integer("quantity").notNull(), unitPrice: real("unit_price").notNull(),
});

export const stockMovements = sqliteTable("stock_movements", {
  id: integer("id").primaryKey({ autoIncrement:true }), productId: integer("product_id").notNull().references(()=>products.id), saleId: integer("sale_id").references(()=>sales.id), type: text("type", { enum:["IN","OUT","ADJUSTMENT","RESTORE"] }).notNull(), quantity: integer("quantity").notNull(), note: text("note"), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement:true }), userId: text("user_id").references(()=>users.id), productId: integer("product_id").notNull().references(()=>products.id), firstName: text("first_name").notNull(), rating: integer("rating").notNull(), content: text("content").notNull(), isPublished: integer("is_published",{mode:"boolean"}).notNull().default(false), ...timestamps,
});

export const siteSettings = sqliteTable("site_settings", {
  key: text("key").primaryKey(), value: text("value").notNull(), updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
