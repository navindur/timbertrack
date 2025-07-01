import { Button, Card, CardContent, Typography } from '@mui/material';

// Define the props for the ProductCard component
type ProductProps = {
  product: any;
  onDelete?: (id: number) => void;
  onEdit?: (product: any) => void;
  showActions?: boolean; 
};

//productCard component to display product details
export default function ProductCard({
  product,
  onDelete,
  onEdit,
  showActions = false,
}: ProductProps) {
  return (
    <Card className="w-full max-w-md shadow-md rounded-2xl p-4 m-2">
      <CardContent>
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
        <Typography variant="h6">{product.name}</Typography>
        <Typography>{product.description}</Typography>
        <Typography>Price: Rs. {product.price}</Typography>
        <Typography>Stock: {product.stock_quantity ?? 'N/A'}</Typography>
        <Typography variant="caption" className="block text-gray-500">
          Category: {product.category_name}
        </Typography>

        {showActions && (
          <div className="flex justify-end mt-4 space-x-2">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => onEdit && onEdit(product)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onDelete && onDelete(product.id)}
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
