import { Badge } from "@/components/ui/badge";
import { ProductQueryResponseItem } from "@/lib/seed";

interface ProductCardProps {
  product: ProductQueryResponseItem;
  score?: number;
  showKey?: boolean;
}

export function ProductCard({ product, score, showKey = false }: ProductCardProps) {
  const productData = product.data;
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold">{productData.name}</h3>
        {score !== undefined && (
          <Badge variant="secondary" className="ml-2">
            Score: {score.toFixed(2)}
          </Badge>
        )}
      </div>
      
      {productData.description && (
        <p className="text-sm text-muted-foreground">{productData.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2">
        {productData.category && (
          <Badge variant="outline">{productData.category}</Badge>
        )}
        {productData.price && (
          <Badge variant="outline">${productData.price.toFixed(2)}</Badge>
        )}
        {productData.stock !== undefined && (
          <Badge variant="outline">Stock: {productData.stock}</Badge>
        )}
        {productData.active !== undefined && (
          <Badge variant={productData.active ? "default" : "secondary"}>
            {productData.active ? "Active" : "Inactive"}
          </Badge>
        )}
      </div>
      
      {productData.tags && (
        <p className="text-xs text-muted-foreground">Tags: {productData.tags}</p>
      )}
      
      {showKey && product.key && (
        <p className="text-xs font-mono text-muted-foreground">{product.key}</p>
      )}
    </div>
  );
}
