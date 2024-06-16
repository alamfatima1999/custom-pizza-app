import React, { useState } from "react";
import {prices} from "../../Configs/pizzaConfig"
import "./CustomizeYourPizza.css";

const CustomizeYourPizza = () => {
  const initialPizzaState = {
    size: "medium",
    toppings: [],
    crust: "thin",
    error: "",
    showBreakdown: false,
    showPayment: false,
  };

  const [pizza, setPizza] = useState({ ...initialPizzaState });

 

  const handleSizeChange = (e) => {
    setPizza({ ...pizza, size: e.target.value });
  };

  const handleToppingChange = (e) => {
    const { value, checked } = e.target;
    
    // Check if the topping being added or removed is pepperoni
    const isPepperoni = value === 'pepperoni';
    
    // Check if the selected crust is glutenFree
    const isGlutenFreeCrust = pizza.crust === 'glutenFree';
    
    // Check if pepperoni is being added and the crust is glutenFree
    if (checked && isPepperoni && isGlutenFreeCrust) {
      setPizza({
        ...pizza,
        error: "Pepperoni is not gluten-free. Please remove it to select a gluten-free crust."
      });
      return; // Exit early to prevent adding pepperoni with glutenFree crust
    }
    
    // Remove error if it was previously set
    if (pizza.error) {
      setPizza({
        ...pizza,
        error: ""
      });
    }
    
    // Update toppings based on checked status
    if (checked) {
      setPizza({ ...pizza, toppings: [...pizza.toppings, value] });
    } else {
      setPizza({
        ...pizza,
        toppings: pizza.toppings.filter((topping) => topping !== value),
      });
    }
  };
  

  const handleCrustChange = (e) => {
    const selectedCrust = e.target.value;
    if (
      selectedCrust === "glutenFree" &&
      pizza.toppings.includes("pepperoni")
    ) {
      setPizza({
        ...pizza,
        error:
          "Pepperoni is not gluten-free. Please remove it to select a gluten-free crust.",
      });
    } else {
      setPizza({ ...pizza, error: "", crust: selectedCrust });
    }
  };

  const calculatePrice = () => {
    const sizePrice = prices.sizes[pizza.size];
    const toppingsPrice = pizza.toppings.reduce(
      (acc, topping) => acc + prices.toppings[topping].price,
      0
    );
    const crustPrice = prices.crusts[pizza.crust];
    return sizePrice + toppingsPrice + crustPrice;
  };

  const toggleBreakdown = (e) => {
    e.preventDefault();
    setPizza({ ...pizza, showBreakdown: !pizza.showBreakdown });
  };

  const togglePayment = () => {
    setPizza({ ...pizza, showPayment: !pizza.showPayment });
  };

  const getToppingsInputs = () => {
    return Object.keys(prices.toppings).map((topping) => (
      <label key={topping}>
        <input
          type="checkbox"
          value={topping}
          checked={pizza.toppings.includes(topping)}
          onChange={handleToppingChange}
        />
        {prices.toppings[topping].name} (${prices.toppings[topping].price})
      </label>
    ));
  };

  const getBreakdown = () => {
    const sizePrice = prices.sizes[pizza.size];
    const crustPrice = prices.crusts[pizza.crust];
    const toppingsList = pizza.toppings.map((topping) => (
      <li key={topping}>
        {prices.toppings[topping].name}: ${prices.toppings[topping].price}
      </li>
    ));
    return (
      <div className="price-breakdown">
        <p>
          Size: {pizza.size.charAt(0).toUpperCase() + pizza.size.slice(1)} - $
          {sizePrice}
        </p>
        <p>
          Crust: {pizza.crust.charAt(0).toUpperCase() + pizza.crust.slice(1)} - $
          {crustPrice}
        </p>
        {toppingsList.length > 0 ?
          <>
            <p>Toppings:</p>
            <ul>{toppingsList}</ul>
          </>
          : null}
      </div>
    );
  };
  

  const resetPizza = () => {
    setPizza({ ...initialPizzaState });
  };

  return (
    <div className="customize-your-pizza">
      <h1>Customize Your Pizza</h1>
      
      <div className="option-group">
        <div className="label-header">Please select your Pizza size</div>
        <div className="radio-group">
          {Object.keys(prices.sizes).map((size) => (
            <label key={size}>
              <input
                type="radio"
                value={size}
                checked={pizza.size === size}
                onChange={handleSizeChange}
              />
              {size.charAt(0).toUpperCase() + size.slice(1)} ($
              {prices.sizes[size]})
            </label>
          ))}
        </div>
      </div>
      <div className="option-group">
        <div className="label-header">Please select topping(s)</div>
        {getToppingsInputs()}
      </div>
      <div className="option-group select-crust">
        <div className="label-header">Please select Pizza crust</div>
        <label>
          <select value={pizza.crust} onChange={handleCrustChange}>
            {Object.keys(prices.crusts).map((crust) => (
              <option key={crust} value={crust}>
                {crust.charAt(0).toUpperCase() + crust.slice(1)} Crust ($
                {prices.crusts[crust]})
              </option>
            ))}
          </select>
        </label>
      </div>
      {pizza.error && <div className="error-message">{pizza.error}</div>}
      <div className="price-display">
        <div>Total Price: ${calculatePrice()}</div>
        <div onClick={toggleBreakdown} className="toggle-link">
          {pizza.showBreakdown ? "Hide Details" : "Show Details"}
        </div>
        {pizza.showBreakdown && getBreakdown()}
      </div>
      <div className="button-group">
        <button onClick={togglePayment}>
          {pizza.showPayment ? "Thank You!!!" : "Complete Your Payment"}
        </button>
        {!pizza.showPayment ? <button onClick={resetPizza} className="reset-button">
          Reset
        </button> : null}
      </div>
    </div>
  );
};

export default CustomizeYourPizza;
