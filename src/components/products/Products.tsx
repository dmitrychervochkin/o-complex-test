import { useEffect, useRef, useState } from "react";
import "./products.scss";
import { getProducts } from "../../api";
import { ProductCard } from "./ProductCard";
import { useDispatch } from "react-redux";
import { addItem } from "../../reducers/busketReducer";

export type Product = {
    id:  number;
    description: string;
    title: string;
    price: number;
    image_url: string;
};

export const Products = () => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const observerRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch();
    
    useEffect(() => {
        let ignore = false;
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getProducts(page);
                if (!ignore) {
                    setProducts((prev) => [...prev, ...data.items]);
                    if (data.items.length === 0) {
                        setHasMore(false);
                    }
                }
            } catch (error) {
                console.error("Ошибка при загрузке продуктов:", error);
            } finally {
                if (!ignore) {
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000); // имитация загрузки
                }
            }
        };

        fetchData();

        return () => {
            ignore = true;
        };
    }, [page]);

    useEffect(() => {
        if (loading || !hasMore) return;

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });

        const target = observerRef.current;
        if (target) observer.observe(target);

        return () => {
            if (target) observer.unobserve(target);
        };
    }, [loading, hasMore]);

    const onBuyClicked = (id: number, title: string, price: number) => {
        const existing = localStorage.getItem("products");
        const parsed = existing ? JSON.parse(existing) : [];
        const updated = [...parsed, { id, title, price, count: 1 }];

        localStorage.setItem("products", JSON.stringify(updated));
        dispatch(addItem({ id, title, price, count: 1 }));
        
    };

    return (
        <div className="products">
            <div className="products__list">
                {products.map((item) => (
                    <ProductCard
                        item={item}
                        onBuyClicked={onBuyClicked}
                    />
                ))}
            </div>
            <div ref={observerRef} className="products__loader-trigger" />

            {loading && <div className="products__loading">Загрузка...</div>}
        </div>
    );
};
