import React, { useState, useContext } from "react";
import { Country, State, City } from "country-state-city";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { AppContext } from "../../Context/appContext";

function Address() {
  const API = import.meta.env.API;
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
  const cities =
    State && stateCode ? City.getCitiesOfState(country, stateCode) : [];

  const handleAddAddress = async () => {
    try {
      // VALIDATION
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
      alert("Something went wrong", error);
    }
  };

  // DELETE ADDRESS
  const handleDeleteAddress = async (id) => {
    try {
      const res = await fetch(`${API}/address/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();

        // If deleted address was selected, remove from localStorage
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
      alert("Something went wrong", error);
    }
  };

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

    // ⭐ MINIMUM ORDER CHECK (₹50)
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (total < 50) {
      return alert("Minimum order amount is ₹50 to proceed to payment.");
    }

    // STRIPE CHECKOUT
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
    <>
      <style>{`
        .layout {
          display: flex;
          gap: 25px;
          height: 100vh;
          padding: 20px;
          box-sizing: border-box;
        }

        .left-panel {
          width: 58%;
          background: #f8f9fb;
          padding: 20px;
          border-radius: 10px;
          overflow-y: auto;
        }

        .right-panel {
          width: 40%;
          background: #ffffff;
          padding: 20px;
          border-radius: 10px;
          overflow-y: auto;
        }

        .title {
          font-size: 22px;
          font-weight: bold;
          margin-bottom: 15px;
        }

   .input, .dropdown {
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid black;
  margin-bottom: 12px;
  background-color: #f3f3f3 !important; /* OFF-WHITE */
  color: black !important;
}

.phone-input-custom input {
  background-color: #f3f3f3 !important;
  color: black !important;
  border: 1px solid black !important;
  border-radius: 8px !important;
  padding: 10px !important;
  width: 100% !important;
}

        .dropdown-row {
          display: flex;
          gap: 10px;
        }

        .add-btn {
          width: 100%;
          padding: 12px;
          background: #007bff;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          margin-top: 5px;
        }

        .checkout-btn {
          width: 100%;
          background: #28a745;
          margin-top: 20px;
          padding: 12px;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 17px;
          cursor: pointer;
        }

        .address-card {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fafafa;
          margin-bottom: 15px;
          width: 100%;
          transition: 0.2s ease;
        }

        /* HIGHLIGHT SELECTED CARD */
        .selected-card {
          border: 2px solid #007bff !important;
          background: #e8f1ff !important;
        }

        .address-card .top-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }

        .radio {
          transform: scale(1.2);
          margin-top: 3px;
          cursor: pointer;
        }

        .delete-btn {
          margin-top: 10px;
          background: #eee;
          border: none;
          padding: 6px 10px;
          border-radius: 6px;
          cursor: pointer;
          color: #444;
        }

        .delete-btn:hover {
          background: #ddd;
        }
      `}</style>

      <div className="layout">
        {/* LEFT SIDE */}
        <div className="left-panel">
          <h2 className="title">Add New Address</h2>

          <input
            className="input"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <PhoneInput
            value={phone}
            onChange={setPhone}
            defaultCountry="IN"
            international
            className="phone-input-custom input"
          />

          <input
            className="input"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
          />

          <div className="dropdown-row">
            <select
              className="dropdown"
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
              className="dropdown"
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
              className="dropdown"
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
            className="input"
            placeholder="House No"
            value={houseNo}
            onChange={(e) => setHouseNo(e.target.value)}
          />

          <input
            className="input"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />

          <input
            className="input"
            placeholder="Landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
          />

          <button className="add-btn" onClick={handleAddAddress}>
            + Add Address
          </button>

          <button className="checkout-btn" onClick={handleContinue}>
            Continue to Payment →
          </button>
        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">
          <h2 className="title">Saved Addresses</h2>

          {user?.addresses?.length > 0 ? (
            user.addresses.map((addr) => (
              <div
                key={addr._id}
                className={`address-card ${
                  selectedAddressId === addr._id ? "selected-card" : ""
                }`}
              >
                <div className="top-row">
                  <input
                    type="radio"
                    className="radio"
                    name="addr"
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
                  className="delete-btn"
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
    </>
  );
}

export default Address;
