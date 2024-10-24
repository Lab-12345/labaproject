import React, { useState } from 'react';
import './Home.css';
import Header from '../../Components/Header/Header';
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay';
import AppDownload from '../../Components/AppDownload/AppDownload';


const Home = () => {
    const [category, setCategory] = useState('All'); // Initialize category state

    return (
        <div>
            <Header />
            <ExploreMenu category={category} setCategory={setCategory} /> {/* Fixed prop naming */}
            <FoodDisplay category={category} />
            <AppDownload/>
        </div>
    );
};

export default Home;
