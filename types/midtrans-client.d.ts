declare module "midtrans-client" {
  export interface MidtransConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  export interface ChargeAction {
    name: string;
    method: string;
    url: string;
  }

  export interface ChargeResponse {
    status_code: string;
    status_message: string;
    transaction_id: string;
    order_id: string;
    gross_amount: string;
    currency: string;
    payment_type: string;
    transaction_time: string;
    transaction_status: string;
    fraud_status: string;
    actions: ChargeAction[];
  }

  export class CoreApi {
    constructor(config: MidtransConfig);

    charge(parameter: any): Promise<ChargeResponse>;
  }
}