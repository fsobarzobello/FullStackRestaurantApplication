import React, { useState } from "react";

const AppContext = React.createContext({
  isAuthenticated: false,
  cart: { items: [], total: 0 },
  addItem: () => {},
  removeItem: () => {},
  user: null,
  setUser: () => {},
});

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [user, setUser] = useState(null);

  // Agregar un plato al carrito
  const addItem = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((i) => i.id === item.id);
      if (existingItem) {
        // Incrementa la cantidad si ya existe
        existingItem.quantity += 1;
      } else {
        // Agrega un nuevo elemento al carrito
        prevCart.items.push({ ...item, quantity: 1 });
      }
      // Actualiza el total del carrito
      const total = prevCart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      return { items: [...prevCart.items], total };
    });
  };

  // Eliminar un plato del carrito
  const removeItem = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.items.find((i) => i.id === item.id);
      if (existingItem) {
        if (existingItem.quantity > 1) {
          // Decrementa la cantidad si es mayor a 1
          existingItem.quantity -= 1;
        } else {
          // Elimina el elemento del carrito si la cantidad es 1
          prevCart.items = prevCart.items.filter((i) => i.id !== item.id);
        }
      }
      // Actualiza el total del carrito
      const total = prevCart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
      return { items: [...prevCart.items], total };
    });
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated: !!user,
        cart,
        addItem,
        removeItem,
        user,
        setUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
