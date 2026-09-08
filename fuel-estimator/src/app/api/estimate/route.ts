import { NextResponse } from "next/server";
import { estimateRange, type RangeEstimateInput } from "@/lib/estimate";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const input: RangeEstimateInput = {
            category: body.category,
            brandId: body.brandId,
            modelId: body.modelId,
            liters: Number(body.liters)
        };

        if (input.category !== "motor" && input.category !== "mobil") {
            return NextResponse.json(
                {
                    message: "Kategori kendaraan tidak valid."
                },
                { status: 400 }
            );
        }

        if (!input.brandId || !input.modelId) {
            return NextResponse.json(
                {
                    message: "Merek dan model kendaraan wajib dipilih."
                },
                { status: 400 }
            );
        }

        if (!Number.isFinite(input.liters) || input.liters <= 0) {
            return NextResponse.json(
                {
                    message: "Volume bensin harus lebih besar dari 0 liter."
                },
                { status: 400 }
            );
        }

        const result = estimateRange(input);

        return NextResponse.json(result);
    } catch (error) {
        const message =
            error instanceof Error
                ? error.message
                : "Terjadi kesalahan pada server.";

        return NextResponse.json(
            {
                message
            },
            { status: 500 }
        );
    }
}
