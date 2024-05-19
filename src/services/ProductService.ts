import ServiceApi from "../api/serviceApi.ts";

const customHeaders = {
    'X-Custom-Header': 'CustomHeaderValue',
    'Another-Custom-Header': 'AnotherValue'
};

class ProductServiceApi {
    private static instance: ProductServiceApi;

    // Method to get the singleton instance
    public static getInstance(): ProductServiceApi {
        if (!ProductServiceApi.instance) {
            ProductServiceApi.instance = new ProductServiceApi();
        }
        return ProductServiceApi.instance;
    }

    public async getProductById(prodId:number) {
        try {
            const response = await ServiceApi
                .getInstance()
                .invoke<unknown>(
                    {
                        method: 'GET',
                        endPoint: "/products/:Id",
                        pathParams: { Id: prodId },
                        headers:customHeaders,
                        secure:false
            });
            return response;
        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}

export default ProductServiceApi;
