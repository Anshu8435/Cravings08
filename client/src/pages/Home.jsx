import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MdRestaurant, MdLocalDining, MdFastfood, MdCake, MdLunchDining } from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import api from '../config/ApiConfig';

import HeroSection from '../components/home/HeroSection';
import FoodCategories3D from '../components/home/FoodCategories3D';
import SignatureDishesShowcase from '../components/home/SignatureDishesShowcase';
import RestaurantsGrid from '../components/home/RestaurantsGrid';
import TrendingCollection from '../components/home/TrendingCollection';
import SpecialOffersSection from '../components/home/SpecialOffersSection';
import WhyChooseCravings from '../components/home/WhyChooseCravings';
import BrandStorySection from '../components/home/BrandStorySection';
import CustomerFeedbackSection from '../components/home/CustomerFeedbackSection';
import CTASection from '../components/home/CTASection';

const Home = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const handleNavigateToDashboard = () => {
    if (role === 'restaurant') {
      navigate('/restaurant-dashboard', { state: { activeTab: 'settings' } });
    } else if (role === 'rider') {
      navigate('/rider-dashboard', { state: { activeTab: 'settings' } });
    } else if (role === 'admin') {
      navigate('/admin-dashboard', { state: { activeTab: 'settings' } });
    } else {
      navigate('/customer-dashboard', { state: { activeTab: 'settings' } });
    }
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'all';

  const setSearchQuery = (value) => {
    setSearchParams((prev) => {
      if (value) prev.set('search', value);
      else prev.delete('search');
      return prev;
    });
  };

  const setSelectedCategory = (value) => {
    setSearchParams((prev) => {
      if (value && value !== 'all') prev.set('category', value);
      else prev.delete('category');
      return prev;
    });
  };

  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('restaurants'); // 'feed' or 'restaurants'

  const categories = [
    { id: 'all', label: 'All', icon: MdRestaurant },
    { id: 'veg', label: 'Vegetarian', icon: MdLocalDining },
    { id: 'nonveg', label: 'Non-Veg', icon: MdFastfood },
    { id: 'dessert', label: 'Desserts', icon: MdCake },
    { id: 'others', label: 'Others', icon: MdLunchDining },
  ];

  // Load restaurants from API
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const response = await api.get('/public/restaurants');

        const formattedRestaurants = response.data.data.map((restaurant) => ({
          id: restaurant._id,
          name: restaurant.restaurantName,
          description:
            restaurant.description || `${restaurant.cuisineType} cuisine in ${restaurant.city}`,
          rating: restaurant.averageRating || 0,
          numReviews: restaurant.numReviews || 0,
          image:
            restaurant.coverImage?.url ||
            restaurant.restaurantImage?.[0]?.url ||
            'https://placehold.co/300x200?text=Restaurant',
          cuisines: restaurant.cuisineTypes ? restaurant.cuisineTypes.join(', ') : '',
          geolocation: restaurant.geolocation,
          city: restaurant.city,
          address: restaurant.address,
          openingHours: restaurant.openingHours,
          closingHours: restaurant.closingHours,
        }));

        setRestaurants(formattedRestaurants);
        setFilteredRestaurants(formattedRestaurants);
      } catch (error) {
        console.error('Error loading restaurants:', error);
        setRestaurants([]);
        setFilteredRestaurants([]);
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  // Filter restaurants based on search and category
  useEffect(() => {
    let filtered = restaurants;

    if (searchQuery) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.cuisines.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.city.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedCategory !== 'all') {
      const categoryMap = {
        veg: 'vegetarian',
        nonveg: 'non-vegetarian',
        dessert: 'desserts',
        others: 'other',
        pizza: 'pizza',
        burgers: 'burger',
        asian: 'asian',
      };

      const selectedCuisine = categoryMap[selectedCategory] || selectedCategory;
      filtered = filtered.filter((r) =>
        r.cuisines.toLowerCase().includes(selectedCuisine.toLowerCase()),
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCategory, restaurants]);

  return (
    <div className="min-h-screen bg-[#080a11] text-gray-100 selection:bg-[#ff5400] selection:text-white">
      {/* 01. Immersive 3D Hero */}
      <HeroSection
        user={user}
        navigate={navigate}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleNavigateToDashboard={handleNavigateToDashboard}
      />

      {/* 02. Animated Food Categories */}
      <FoodCategories3D
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 03. Signature Dishes Showcase */}
      <SignatureDishesShowcase />

      {/* 04 & 06. Popular Restaurants & Interactive Feed */}
      <RestaurantsGrid
        viewMode={viewMode}
        setViewMode={setViewMode}
        loading={loading}
        filteredRestaurants={filteredRestaurants}
        navigate={navigate}
        selectedCategory={selectedCategory}
        categories={categories}
        setSearchQuery={setSearchQuery}
        setSelectedCategory={setSelectedCategory}
      />

      {/* 05. Trending Food Collection */}
      <TrendingCollection />

      {/* 07. Special Offers and Promotions */}
      <SpecialOffersSection />

      {/* 08. Why Choose Cravings */}
      <WhyChooseCravings />

      {/* 09. Cinematic Brand Story */}
      <BrandStorySection />

      {/* 10. Customer Reviews */}
      <CustomerFeedbackSection />

      {/* 11. Premium App Promotion & Partner Onboarding */}
      <CTASection
        navigate={navigate}
        user={user}
        handleNavigateToDashboard={handleNavigateToDashboard}
      />
    </div>
  );
};

export default Home;
