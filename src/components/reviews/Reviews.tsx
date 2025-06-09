import { useEffect, useState } from "react";
import "./reviews.scss";
import { getReviews } from "../../api";

type Review = {
    id: number | string;
    text: string;
};

export const Reviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        setLoading(true);

        getReviews()
            .then((data) => {
                if (!ignore) {
                    setReviews(data);
                }
            })
            .catch((err) => {
                console.error("Ошибка загрузки отзывов:", err);
            })
            .finally(() => {
                if (!ignore) {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000); // имитация загрузки
                }
            });

        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div className="reviews__list">
            {loading ? (
                <div className="reviews__list--loader">Загрузка отзывов...</div>
            ) : (
                reviews.map((item, index) => (
                    <div className="reviews__list--item" key={item.id}>
                        <div className="reviews__list--item__title">
                            Отзыв {index + 1}
                        </div>
                        <div
                            className="reviews__list--item__content"
                            dangerouslySetInnerHTML={{ __html: item.text }}
                        />
                    </div>
                ))
            )}
        </div>
    );
};
