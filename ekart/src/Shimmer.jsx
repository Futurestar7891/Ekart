import { useEffect } from "react";

// Inject keyframes only once
const injectKeyframes = () => {
  if (!document.getElementById("shimmer-inline-keyframes")) {
    const style = document.createElement("style");
    style.id = "shimmer-inline-keyframes";
    style.innerHTML = `
      @keyframes shimmerInline {
        0% { transform: translateX(-150%); }
        100% { transform: translateX(150%); }
      }
    `;
    document.head.appendChild(style);
  }
};

const Shimmer = ({ width = "100%", height = "100vh", radius = "6px" }) => {
  useEffect(() => {
    injectKeyframes();
  }, []);

  const styles = {
    wrapper: {
      width,
      height,
      borderRadius: radius,
      background: "#f6f7f8",
      overflow: "hidden",
      position: "relative",
    },

    shimmer: {
      width: "50%",
      height: "100%",
      position: "absolute",
      background: `
        linear-gradient(
          to right,
          #eeeeee 0%,
          #dddddd 20%,
          #eeeeee 40%,
          #eeeeee 100%
        )
      `,
      animation: "shimmerInline 1.5s infinite",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.shimmer}></div>
    </div>
  );
};

export default Shimmer;
