// src/Components/ProductReviews.jsx
import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/appContext";
import { addReview } from "../Utils/Products";
import Styles from "../Modules/ProductReviews.module.css";

function ProductReviews({ product }) {
  const { user, setProducts, isLoggedIn } = useContext(AppContext);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewPreview, setReviewPreview] = useState(null);
  const [reviewImageFile, setReviewImageFile] = useState(null);

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setReviewPreview(reader.result);
      setReviewImageFile(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setReviewPreview(null);
    setReviewImageFile(null);
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      alert("Please Login first");
      return;
    }

    if (!reviewText.trim() || rating === 0) {
      alert("Please add rating and comment!");
      return;
    }

    const updatedProducts = await addReview(
      product._id,
      rating,
      reviewText,
      reviewImageFile
    );

    if (!updatedProducts || updatedProducts.length === 0) {
      alert("Error adding review");
      return;
    }

    setCurrentProduct(updatedProducts.find((p) => p._id === product._id));
    setProducts(updatedProducts);
    alert("Review added!");

    setReviewText("");
    setRating(0);
    setReviewPreview(null);
    setReviewImageFile(null);
  };

  const getLetterAvatar = (name) => {
    if (name) return name.charAt(0).toUpperCase();
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <div className={Styles.wrapper}>
      <h2 className={Styles.heading}>
        Reviews ({currentProduct.reviews.length})
      </h2>

      {/* Preview */}
      {reviewPreview && (
        <div className={Styles.previewWrapper}>
          <div className={Styles.imagePreviewContainer}>
            <img
              src={reviewPreview}
              alt="preview"
              className={Styles.previewImage}
            />
            <button className={Styles.removeImageBtn} onClick={removeImage}>
              ❌
            </button>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div
        className={`${Styles.reviewList} ${
          currentProduct.reviews.length > 4 ? Styles.reviewListScrollable : ""
        }`}
      >
        {currentProduct.reviews.length > 0 ? (
          currentProduct.reviews.map((rev, idx) => (
            <div key={idx} className={Styles.reviewCard}>
              {rev.userId?.image ? (
                <img
                  src={rev.userId.image}
                  alt="user"
                  className={Styles.avatar}
                />
              ) : (
                <div className={Styles.letterAvatar}>
                  {getLetterAvatar(rev.userId?.name)}
                </div>
              )}

              <div className={Styles.reviewContent}>
                <h4 className={Styles.reviewName}>{rev.userId?.name}</h4>
                <p className={Styles.reviewText}>{rev.comment}</p>

                {rev.image && (
                  <img
                    src={rev.image}
                    alt="review"
                    className={Styles.reviewImage}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={Styles.noReviews}>No reviews yet. Be the first!</p>
        )}
      </div>

      {/* INPUT BAR */}
      <div className={Styles.inputBar}>
        {user?.image ? (
          <img src={user.image} alt="user" className={Styles.inputAvatar} />
        ) : (
          <div className={Styles.letterAvatarSmall}>{getLetterAvatar()}</div>
        )}

        {/* Stars (Desktop) */}
        <div className={Styles.ratingBox}>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onClick={() => setRating(num)}
              className={
                rating >= num ? Styles.starActive : Styles.starInactive
              }
            >
              ★
            </span>
          ))}
        </div>

        {/* Dropdown (Mobile <400px) */}
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className={Styles.ratingDropdown}
        >
          <option value="0">Rate</option>
          <option value="1">⭐1</option>
          <option value="2">⭐2</option>
          <option value="3">⭐3</option>
          <option value="4">⭐4</option>
          <option value="5">⭐5</option>
        </select>

        <label className={Styles.uploadLabel}>
          📷
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className={Styles.uploadInput}
          />
        </label>

        <input
          type="text"
          placeholder="Write a review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className={Styles.textInput}
        />

        <button className={Styles.sendBtn} onClick={handleSubmit}>
          Add
        </button>
      </div>
    </div>
  );
}

export default ProductReviews;
