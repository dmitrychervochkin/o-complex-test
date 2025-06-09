import "./products.scss";
import type { Product } from "./Products";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
    removeItem,
    selectBusketProducts,
    updateQuantity,
} from "../../reducers/busketReducer";
import { useSelector } from "react-redux";

interface ProductCardProps {
    item: Product;
    onBuyClicked: (id: number, title: string, price: number) => void;
}

const updateProductCountInLocalStorage = (
    id: string | number,
    newCount: number
) => {
    try {
        const raw = localStorage.getItem("products");
        if (!raw) return;

        const products = JSON.parse(raw);
        const updated = products.map((item: Product) =>
            item.id === id ? { ...item, count: newCount } : item
        );

        localStorage.setItem("products", JSON.stringify(updated));
    } catch (e) {
        console.error("Ошибка при обновлении количества в localStorage:", e);
    }
};

const removeProductFromLocalStorage = (id: string | number) => {
    try {
        const raw = localStorage.getItem("products");
        if (!raw) return;

        const products: Product[] = JSON.parse(raw);
        const updated = products.filter((item: Product) => item.id !== id);

        localStorage.setItem("products", JSON.stringify(updated));
    } catch (e) {
        console.error("Ошибка при удалении из localStorage:", e);
    }
};

export const ProductCard: React.FC<ProductCardProps> = ({
    item,
    onBuyClicked,
}) => {
    const [inBusket, setInBusket] = useState(false);
    const { id, title, image_url: img, description, price } = item;
    const busketProducts = useSelector(selectBusketProducts);
    const dispatch = useDispatch();

    useEffect(() => {
        if (busketProducts?.find((item) => item.id === id)) {
            setInBusket(true);
        } else{
            setInBusket(false);
        }
   
    }, [busketProducts, id]);

    const onCountClick = (operator: string) => {
        const findableProduct = busketProducts.find((item) => item.id === id);
        if (findableProduct?.count === 1 && operator === "-") {
            dispatch(removeItem(id));
            removeProductFromLocalStorage(id);
            setInBusket(false);
        }
        if (findableProduct) {
            if (operator === "+") {
                dispatch(
                    updateQuantity({ id, count: findableProduct.count + 1 })
                );
                updateProductCountInLocalStorage(id, findableProduct.count + 1);
            } else if (operator === "-") {
                dispatch(
                    updateQuantity({ id, count: findableProduct.count - 1 })
                );
                updateProductCountInLocalStorage(id, findableProduct.count - 1);
            }
        }
    };

    const onCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        if (!isNaN(value)) {
            dispatch(updateQuantity({ id, count: value }));
            updateProductCountInLocalStorage(id, value);
        }
        if (e.target.value === "") {
            dispatch(removeItem(id));
            removeProductFromLocalStorage(id);
            setInBusket(false);
        }
    };

    return (
        <div className="products__list--item" key={id}>
            <img
                onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/image.png";
                }}
                className="products__list--item__img"
                src={img}
                alt="logo"
            />
            <h2>{title}</h2>
            <div>{description}</div>
            <h1>Цена: {price} ₽</h1>
            {inBusket ? (
                <div className="products__list--item__footer">
                    <button
                        className="products__list--item__btn"
                        onClick={() => onCountClick("-")}
                    >
                        -
                    </button>
                    <input
                        className="products__list--item__count"
                        value={
                            busketProducts?.find((item) => item.id === id)
                                ?.count
                        }
                        onChange={onCountChange}
                    />
                    <button
                        className="products__list--item__btn"
                        onClick={() => onCountClick("+")}
                    >
                        +
                    </button>
                </div>
            ) : (
                <button
                    className="products__list--item__btn"
                    onClick={() => {
                        onBuyClicked(id, title, price);
                        setInBusket(true);
                    }}
                >
                    Купить
                </button>
            )}
        </div>
    );
};
