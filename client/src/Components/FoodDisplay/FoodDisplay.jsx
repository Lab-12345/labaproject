import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          if (category === 'All' || category === item.category) {
            return (
              <FoodItem
                key={item._id} // using _id as key instead of index (more unique)
                id={item._id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            );
          }
          return null; // explicitly return null when condition is not met
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
