import { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './page/home/HomePage';

function App() {
  return (
    <div>
      <Header />
      <HomePage />
      <Footer />
    </div>
  )
}

export default App
