import React from "react";
import { DataGrid } from "@mui/x-data-grid";

export default function InvoiceItems(params) {
    let total = 0;
    params.items.forEach((element) => {
        total += element.Price * element.Qty;
    });

    return (
        <div class="column">
            <div class="row">
                <h4>Invoice Items:</h4>
                <div class="spacer"></div>
                <div class="leftColumn ">
                    <button
                        type="button"
                        onClick={() => {
                            params.updatePaymentMethodDetails(
                                params.me,
                                params.paymentMethod
                            );
                        }}
                    >
                        Payment Details
                    </button>
                </div>
            </div>
            <DataGrid
                pageSize={10}
                autoHeight={true}
                getRowId={(row) => row.Id}
                columns={[
                    { field: "Name", width: 100 },
                    { field: "Qty", header: "Quantity", width: 100 },
                    {
                        field: "Price",
                        width: 150,
                        renderCell: (params) => {
                            return "$" + params.row.Price.toFixed(2);
                        }
                    },
                    {
                        field: "SubTotal",
                        width: 150,
                        renderCell: (params) => {
                            return (
                                "$" +
                                (params.row.Price * params.row.Qty).toFixed(2)
                            );
                        }
                    }
                ]}
                rows={params.items}
            />
            <div class="row">
                <div class="spacer"></div>
                <div
                    class="leftColumn"
                    style={{ fontWeight: "bold", color: "red" }}
                >
                    Total:
                </div>{" "}
                ${total.toFixed(2)}
            </div>
        </div>
    );
}
