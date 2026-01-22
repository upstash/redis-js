import { redis } from "@/lib/redis";
import { QueryResult, s } from "@upstash/redis";

// Define the schema for our product search index
export const productSchema = s.object({
  name: s.string(),
  description: s.string(),
  category: s.string().noTokenize(),
  price: s.number("F64"),
  stock: s.number("U64"),
  active: s.boolean(),
  tags: s.string(),
});

export type ProductQueryResponseItem = QueryResult<typeof productSchema>

export type Product = ProductQueryResponseItem["data"];


// Sample products data
export const sampleProducts: Product[] = [
  {
    name: "MacBook Pro 16",
    description: "Powerful laptop with M3 Max chip for professionals",
    category: "laptops",
    price: 2499.99,
    stock: 25,
    active: true,
    tags: "apple mac professional development",
  },
  {
    name: "Dell XPS 15",
    description: "High-performance Windows laptop with stunning display",
    category: "laptops",
    price: 1899.99,
    stock: 30,
    active: true,
    tags: "dell windows professional",
  },
  {
    name: "Wireless Mouse MX Master 3",
    description: "Ergonomic wireless mouse for professionals",
    category: "accessories",
    price: 99.99,
    stock: 150,
    active: true,
    tags: "logitech wireless ergonomic",
  },
  {
    name: "Mechanical Keyboard K95",
    description: "RGB mechanical gaming keyboard with Cherry MX switches",
    category: "accessories",
    price: 199.99,
    stock: 75,
    active: true,
    tags: "corsair mechanical gaming rgb",
  },
  {
    name: "USB-C Hub Pro",
    description: "7-in-1 USB-C hub with HDMI and ethernet",
    category: "accessories",
    price: 49.99,
    stock: 200,
    active: true,
    tags: "usb-c hub adapter connectivity",
  },
  {
    name: "4K Monitor 32 inch",
    description: "Ultra HD 4K monitor with HDR support",
    category: "monitors",
    price: 499.99,
    stock: 40,
    active: true,
    tags: "display 4k hdr productivity",
  },
  {
    name: "Ultrawide Monitor 34",
    description: "Curved ultrawide monitor perfect for multitasking",
    category: "monitors",
    price: 799.99,
    stock: 20,
    active: true,
    tags: "ultrawide curved multitasking",
  },
  {
    name: "Webcam HD Pro",
    description: "1080p webcam with auto-focus and noise cancellation",
    category: "accessories",
    price: 79.99,
    stock: 100,
    active: true,
    tags: "webcam video conference streaming",
  },
  {
    name: "Gaming Laptop RTX 4080",
    description: "High-end gaming laptop with RTX 4080 graphics",
    category: "laptops",
    price: 2799.99,
    stock: 15,
    active: true,
    tags: "gaming nvidia rtx performance",
  },
  {
    name: "Portable SSD 2TB",
    description: "Fast portable SSD with USB-C connectivity",
    category: "storage",
    price: 199.99,
    stock: 80,
    active: true,
    tags: "storage ssd portable fast",
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Premium wireless headphones with active noise cancellation",
    category: "audio",
    price: 349.99,
    stock: 60,
    active: true,
    tags: "sony wireless anc audio",
  },
  {
    name: "Desktop Speakers 2.1",
    description: "Powerful desktop speakers with subwoofer",
    category: "audio",
    price: 149.99,
    stock: 45,
    active: true,
    tags: "speakers audio music",
  },
  {
    name: "Refurbished MacBook Air",
    description: "Certified refurbished MacBook Air M1",
    category: "laptops",
    price: 899.99,
    stock: 10,
    active: false,
    tags: "apple mac refurbished budget",
  },
  {
    name: "Budget Mouse",
    description: "Simple wired mouse for everyday use",
    category: "accessories",
    price: 9.99,
    stock: 500,
    active: true,
    tags: "budget basic wired",
  },
  {
    name: "Gaming Headset RGB",
    description: "Surround sound gaming headset with RGB lighting",
    category: "audio",
    price: 129.99,
    stock: 90,
    active: true,
    tags: "gaming rgb surround headset",
  },
];

export async function seedDatabase() {
  const logs: string[] = [];
  
  try {
    logs.push("🚀 Starting database seeding...");
    
    // Create or recreate the index
    logs.push("📝 Creating search index...");
    const index = await redis.search.createIndex({
      name: "products-idx",
      schema: productSchema,
      dataType: "string", // Using string data type
      prefix: "product:",
      language: "english",
      existsOk: true, // Don't error if already exists
    });
    
    logs.push("✅ Index created/verified: products-idx");
    
    // Insert products
    logs.push(`📦 Inserting ${sampleProducts.length} products...`);
    let insertedCount = 0;
    
    for (let i = 0; i < sampleProducts.length; i++) {
      const product = sampleProducts[i];
      const key = `product:${i + 1}`;
      
      // Using string data type, we store as JSON string
      await redis.set(key, JSON.stringify(product));
      insertedCount++;
    }
    
    logs.push(`✅ Inserted ${insertedCount} products`);
    
    // Wait for indexing to complete
    logs.push("⏳ Waiting for indexing to complete...");
    await index.waitIndexing();
    logs.push("✅ Indexing completed");
    
    logs.push("🎉 Database seeding completed successfully!");
    
    return {
      success: true,
      logs,
    };
  } catch (error) {
    logs.push(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
    return {
      success: false,
      logs,
    };
  }
}
