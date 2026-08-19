import vehicles from "./vehicles.json";

export type VehicleCategory = "motor" | "mobil";

export type VehicleModel = {
    id: string;
    name: string;
    year: number;
    image: string;
    description: string;
    fuelEfficiencyKmPerLiter: number;
    tankCapacityLiters: number;
};

export type VehicleBrand = {
    id: string;
    name: string;
    image: string;
    models: VehicleModel[];
};

export type VehicleCategoryData = {
    label: string;
    subtitle: string;
    image: string;
    brands: VehicleBrand[];
};

export const vehicleCatalog: Record<VehicleCategory, VehicleCategoryData> =
    vehicles as Record<VehicleCategory, VehicleCategoryData>;

export const WEBSITE_NAME = "Fuel Estimator";

export function getVehicle(
    category: VehicleCategory,
    brandId: string,
    modelId: string
) {
    const categoryData = vehicleCatalog[category];

    const brand = categoryData.brands.find(item => item.id === brandId);

    if (!brand) {
        return null;
    }

    const model = brand.models.find(item => item.id === modelId);

    if (!model) {
        return null;
    }

    return {
        category,
        brand,
        model
    };
}
