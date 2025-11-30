import React, { useState, useContext } from "react";
import { Country, State, City } from "country-state-city";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import Styles from "../../Modules/Address.module.css";
import { AppContext } from "../../Context/appContext";

function Address() {
  const API = import.meta.env.VITE_API;
  const { user, setUser } = useContext(AppContext);

  const [selectedAddressId, setSelectedAddressId] = useState(
    localStorage.getItem(`${user._id}address`)
  );

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [area, setArea] = useState("");
  const [landmark, setLandmark] = useState("");

  const [country, setCountry] = useState("IN");
  const [stateCode, setStateCode] = useState("");
  const [cityName, setCityName] = useState("");

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(country);
  const cities = stateCode ? City.getCitiesOfState(country, stateCode) : [];

  /* -------- Add address -------- */
  const handleAddAddress = async () => {
    try {
      if (!fullName.trim()) return alert("Please enter full name");
      if (!phone || !isValidPhoneNumber(phone))
        return alert("Enter valid phone number");
      if (!pincode.trim() || pincode.length < 5)
        return alert("Enter valid pincode");
      if (!stateCode) return alert("Please select state");
      if (!cityName) return alert("Please select city");
      if (!houseNo.trim()) return alert("Enter house/flat number");
      if (!area.trim()) return alert("Enter area/locality");
      if (!landmark.trim()) return alert("Enter landmark");

      const newAddress = {
        fullName,
        phone,
        pincode,
        state: stateCode,
        city: cityName,
        houseNo,
        area,
        landmark,
      };

      const res = await fetch(`${API}/address/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newAddress),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        alert("Address added successfully");
      } else {
        alert("Error adding address");
      }
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  /* -------- Delete address -------- */
  const handleDeleteAddress = async (id) => {
    try {
      const res = await fetch(`${API}/address/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();

        if (localStorage.getItem(`${user._id}address`) === id) {
          localStorage.removeItem(`${user._id}address`);
          setSelectedAddressId(null);
        }

        setUser(data);
        alert("Address deleted successfully");
      } else {
        alert("Error deleting address");
      }
    } catch (error) {
      alert("Something went wrong");
      console.error(error);
    }
  };

  /* -------- Continue to payment (Stripe) -------- */
  const handleContinue = async () => {
    if (!selectedAddressId) return alert("Select an address");

    const selectedAddress = user.addresses.find(
      (a) => a._id === selectedAddressId
    );

    if (!selectedAddress) return alert("Address not found");

    let cart = [];

    // Priority 1: Buy Now product
    const buyNow = sessionStorage.getItem("buyNowArray");
    // Priority 2: Full cart
    const fullCart = sessionStorage.getItem("cartArray");

    try {
      if (buyNow) {
        cart = JSON.parse(buyNow);
      } else if (fullCart) {
        cart = JSON.parse(fullCart);
      } else {
        cart = [];
      }
    } catch (err) {
      console.error("Invalid cart JSON", err);
      alert("Data error. Please try again.");
      return;
    }

    if (cart.length === 0) {
      return alert("Your cart is empty.");
    }

    // Minimum order check ₹50
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (total < 50) {
      return alert("Minimum order amount is ₹50 to proceed to payment.");
    }

    // Stripe checkout
    try {
      const res = await fetch(`${API}/stripe/create-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          cartItems: cart,
          address: selectedAddress,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert(errData.error || "Payment could not be started.");
        return;
      }

      const data = await res.json();
      console.log("Stripe Response:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Unable to start payment");
      }
    } catch (err) {
      console.error(err);
      alert("Payment error");
    }
  };

  return (
    <div className={Styles.layout}>
      {/* Left Panel */}
      <div className={Styles.leftPanel}>
        <h2 className={Styles.title}>Add New Address</h2>

        <input
          className={Styles.input}
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />

        <PhoneInput
          value={phone}
          onChange={setPhone}
          defaultCountry="IN"
          className={Styles.phoneInput}
        />

        <input
          className={Styles.input}
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />

        {/* Country / State / City */}
        <div className={Styles.dropdownRow}>
          <select
            className={Styles.dropdown}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            className={Styles.dropdown}
            value={stateCode}
            onChange={(e) => setStateCode(e.target.value)}
          >
            <option>State</option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className={Styles.dropdown}
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          >
            <option>City</option>
            {cities.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <input
          className={Styles.input}
          placeholder="House No"
          value={houseNo}
          onChange={(e) => setHouseNo(e.target.value)}
        />

        <input
          className={Styles.input}
          placeholder="Area"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />

        <input
          className={Styles.input}
          placeholder="Landmark"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
        />

        <button className={Styles.addBtn} onClick={handleAddAddress}>
          + Add Address
        </button>

        <button className={Styles.checkoutBtn} onClick={handleContinue}>
          Continue to Payment →
        </button>
      </div>

      {/* Right Panel */}
      <div className={Styles.rightPanel}>
        <h2 className={Styles.title}>Saved Addresses</h2>

        {user?.addresses?.length > 0 ? (
          user.addresses.map((addr) => (
            <div
              className={`${Styles.addressCard} ${
                selectedAddressId === addr._id ? Styles.selectedCard : ""
              }`}
              key={addr._id}
            >
              <div className={Styles.topRow}>
                <input
                  type="radio"
                  className={Styles.radio}
                  checked={selectedAddressId === addr._id}
                  onChange={() => {
                    setSelectedAddressId(addr._id);
                    localStorage.setItem(`${user._id}address`, addr._id);
                  }}
                />

                <div>
                  <strong>{addr.fullName}</strong>
                  <p>
                    {addr.houseNo}, {addr.area}, {addr.landmark}
                  </p>
                  <p>
                    {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p>📞 {addr.phone}</p>
                </div>
              </div>

              <button
                className={Styles.deleteBtn}
                onClick={() => handleDeleteAddress(addr._id)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No saved addresses.</p>
        )}
      </div>
    </div>
  );
}

export default Address;
