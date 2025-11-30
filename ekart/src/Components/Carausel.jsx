import Styles from "../Modules/Carausel.module.css";
import React, { useContext, useMemo, useState, useEffect } from "react";
import { AppContext } from "../Context/appContext";
import { useNavigate } from "react-router-dom";

function Carausel() {
  const navigate = useNavigate();
  const { products } = useContext(AppContext);
  const [index, setIndex] = useState(0);

const carouselItems = useMemo(() => {
  if (!products || products.length === 0) return [];

  const shuffled = [...products].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 5).map((p) => ({
    id: p._id,
    title: p.name,

    // Limit description to 30 words
    smallDescription:
      p.description?.split(" ").slice(0, 30).join(" ") +
      (p.description?.split(" ").length > 30 ? "..." : ""),

    price: p.price,
    image: p.images?.[0]?.url || "",
  }));
}, [products]);

  useEffect(() => {
    if (!carouselItems.length) return;

    const timer = setInterval(
      () => setIndex((prev) => (prev + 1) % carouselItems.length),
      4000
    );

    return () => clearInterval(timer);
  }, [carouselItems.length]);

  return (
    <div className={Styles.container}>
      <div
        className={Styles.wrapper}
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {carouselItems.map((item) => (
          <div className={Styles.slide} key={item.id}>
            <div className={Styles.textContainer}>
              <h2 className={Styles.title}>{item.title}</h2>
              <p className={Styles.description}>{item.smallDescription}</p>
              <button
                onClick={() => navigate(`/product/detail/${item.id}`)}
                className={Styles.button}
              >
                Shop Now
              </button>
            </div>

            <img src={item.image} alt={item.title} className={Styles.image} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carausel;
