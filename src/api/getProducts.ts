export const getProducts = async (page: number) => {
    const response = await fetch(
        `http://o-complex.com:1337/products?page=${page}&page_size=20`
    );
    return response.json();
};
