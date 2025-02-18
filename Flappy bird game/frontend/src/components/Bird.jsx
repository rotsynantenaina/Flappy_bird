import React from "react";

const Bird = ({ position }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: `${position}px`,
        left: "80px", // Décalage horizontal
        width: "100px", // Hitbox de 100px
        height: "100px", // Hitbox de 100px
        backgroundColor: "rgba(255, 0, 0, 0)", // Invisible, mais utilisée pour la collision
        borderRadius: "50%", // Forme circulaire pour une meilleure précision
      }}
    >
      <img
        src="/images/bird1.gif"
        alt="Flappy Bird"
        style={{
          width: "100px", // Taille du GIF
          height: "100px",
          transform: "translate(-20%, -20%)", // Centrage ajusté
          pointerEvents: "none", // Empêche toute interaction avec la hitbox
        }}
      />
    </div>
  );
};
export default Bird;