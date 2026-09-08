import { NextResponse } from "next/server";
import { estimateTrip, type TripEstimateInput } from "@/lib/estimate";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const input: TripEstimateInput = {
            category: body.category,
            brandId: body.brandId,
            modelId: body.modelId,
            originLat: Number(body.originLat),
            originLng: Number(body.originLng),
            destinationQuery: String(body.destinationQuery ?? ""),
            availableFuelLiters:
                body.availableFuelLiters !== undefined
                    ? Number(body.availableFuelLiters)
                    : undefined
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

        if (
            !Number.isFinite(input.originLat) ||
            !Number.isFinite(input.originLng)
        ) {
            return NextResponse.json(
                {
                    message: "Koordinat lokasi awal tidak valid."
                },
                { status: 400 }
            );
        }

        if (
            input.originLat < -90 ||
            input.originLat > 90 ||
            input.originLng < -180 ||
            input.originLng > 180
        ) {
            return NextResponse.json(
                {
                    message: "Koordinat lokasi awal berada di luar batas."
                },
                { status: 400 }
            );
        }

        if (!input.destinationQuery.trim()) {
            return NextResponse.json(
                {
                    message: "Tujuan perjalanan wajib diisi."
                },
                { status: 400 }
            );
        }

        if (
            input.availableFuelLiters !== undefined &&
            (!Number.isFinite(input.availableFuelLiters) ||
                input.availableFuelLiters <= 0)
        ) {
            return NextResponse.json(
                {
                    message: "Volume bensin tidak valid."
                },
                { status: 400 }
            );
        }

        const result = await estimateTrip(input);

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
