import { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import ProductCard from './features/products/components/ProductCard';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div>
      <Header />
      <div className='p-4'>
        <ProductCard />
      </div>
      <Footer />
    </div>
  )
}

export default App
