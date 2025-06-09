export const postBusket = async (
    phone: string,
    cart: Array<{ id: number; quantity: number }>
) => {
    console.log(phone, cart)
    const response = await fetch("http://o-complex.com:1337/order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            phone,
            cart,
        }),
    });

    const data = await response.json();

    if (data?.success === 0) {
        return data?.error;
    } else if (data?.success === 1) {
        return true;
    }
};
