import React, { useContext, useMemo, useState, useEffect } from "react";
import { AppContext } from "../Context/appContext";
import { useNavigate } from "react-router-dom";

function Carausel() {
  const navigate=useNavigate();
  const { products } = useContext(AppContext);
  const [index, setIndex] = useState(0);

const carouselItems = useMemo(() => {
  if (!products || products.length === 0) return [];

  // Shuffle products
  const shuffled = [...products].sort(() => 0.5 - Math.random());

  // Take first 5 items
  return shuffled.slice(0, 5).map((p) => ({
    id: p._id,
    title: p.name,
    price: p.price,
    smallDescription: p.description,
    image: p.images?.[0]?.url || "",
  }));
}, [products]);


  // Auto slide every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % carouselItems.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const styles = {
    container: {
      width: "100%",
    //   maxWidth: "1200px",
      // margin: "auto",
      overflow: "hidden",
      marginTop:"100px"
    //   display:"flex",
    //   alignItems:"center"
    //   position: "relative",
    },
    wrapper: {
      display: "flex",
      transition: "transform 0.5s ease-in-out",
      transform: `translateX(-${index * 100}%)`,
    },
    slide: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minWidth: "100%",
      minHeight:"80vh",
      boxSizing: "border-box",
      padding: "40px 80px",
      backgroundColor: "#f5f5f5",
    //   border:"2px solid red"
    },
    textContainer: {
      flex: "1",
      // paddingRight: "20px",
      // border:"2px solid red"
    },
    title: {
      fontSize: "32px",
      fontWeight: "bold",
      marginBottom: "15px",
    },
    description: {
      fontSize: "18px",
      marginBottom: "20px",
      lineHeight: "1.4",
    },
    button: {
      padding: "12px 25px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
    image: {
      flex: "1",
      width: "30%",
      maxHeight: "400px",
      objectFit: "cover",
      borderRadius: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {carouselItems.map((item) => (
          <div style={styles.slide} key={item.id}>
            <div style={styles.textContainer}>
              <h2 style={styles.title}>{item.title}</h2>
              <p style={styles.description}>{item.smallDescription}</p>
              <button onClick={()=>navigate(`/product/detail/${item.id}`)}style={styles.button}>Show Now</button>
            </div>
            <img src={item.image} alt={item.title} style={styles.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carausel;
