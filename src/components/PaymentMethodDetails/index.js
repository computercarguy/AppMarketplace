import React from "react";
import "../../App.css";

export default function PaymentMethodDetails(params) {
    function CapitalizeFirstLetter(word) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
    }

    return (
        <div>
            {params && params.details && (
                <div
                    className="column"
                    style={{ textAlign: "left", marginLeft: 10 }}
                >
                    <h3>Payment Method Details:</h3>
                    {params.details.Type === "card" && (
                        <div>
                            <div>
                                Card:{" "}
                                {CapitalizeFirstLetter(params.details.Brand)}{" "}
                                {params.details.TypeImage && (
                                    <img
                                        src={params.details.TypeImage}
                                        height={25}
                                        alt={params.details.Brand}
                                    />
                                )}
                            </div>
                            <div>Expiration Date: {params.details.ExpDate}</div>
                            <div>Last 4: {params.details.Last4}</div>
                        </div>
                    )}
                    {params.details.Type !== "card" && (
                        <div>
                            {CapitalizeFirstLetter(params.details.Type)}{" "}
                            {params.details.TypeImage && (
                                <img
                                    src={params.details.TypeImage}
                                    height={25}
                                    alt={params.details.Type}
                                />
                            )}
                        </div>
                    )}
                    <br />
                    <div>Name: {params.details.Name}</div>
                    <div>Email: {params.details.Email}</div>
                    <div>Phone: {params.details.Phone}</div>
                    <h4>Billing Address:</h4>
                    <div>{params.details.Address.Line1}</div>
                    <div>{params.details.Address.Line2}</div>
                    <div>
                        {params.details.Address.City},{" "}
                        {params.details.Address.State}{" "}
                        {params.details.Address.Zip}
                    </div>
                    <div>{params.details.Address.Country}</div>
                </div>
            )}
        </div>
    );
}
