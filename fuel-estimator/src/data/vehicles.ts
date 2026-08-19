import vehicleData from "./vehicles.json";

export type VehicleCategory = "motor" | "mobil";

export type VehicleModel = {
    id: string;
    name: string;
    year: number;
    description: string;
    image: string;
    fuelEfficiencyKmPerLiter: number;
    tankCapacityLiters: number;
};

export type VehicleBrand = {
    id: string;
    name: string;
    description: string;
    image: string;
    models: VehicleModel[];
};

export type VehicleCategoryData = {
    label: string;
    subtitle: string;
    image: string;
    brands: VehicleBrand[];
};

export const vehicleCatalog = vehicleData.categories as Record<
    VehicleCategory,
    VehicleCategoryData
>;

export const WEBSITE_NAME = vehicleData.websiteName;

export function findVehicle(
    category: VehicleCategory,
    brandId: string,
    modelId: string
) {
    const categoryData = vehicleCatalog[category];

    if (!categoryData) {
        return null;
    }

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
