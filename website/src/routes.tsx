import React from 'react';
import {Route, BrowserRouter} from 'react-router-dom';

import Home from './pages/Home';
import CreateMarket from './pages/CreateMarket'

const Routes = () =>{
  return(
    <BrowserRouter>
    <Route component={Home} path="/" exact/>
    <Route component={CreateMarket} path="/create-market"/>
    </BrowserRouter>
  );
} 
export default Routes;