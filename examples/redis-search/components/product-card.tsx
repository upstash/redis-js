import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: any;
  score?: string;
  showKey?: boolean;
}

export function ProductCard({ product, score, showKey = false }: ProductCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-2">
      <div className="flex items-start justify-between">
        <h3 className="font-semibold">{product.name}</h3>
        {score && (
          <Badge variant="secondary" className="ml-2">
            Score: {parseFloat(score).toFixed(2)}
          </Badge>
        )}
      </div>
      
      {product.description && (
        <p className="text-sm text-muted-foreground">{product.description}</p>
      )}
      
      <div className="flex flex-wrap gap-2">
        {product.category && (
          <Badge variant="outline">{product.category}</Badge>
        )}
        {product.price && (
          <Badge variant="outline">${product.price.toFixed(2)}</Badge>
        )}
        {product.stock !== undefined && (
          <Badge variant="outline">Stock: {product.stock}</Badge>
        )}
        {product.active !== undefined && (
          <Badge variant={product.active ? "default" : "secondary"}>
            {product.active ? "Active" : "Inactive"}
          </Badge>
        )}
      </div>
      
      {product.tags && (
        <p className="text-xs text-muted-foreground">Tags: {product.tags}</p>
      )}
      
      {showKey && product.key && (
        <p className="text-xs font-mono text-muted-foreground">{product.key}</p>
      )}
    </div>
  );
}
