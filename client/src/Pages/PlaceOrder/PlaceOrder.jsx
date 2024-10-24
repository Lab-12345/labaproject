import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../Components/Context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", street: "", city: "", state: "", zipcode: "", country: "", phone: ""
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setLoading(true);

    const orderItems = Object.keys(cartItems).map(itemId => {
      const item = food_list.find(food => food._id === itemId);
      return { id: itemId, name: item.name, quantity: cartItems[itemId], price: item.price };
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,  // Adding delivery fee of 2
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        console.log("Order placed successfully:", response.data);

        if (response.data.session_url) {
          // Redirect to Stripe checkout session
          window.location.href = response.data.session_url;
        } else {
          navigate('/order-confirmation');
        }
      } else {
        alert('Error: Unable to place order.');
      }
    } catch (error) {
      console.error("Unable to place order:", error.message);
      alert('An error occurred while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate('/cart');  // Redirect to cart if no items or not logged in
    }
  }, [token, getTotalCartAmount, navigate]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-detail">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-detail">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit' disabled={loading || getTotalCartAmount() === 0 || !token}>
            {loading ? 'Processing...' : 'PROCEED TO PAYMENT'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
