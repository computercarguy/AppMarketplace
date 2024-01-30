import { AddressDTO } from "./AddressDTO";

export interface PaymentMethodDataDTO {
    Id: number,
    Provider: String,
    Type: String,
    Address: AddressDTO,
    Name: String,
    Phone: String,
    Email: String,
    LinkEmail: String,
    ExpDate: String,
    Last4: String,
    Brand: String
}