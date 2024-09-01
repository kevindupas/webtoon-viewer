import { IonIcon } from "@ionic/react";
import { star, starHalf, starOutline } from "ionicons/icons";

const Rating = (rating: number) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      {[...Array(fullStars)].map((_, i) => (
        <IonIcon key={`full-${i}`} icon={star} className="text-yellow-400" />
      ))}
      {hasHalfStar && <IonIcon icon={starHalf} className="text-yellow-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <IonIcon
          key={`empty-${i}`}
          icon={starOutline}
          className="text-yellow-400"
        />
      ))}
    </>
  );
};

export default Rating;
