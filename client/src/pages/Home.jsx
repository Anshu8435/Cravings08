import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../config/ApiConfig';

import HeroSection from '../components/home/HeroSection';
import RestaurantsGrid from '../components/home/RestaurantsGrid';
import StatisticsSection from '../components/home/StatisticsSection';
import CustomerFeedbackSection from '../components/home/CustomerFeedbackSection';
import CTASection from '../components/home/CTASection';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
  const [viewMode, setViewMode] = useState('restaurants');

  // Load real restaurants from MongoDB API
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        const response = await api.get('/public/restaurants');

        const formattedRestaurants = (response.data.data || []).map((restaurant) => ({
          id: restaurant._id,
          name: restaurant.restaurantName,
          description:
            restaurant.description || `${restaurant.cuisineType} cuisine in ${restaurant.city}`,
          rating: restaurant.averageRating || 0,
          numReviews: restaurant.numReviews || 0,
          image:
            restaurant.coverImage?.url ||
            restaurant.restaurantImage?.[0]?.url ||
            '/assets/bitehero-food-hero.png',
          cuisines: restaurant.cuisineTypes ? restaurant.cuisineTypes.join(', ') : '',
          city: restaurant.city || 'Nearby',
          category: restaurant.category || 'veg',
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

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisines.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== 'all') {
      const categoryMap = {
        veg: 'vegetarian',
        nonveg: 'non-vegetarian',
        dessert: 'desserts',
        others: 'other',
      };
      const match = categoryMap[selectedCategory] || selectedCategory;
      filtered = filtered.filter(
        (r) =>
          r.cuisines.toLowerCase().includes(match.toLowerCase()) ||
          (r.category && r.category.toLowerCase().includes(selectedCategory.toLowerCase())),
      );
    }

    setFilteredRestaurants(filtered);
  }, [searchQuery, selectedCategory, restaurants]);

  return (
    <main>
      {/* 01. Signature Arch Hero Section */}
      <HeroSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {/* 02. What Are You In The Mood For? - Discovery Section */}
      <RestaurantsGrid
        viewMode={viewMode}
        setViewMode={setViewMode}
        loading={loading}
        filteredRestaurants={filteredRestaurants}
        navigate={navigate}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      {/* 03. Cravings By The Numbers - Red Stats Ribbon */}
      <StatisticsSection />
      {/* 04. Customer Testimonials */}
      <CustomerFeedbackSection />
      {/* 05. Partner With Us Callout */}
      <CTASection />
    </main>
  );
};

export default Home;
