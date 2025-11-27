import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/appContext";
import { addReview } from "../Utils/Products";

function ProductReviews({ product }) {
  const { user, setProducts,isLoggedIn } = useContext(AppContext);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [reviewPreview, setReviewPreview] = useState(null);
  const [reviewImageFile, setReviewImageFile] = useState(null);

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  // IMAGE UPLOAD
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

  // SUBMIT REVIEW
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

    // Correct condition
    if (!updatedProducts || updatedProducts.length === 0) {
      alert("Error adding review");
      return;
    }

    setCurrentProduct(updatedProducts.find((p) => p._id === product._id));
    setProducts(updatedProducts);
    alert("Review added!");

    // Reset
    setReviewText("");
    setRating(0);
    setReviewPreview(null);
    setReviewImageFile(null);
  };

    const getLetterAvatar = (name) => {
      if(name){
        return name.charAt(0).toUpperCase();
      }
      if (!user?.name) return "U";
      return user.name.charAt(0).toUpperCase();
    };

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Reviews ({currentProduct.reviews.length})</h2>

      {/* Review Image Preview */}
      {reviewPreview && (
        <div style={styles.previewWrapper}>
          <div style={styles.imagePreviewContainer}>
            <img
              src={reviewPreview}
              alt="preview"
              style={styles.previewImage}
            />
            <button style={styles.removeImageBtn} onClick={removeImage}>
              ❌
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div
        style={{
          ...styles.reviewList,
          overflowY: currentProduct.reviews.length > 4 ? "auto" : "visible",
        }}
      >
        {currentProduct.reviews.length > 0 ? (
          currentProduct.reviews.map((rev, idx) => (
            <div key={idx} style={styles.reviewCard}>
              {rev.userId?.image ? (
                <img
                  src={rev.userId.image}
                  alt="user"
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
              ) : (
                // If NO image → show letter avatar
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "50%",
                    background: "#4C6EF5",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontSize: "22px",
                    fontWeight: "700",
                    marginRight: "10px",
                  }}
                >
                  {getLetterAvatar(rev.userId?.name)}
                </div>
              )}

              <div style={styles.reviewContent}>
                <h4 style={styles.reviewName}>{rev.userId?.name}</h4>
                <p style={styles.reviewText}>{rev.comment}</p>

                {rev.image && (
                  <img
                    src={rev.image}
                    alt="review"
                    style={styles.reviewImage}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noReviews}>No reviews yet. Be the first!</p>
        )}
      </div>

      {/* INPUT BAR */}
      <div style={styles.inputBar}>
        {user?.image ? (
          <img
            src={user.image}
            alt="user"
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              objectFit: "cover",
              marginRight: "10px",
            }}
          />
        ) : (
          // If NO image → show letter avatar
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              background: "#4C6EF5",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              fontSize: "22px",
              fontWeight: "700",
              marginRight: "10px",
            }}
          >
            {getLetterAvatar()}
          </div>
        )}

        <div style={styles.ratingBox}>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onClick={() => setRating(num)}
              style={{
                cursor: "pointer",
                fontSize: "22px",
                color: rating >= num ? "gold" : "#ccc",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <label style={styles.uploadLabel}>
          📷
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={styles.uploadInput}
          />
        </label>

        <input
          type="text"
          placeholder="Write a review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          style={styles.textInput}
        />

        <button style={styles.sendBtn} onClick={handleSubmit}>
          Add Review
        </button>
      </div>
    </div>
  );
}

export default ProductReviews;

/* -------------------- STYLES -------------------- */

const styles = {
  wrapper: {
    width: "100%",
    padding: "20px",
    marginTop: "20px",
    position: "relative",
  },

  heading: {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "10px",
  },

  previewWrapper: {
    marginBottom: "10px",
  },

  imagePreviewContainer: {
    position: "relative",
    display: "inline-block",
  },

  previewImage: {
    width: "140px",
    borderRadius: "8px",
  },

  removeImageBtn: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: "50%",
    padding: "4px 8px",
    cursor: "pointer",
  },

  reviewList: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxHeight: "60vh",
    paddingRight: "8px",
    marginBottom: "120px", // space for input bar
  },

  reviewCard: {
    display: "flex",
    gap: "15px",
    background: "#f7f7f7",
    padding: "12px",
    borderRadius: "8px",
  },

  avatar: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  reviewContent: { flex: 1 },

  reviewName: { fontWeight: "600", margin: 0 },

  reviewText: { margin: "5px 0", color: "#555" },

  reviewImage: {
    width: "150px",
    borderRadius: "8px",
    marginTop: "8px",
  },

  noReviews: {
    color: "#777",
    fontStyle: "italic",
  },

  inputBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100vw",
    display: "flex",
    background: "white",
    alignItems: "center",
    padding: "12px",

    boxShadow: "0 -4px 10px rgba(0,0,0,0.1)",
    gap: "10px",
    zIndex: 100,
    color: "black",
  },

  inputAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    objectFit: "cover",
  },

  ratingBox: {
    display: "flex",
    gap: "4px",
  },

  uploadLabel: {
    fontSize: "24px",
    cursor: "pointer",
  },

  uploadInput: { display: "none" },

  textInput: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    backgroundColor: "white",
    color: "black",
    outline: "none",
  },

  sendBtn: {
    background: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};
