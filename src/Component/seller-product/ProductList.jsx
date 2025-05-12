import { Button } from "../ui/product-ui/Button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/product-ui/Card"
import { Trash2, Edit } from "lucide-react"

export default function ProductList({ products, onProductClick, onUpdateClick, onDeleteProduct }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
          </CardHeader>
          <CardContent onClick={() => onProductClick(product)}>
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover mb-4 rounded"
            />
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <p className="font-bold">
              ${product.basePrice} / {product.unit}
            </p>
            <p className="text-sm">
              Quantity: {product.quantity} {product.unit}
            </p>
            <p className="text-sm">Status: {product.status}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => onUpdateClick(product)}>
              <Edit className="w-4 h-4 mr-2" /> Update
            </Button>
            <Button variant="destructive" onClick={() => onDeleteProduct(product.id)}>
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

