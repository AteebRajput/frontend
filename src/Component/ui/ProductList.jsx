import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../redux/productSlice';
import ProductCard from './ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    // Assuming you have the user ID from authentication context or redux store
    const userId = localStorage.getItem('userId');
    dispatch(fetchAllProducts(userId));
  }, [dispatch]);

  const handleBid = (product) => {
    // Implement bid logic
    console.log('Bidding on product:', product);
  };

  const handlePurchase = (product) => {
    // Implement purchase logic
    console.log('Purchasing product:', product);
  };

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory ? product.category === filterCategory : true)
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'price-asc':
          return a.basePrice - b.basePrice;
        case 'price-desc':
          return b.basePrice - a.basePrice;
        case 'date':
          return new Date(b.harvestDate) - new Date(a.harvestDate);
        default:
          return 0;
      }
    });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex space-x-4">
        <Input 
          placeholder="Search products..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        
        <Select onValueChange={setFilterCategory} value={filterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select onValueChange={setSortBy} value={sortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Default</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="date">Harvest Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && <div>Loading products...</div>}
      {error && <div>Error: {error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product._id} 
            product={product} 
            onBid={handleBid}
            onPurchase={handlePurchase}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center text-gray-500 mt-10">
          No products found
        </div>
      )}
    </div>
  );
};

export default ProductList;