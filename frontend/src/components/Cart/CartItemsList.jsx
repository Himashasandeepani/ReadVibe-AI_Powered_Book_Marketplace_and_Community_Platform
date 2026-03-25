import React from "react";
import { Card } from "react-bootstrap";
import CartItem from "./CartItem";

const CartItemsList = ({ cart, books, onRemoveItem, onUpdateQuantity }) => {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const resolveBook = (item) => {
    const fromCatalog = books.find((b) => b.id === item.id);
    if (fromCatalog) return fromCatalog;

    // Fallback to item data when catalog is stale/missing
    return {
      id: item.id,
      title: item.title || "Unknown Book",
      author: item.author || "Unknown Author",
      price: item.price || 0,
      image:
        item.image ||
        "https://via.placeholder.com/200x300/DBEAFE/1E3A5F?text=Book+Cover",
      stock: item.stock,
      inStock: item.stock === undefined ? true : item.stock > 0,
    };
  };

  return (
    <Card className="cart-items-container">
      <Card.Body>
        <h4>Cart Items ({itemCount} items)</h4>
        <div id="cartItemsList">
          {cart.map((item) => {
            const book = resolveBook(item);
            return (
              <CartItem
                key={item.id}
                item={item}
                book={book}
                onRemove={onRemoveItem}
                onUpdateQuantity={onUpdateQuantity}
              />
            );
          })}
        </div>
      </Card.Body>
    </Card>
  );
};

export default CartItemsList;
