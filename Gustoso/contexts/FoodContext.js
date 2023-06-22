import React, { createContext } from 'react';

const FoodContext = createContext();

const FoodContextProvider = ({ children }) => {
  const foodCategories = [
    'Poultry',
    'Seafood',
    'Eggs',
    'Dairy',
    'Cooked leftovers',
    'Drinks',
    'Fruits and Vegetables',
    'Canned Food',
  ];

  return (
    <FoodContext.Provider value={{ foodCategories }}>
      {children}
    </FoodContext.Provider>
  );
};

export { FoodContext, FoodContextProvider };