import { useEffect, useRef, useState } from "react";
import "./busket.scss";
import { useSelector } from "react-redux";
import {
    clearBusket,
    selectBusketProducts,
} from "../../reducers/busketReducer";
import {
    calculateCursorPosition,
    formatPhone,
    normalizePhone,
    validatePhone,
} from "../../utils";
import { postBusket } from "../../api/postBusket";
import { useDispatch } from "react-redux";

interface BusketProps {
    setPopup: (value: boolean) => void;
}

export const Busket = ({ setPopup }: BusketProps) => {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState(false);
    const dispatch = useDispatch();
    const inputRef = useRef<HTMLInputElement>(null);
    const products = useSelector(selectBusketProducts);

    useEffect(() => {
        const phoneRaw = localStorage.getItem("phone");
        setPhone(phoneRaw ?? "");
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const rawValue = input.value;

        const selectionStart = input.selectionStart || 0;
        const digitsOnly = rawValue.replace(/\D/g, "").slice(0, 11);
        const formatted = formatPhone(digitsOnly);

        setPhone(formatted);
        localStorage.setItem("phone", formatted);
        setTimeout(() => {
            if (inputRef.current) {
                const nextCursorPos = calculateCursorPosition(
                    selectionStart,
                    rawValue,
                    formatted
                );
                inputRef.current.setSelectionRange(
                    nextCursorPos,
                    nextCursorPos
                );
            }
        }, 0);
    };

    const onSubmit = () => {
        if (!validatePhone(phone) || products.length === 0) {
            setError(true);
            setTimeout(() => {
                setError(false);
            }, 2000);
        } else {
            const cart = products.map((item) => ({
                id: item.id,
                quantity: item.count,
            }));
            postBusket(normalizePhone(phone), cart).then(() => {
                setPopup(true);
                setPhone("");
                dispatch(clearBusket());
                localStorage.removeItem("phone");
                localStorage.removeItem("products");
                setTimeout(() => {
                    setPopup(false);
                }, 3000);
            });
        }
    };

    return (
        <div className="busket">
            <div className="busket__header">
                <h3 className="busket__header--title">Добавленные товары</h3>
                <h4
                    className={`busket__header--error ${
                        error ? "active-error" : ""
                    }`}
                >
                    {products.length === 0
                        ? "Заполните корзину!"
                        : "Введите номер!"}
                </h4>
            </div>
            <div className="busket__list">
                {products.length === 0 && (
                    <div className="busket__list--empty">
                        Добавьте товары в корзину
                    </div>
                )}
                {products?.map(({ id, title, count, price }) => (
                    <div key={id} className="busket__list--item">
                        <div className="busket__list--item__title">{title}</div>
                        <div>x{count}</div>
                        <div>{price * count} ₽</div>
                    </div>
                ))}
            </div>
            <div className="busket__footer">
                <input
                    ref={inputRef}
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={handleChange}
                    className="busket__footer--phone"
                ></input>
                <button
                    disabled={error}
                    className={`busket__footer--btn ${error ? "disabled" : ""}`}
                    onClick={onSubmit}
                >
                    Заказать
                </button>
            </div>
        </div>
    );
};
