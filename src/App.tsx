import React, { useState, useEffect } from "react";
import "./App.css";

interface Product {
  id: number;
  category: string;
  title: string;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
  image: string;
}

function App(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortType, setSortType] = useState<string>("none");
  const productsPerPage: number = 5;

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((error: Error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const indexOfLastProduct: number = currentPage * productsPerPage;
  const indexOfFirstProduct: number = indexOfLastProduct - productsPerPage;
  const currentProducts: Product[] = products
    .filter((product) =>
      categoryFilter === "all" ? true : product.category === categoryFilter
    )
    .sort((a, b) => {
      if (sortType === "price_asc") {
        return a.price - b.price;
      } else if (sortType === "price_desc") {
        return b.price - a.price;
      } else if (sortType === "rating_asc") {
        return a.rating.rate - b.rating.rate;
      } else if (sortType === "rating_desc") {
        return b.rating.rate - a.rating.rate;
      } else {
        return 0;
      }
    })
    .slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (direction: string): void => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage: number) => prevPage - 1);
    } else if (
      direction === "next" &&
      currentPage < Math.ceil(products.length / productsPerPage)
    ) {
      setCurrentPage((prevPage: number) => prevPage + 1);
    }
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setCategoryFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    setSortType(event.target.value);
    setCurrentPage(1); 
  };

  return (
    <div>
      <div>
        <h2>merhba bikom andna</h2>
        <div>
          <label htmlFor="category">Category:    </label>
          <select
            id="category"
            value={categoryFilter}
            onChange={handleCategoryChange}
          >
            <option value="all">All</option>
            {[
              ...new Set(products.map((product: Product) => product.category)),
            ].map((category: string) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
        
          <label htmlFor="sort">           Sort by:   </label>
          <select id="sort" value={sortType} onChange={handleSortChange}>
            <option value="none">None</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_asc">Rating: Low to High</option>
            <option value="rating_desc">Rating: High to Low</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Price</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product: Product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.image}
                    alt={product.title}
                    style={{ width: "100px",height: "100px" }}
                  />
                </td>
                <td>{product.title}</td>
                <td>${product.price}</td>
                <td>{product.rating.rate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => paginate("prev")}>{"<"}</button>
          <span>{currentPage}</span>
          <button onClick={() => paginate("next")}>{">"}</button>
        </div>
      </div>
    </div>
  );
}

export default App;
