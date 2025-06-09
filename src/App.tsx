import { Busket, Reviews, Products } from "./components";
import "./App.scss";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "./reducers/busketReducer";

function App() {
    const [popup, setPopup] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        const productsRaw = localStorage.getItem("products");
        if (!productsRaw) return;

        try {
            const products = JSON.parse(productsRaw);
            if (Array.isArray(products)) {
                products.forEach((product) => dispatch(addItem(product)));
            }
        } catch (e) {
            console.error("Ошибка парсинга localStorage.products", e);
        }
    }, [dispatch]);

    return (
        <div className="app">
            <div className="header">
                <div className="header__title">Тестовое задание</div>
            </div>

            <div className={`app__popup ${popup ? "active-popup" : ""}`}>
                Спасибо за заказ! Возвращайтесь за покупками!
            </div>

            <h1 className="reviews__header">Наши отзывы</h1>
            <Reviews />
            <h1 className="reviews__header">Корзина</h1>
            <Busket setPopup={setPopup} />
            <h1 className="reviews__header">Товары</h1>
            <Products />
        </div>
    );
}

export default App;
