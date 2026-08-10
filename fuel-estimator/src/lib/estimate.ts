import { findVehicle, type VehicleCategory } from "@/data/vehicles";

export type RangeEstimateInput = {
    category: VehicleCategory;
    brandId: string;
    modelId: string;
    liters: number;
};

export type TripEstimateInput = {
    category: VehicleCategory;
    brandId: string;
    modelId: string;
    originLat: number;
    originLng: number;
    destinationQuery: string;
    availableFuelLiters?: number;
};

export function estimateRange(input: RangeEstimateInput) {
    const vehicle = findVehicle(input.category, input.brandId, input.modelId);

    if (!vehicle) {
        throw new Error("Kendaraan tidak ditemukan.");
    }

    if (!Number.isFinite(input.liters) || input.liters <= 0) {
        throw new Error("Volume bensin harus lebih besar dari 0 liter.");
    }

    const estimatedRangeKm =
        input.liters * vehicle.model.fuelEfficiencyKmPerLiter;
    const safeRangeKm = estimatedRangeKm * 0.9;
    const percentageOfTank = Math.min(
        100,
        (input.liters / vehicle.model.tankCapacityLiters) * 100
    );

    return {
        vehicleName: `${vehicle.brand.name} ${vehicle.model.name} ${vehicle.model.year}`,
        fuelEfficiencyKmPerLiter: vehicle.model.fuelEfficiencyKmPerLiter,
        tankCapacityLiters: vehicle.model.tankCapacityLiters,
        estimatedRangeKm,
        safeRangeKm,
        percentageOfTank
    };
}

export function haversineDistanceKm(
    originLat: number,
    originLng: number,
    destinationLat: number,
    destinationLng: number
) {
    const earthRadiusKm = 6371;
    const dLat = toRadians(destinationLat - originLat);
    const dLng = toRadians(destinationLng - originLng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(originLat)) *
            Math.cos(toRadians(destinationLat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

export async function resolveDestination(destinationQuery: string) {
    const coordinateMatch = destinationQuery.match(
        /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/
    );

    if (coordinateMatch) {
        return {
            latitude: Number(coordinateMatch[1]),
            longitude: Number(coordinateMatch[2]),
            label: `Koordinat ${coordinateMatch[1]}, ${coordinateMatch[2]}`
        };
    }

    const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=id&q=${encodeURIComponent(
            destinationQuery
        )}`,
        {
            headers: {
                "User-Agent": "RuteBensin/1.0 academic-project"
            },
            cache: "no-store"
        }
    );

    if (!response.ok) {
        throw new Error("Layanan geocoding sedang tidak tersedia.");
    }

    const results = (await response.json()) as Array<{
        lat: string;
        lon: string;
        display_name: string;
    }>;

    if (!results.length) {
        throw new Error(
            "Tujuan tidak ditemukan. Coba gunakan nama lokasi yang lebih spesifik."
        );
    }

    return {
        latitude: Number(results[0].lat),
        longitude: Number(results[0].lon),
        label: results[0].display_name
    };
}

export async function estimateTrip(input: TripEstimateInput) {
    const vehicle = findVehicle(input.category, input.brandId, input.modelId);

    if (!vehicle) {
        throw new Error("Kendaraan tidak ditemukan.");
    }

    if (
        !Number.isFinite(input.originLat) ||
        !Number.isFinite(input.originLng)
    ) {
        throw new Error("Lokasi awal tidak valid.");
    }

    if (!input.destinationQuery.trim()) {
        throw new Error("Tujuan wajib diisi.");
    }

    const destination = await resolveDestination(input.destinationQuery);
    const distanceKm = haversineDistanceKm(
        input.originLat,
        input.originLng,
        destination.latitude,
        destination.longitude
    );
    const estimatedFuelUsedLiters =
        distanceKm / vehicle.model.fuelEfficiencyKmPerLiter;
    const recommendedFuelBufferLiters = estimatedFuelUsedLiters * 1.1;
    const availableFuelLiters =
        input.availableFuelLiters && input.availableFuelLiters > 0
            ? input.availableFuelLiters
            : null;
    const isEnoughFuel =
        availableFuelLiters !== null
            ? availableFuelLiters >= recommendedFuelBufferLiters
            : null;
    const remainingFuelLiters =
        availableFuelLiters !== null
            ? availableFuelLiters - estimatedFuelUsedLiters
            : null;

    return {
        vehicleName: `${vehicle.brand.name} ${vehicle.model.name} ${vehicle.model.year}`,
        destinationLabel: destination.label,
        destinationCoordinates: {
            latitude: destination.latitude,
            longitude: destination.longitude
        },
        distanceKm,
        estimatedFuelUsedLiters,
        recommendedFuelBufferLiters,
        availableFuelLiters,
        isEnoughFuel,
        remainingFuelLiters,
        fuelEfficiencyKmPerLiter: vehicle.model.fuelEfficiencyKmPerLiter
    };
}

function toRadians(value: number) {
    return (value * Math.PI) / 180;
}
