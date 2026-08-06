import { IApi } from "../../types";
import { IProductsResponse, IOrderRequest, IOrderResponse } from "../../types";

export class WebLarekApi {
    constructor(private api: IApi) { }

    getProducts(): Promise<IProductsResponse> {
        return this.api.get<IProductsResponse>("/product/");
    }

    createOrder(data: IOrderRequest): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>("/order/", data);
    }
}
