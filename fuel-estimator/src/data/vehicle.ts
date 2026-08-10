export type VehicleCategory = "motor" | "mobil";

export type VehicleModel = {
    id: string;
    name: string;
    year: number;
    fuelEfficiencyKmPerLiter: number;
    tankCapacityLiters: number;
    description: string;
    imagePrompt: string;
};

export type VehicleBrand = {
    id: string;
    name: string;
    imagePrompt: string;
    models: VehicleModel[];
};

export type VehicleCategoryData = {
    label: string;
    subtitle: string;
    imagePrompt: string;
    brands: VehicleBrand[];
};

export type VehicleCatalog = Record<VehicleCategory, VehicleCategoryData>;

export const WEBSITE_NAME = "RuteBensin";

export function buildAiImageUrl(
    prompt: string,
    imageSize:
        | "square_hd"
        | "square"
        | "portrait_4_3"
        | "portrait_16_9"
        | "landscape_4_3"
        | "landscape_16_9" = "landscape_16_9"
) {
    return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
        prompt
    )}&image_size=${imageSize}`;
}

export const vehicleCatalog: VehicleCatalog = {
    motor: {
        label: "Motor",
        subtitle:
            "Hemat, lincah, dan ideal untuk perjalanan harian maupun touring ringan.",
        imagePrompt:
            "cinematic modern indonesian scooter and motorcycle lineup parked on a glossy dark purple studio floor, realistic lighting, premium automotive photography, black and violet color palette",
        brands: [
            {
                id: "honda",
                name: "Honda",
                imagePrompt:
                    "realistic close-up honda motorcycles lineup in a premium showroom, black metallic accents, purple ambient lights, highly detailed automotive photography",
                models: [
                    {
                        id: "beat-2023",
                        name: "Beat CBS",
                        year: 2023,
                        fuelEfficiencyKmPerLiter: 60,
                        tankCapacityLiters: 4.2,
                        description:
                            "Skuter harian irit untuk mobilitas kota dan jarak menengah.",
                        imagePrompt:
                            "black honda beat scooter 2023 on dark studio background with purple neon rim light, ultra realistic product photography"
                    },
                    {
                        id: "vario-160-2024",
                        name: "Vario 160",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 45,
                        tankCapacityLiters: 5.5,
                        description:
                            "Skuter premium bertenaga dengan konsumsi bahan bakar efisien.",
                        imagePrompt:
                            "black honda vario 160 2024 scooter in premium dark purple showroom, realistic motorcycle commercial photography"
                    },
                    {
                        id: "pcx-160-2024",
                        name: "PCX 160",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 42,
                        tankCapacityLiters: 8.1,
                        description:
                            "Motor nyaman untuk komuter jauh dengan tangki lebih besar.",
                        imagePrompt:
                            "elegant black honda pcx 160 2024 scooter with subtle violet lighting, premium realistic studio photo"
                    }
                ]
            },
            {
                id: "yamaha",
                name: "Yamaha",
                imagePrompt:
                    "yamaha motorcycles lineup in a sleek futuristic dealership, black body paint, purple lights, realistic showroom photo",
                models: [
                    {
                        id: "mio-m3-2022",
                        name: "Mio M3",
                        year: 2022,
                        fuelEfficiencyKmPerLiter: 55,
                        tankCapacityLiters: 4.2,
                        description:
                            "Motor ringan dan efisien untuk penggunaan sehari-hari.",
                        imagePrompt:
                            "black yamaha mio m3 2022 scooter in dark premium photo studio with purple highlights, realistic"
                    },
                    {
                        id: "nmax-155-2024",
                        name: "NMAX 155",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 40,
                        tankCapacityLiters: 7.1,
                        description:
                            "Skuter touring populer dengan kenyamanan tinggi.",
                        imagePrompt:
                            "black yamaha nmax 155 2024 maxi scooter on luxury dark purple stage, photorealistic commercial image"
                    },
                    {
                        id: "aerox-155-2024",
                        name: "Aerox 155",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 37,
                        tankCapacityLiters: 5.5,
                        description:
                            "Motor sporty untuk pengendara yang mengutamakan performa.",
                        imagePrompt:
                            "black yamaha aerox 155 2024 scooter in dynamic dark studio, purple motion glow, realistic"
                    }
                ]
            },
            {
                id: "suzuki",
                name: "Suzuki",
                imagePrompt:
                    "suzuki motorcycles arranged in a premium black showroom with violet ambient glow, realistic detailed photography",
                models: [
                    {
                        id: "nex-ii-2023",
                        name: "Nex II",
                        year: 2023,
                        fuelEfficiencyKmPerLiter: 52,
                        tankCapacityLiters: 3.6,
                        description:
                            "Pilihan ekonomis untuk perjalanan pendek sampai menengah.",
                        imagePrompt:
                            "black suzuki nex ii 2023 scooter in dramatic violet studio light, realistic product photo"
                    },
                    {
                        id: "address-2022",
                        name: "Address FI",
                        year: 2022,
                        fuelEfficiencyKmPerLiter: 45,
                        tankCapacityLiters: 5.2,
                        description:
                            "Motor praktis dengan bagasi lega untuk kebutuhan harian.",
                        imagePrompt:
                            "black suzuki address fi 2022 scooter on glossy dark stage with purple lighting, photorealistic"
                    },
                    {
                        id: "gsx-r150-2021",
                        name: "GSX-R150",
                        year: 2021,
                        fuelEfficiencyKmPerLiter: 40,
                        tankCapacityLiters: 11,
                        description:
                            "Motor sport ringan dengan efisiensi cukup baik di kelasnya.",
                        imagePrompt:
                            "black suzuki gsx r150 2021 sport motorcycle with purple neon reflections, realistic automotive studio shot"
                    }
                ]
            },
            {
                id: "kawasaki",
                name: "Kawasaki",
                imagePrompt:
                    "kawasaki motorcycle lineup in luxury dark room with purple light accents, realistic studio photography",
                models: [
                    {
                        id: "w175-2022",
                        name: "W175",
                        year: 2022,
                        fuelEfficiencyKmPerLiter: 35,
                        tankCapacityLiters: 13.5,
                        description:
                            "Motor retro klasik untuk pemakaian santai dan turing.",
                        imagePrompt:
                            "black kawasaki w175 2022 retro motorcycle in elegant dark purple studio, realistic"
                    },
                    {
                        id: "ninja-250-2024",
                        name: "Ninja 250",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 28,
                        tankCapacityLiters: 14,
                        description:
                            "Motor sport performa tinggi untuk jarak menengah hingga jauh.",
                        imagePrompt:
                            "black kawasaki ninja 250 2024 sport bike on moody black and violet set, ultra realistic"
                    },
                    {
                        id: "klx-150-2023",
                        name: "KLX 150",
                        year: 2023,
                        fuelEfficiencyKmPerLiter: 32,
                        tankCapacityLiters: 6.9,
                        description:
                            "Motor trail serbaguna untuk kombinasi jalan kota dan luar kota.",
                        imagePrompt:
                            "black kawasaki klx 150 2023 trail bike in rugged dark environment with purple accent lighting, realistic"
                    }
                ]
            }
        ]
    },
    mobil: {
        label: "Mobil",
        subtitle: "Nyaman untuk keluarga, perjalanan jauh, dan rute antarkota.",
        imagePrompt:
            "premium modern indonesian cars lineup in a glossy dark studio, black paint, purple ambient lighting, realistic automotive commercial photography",
        brands: [
            {
                id: "toyota",
                name: "Toyota",
                imagePrompt:
                    "toyota car lineup in a luxurious black showroom with violet ambient light, realistic automotive photo",
                models: [
                    {
                        id: "avanza-2024",
                        name: "Avanza",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 14,
                        tankCapacityLiters: 43,
                        description:
                            "MPV keluarga populer dengan efisiensi yang stabil.",
                        imagePrompt:
                            "black toyota avanza 2024 mpv in premium dark purple studio, realistic car photography"
                    },
                    {
                        id: "calya-2023",
                        name: "Calya",
                        year: 2023,
                        fuelEfficiencyKmPerLiter: 18,
                        tankCapacityLiters: 36,
                        description:
                            "Mobil kompak hemat untuk perjalanan dalam kota dan luar kota.",
                        imagePrompt:
                            "black toyota calya 2023 compact mpv on dark studio floor with purple highlights, realistic"
                    },
                    {
                        id: "innova-zenix-2024",
                        name: "Innova Zenix",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 15,
                        tankCapacityLiters: 52,
                        description:
                            "MPV premium nyaman untuk perjalanan jauh.",
                        imagePrompt:
                            "black toyota innova zenix 2024 in elegant violet lit studio, premium realistic car shot"
                    }
                ]
            },
            {
                id: "honda",
                name: "Honda",
                imagePrompt:
                    "honda cars lineup in a futuristic dark showroom with subtle purple glow, realistic studio image",
                models: [
                    {
                        id: "brio-2024",
                        name: "Brio Satya",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 20,
                        tankCapacityLiters: 35,
                        description:
                            "City car lincah dengan konsumsi bahan bakar sangat efisien.",
                        imagePrompt:
                            "black honda brio satya 2024 hatchback in dark violet studio, realistic automotive ad photography"
                    },
                    {
                        id: "hrv-2024",
                        name: "HR-V",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 14,
                        tankCapacityLiters: 40,
                        description:
                            "SUV urban modern dengan kenyamanan dan efisiensi seimbang.",
                        imagePrompt:
                            "black honda hr-v 2024 suv in premium black and purple studio, photorealistic"
                    },
                    {
                        id: "mobilio-2021",
                        name: "Mobilio",
                        year: 2021,
                        fuelEfficiencyKmPerLiter: 17,
                        tankCapacityLiters: 42,
                        description:
                            "MPV keluarga yang tetap efisien untuk penggunaan harian.",
                        imagePrompt:
                            "black honda mobilio 2021 mpv on glossy dark floor with purple ambient light, realistic"
                    }
                ]
            },
            {
                id: "daihatsu",
                name: "Daihatsu",
                imagePrompt:
                    "daihatsu cars lineup in premium dark showroom, purple atmospheric lights, realistic car photography",
                models: [
                    {
                        id: "sigra-2024",
                        name: "Sigra",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 18,
                        tankCapacityLiters: 36,
                        description:
                            "Mobil keluarga ekonomis untuk kebutuhan rutin.",
                        imagePrompt:
                            "black daihatsu sigra 2024 compact mpv in dramatic dark purple studio, realistic"
                    },
                    {
                        id: "xenia-2024",
                        name: "Xenia",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 15,
                        tankCapacityLiters: 45,
                        description:
                            "MPV serbaguna untuk perjalanan pendek maupun jauh.",
                        imagePrompt:
                            "black daihatsu xenia 2024 mpv on luxurious dark set with violet glow, realistic"
                    },
                    {
                        id: "terios-2022",
                        name: "Terios",
                        year: 2022,
                        fuelEfficiencyKmPerLiter: 13,
                        tankCapacityLiters: 45,
                        description:
                            "SUV keluarga yang cocok untuk medan campuran.",
                        imagePrompt:
                            "black daihatsu terios 2022 suv in a dark purple automotive studio, realistic commercial shot"
                    }
                ]
            },
            {
                id: "suzuki",
                name: "Suzuki",
                imagePrompt:
                    "suzuki cars lineup in a sleek black showroom with violet neon ambience, realistic automotive photo",
                models: [
                    {
                        id: "ertiga-hybrid-2024",
                        name: "Ertiga Hybrid",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 19,
                        tankCapacityLiters: 45,
                        description:
                            "MPV hybrid efisien untuk keluarga dan perjalanan jauh.",
                        imagePrompt:
                            "black suzuki ertiga hybrid 2024 mpv in elegant dark purple studio, realistic"
                    },
                    {
                        id: "xl7-2024",
                        name: "XL7",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 16,
                        tankCapacityLiters: 45,
                        description:
                            "SUV crossover untuk kebutuhan keluarga aktif.",
                        imagePrompt:
                            "black suzuki xl7 2024 suv in dramatic violet lit studio, photorealistic"
                    },
                    {
                        id: "carry-2022",
                        name: "Carry Pick Up",
                        year: 2022,
                        fuelEfficiencyKmPerLiter: 13,
                        tankCapacityLiters: 43,
                        description:
                            "Kendaraan niaga ringan dengan konsumsi yang masih terukur.",
                        imagePrompt:
                            "black suzuki carry pickup 2022 in dark industrial studio with purple accent lighting, realistic"
                    }
                ]
            },
            {
                id: "mitsubishi",
                name: "Mitsubishi",
                imagePrompt:
                    "mitsubishi cars lineup in premium black showroom with purple ambient glow, realistic automotive photography",
                models: [
                    {
                        id: "xpander-2024",
                        name: "Xpander",
                        year: 2024,
                        fuelEfficiencyKmPerLiter: 15,
                        tankCapacityLiters: 45,
                        description:
                            "MPV modern dengan ruang kabin nyaman untuk keluarga.",
                        imagePrompt:
                            "black mitsubishi xpander 2024 mpv in stylish dark purple studio, realistic"
                    },
                    {
                        id: "pajero-2023",
                        name: "Pajero Sport",
                        year: 2023,
                        fuelEfficiencyKmPerLiter: 11,
                        tankCapacityLiters: 68,
                        description:
                            "SUV besar yang cocok untuk jarak jauh dan medan berat.",
                        imagePrompt:
                            "black mitsubishi pajero sport 2023 suv on luxurious dark set with violet lighting, realistic"
                    },
                    {
                        id: "l300-2022",
                        name: "L300",
                        year: 2022,
                        fuelEfficiencyKmPerLiter: 10,
                        tankCapacityLiters: 47,
                        description:
                            "Kendaraan utilitas dengan fokus daya angkut dan ketahanan.",
                        imagePrompt:
                            "black mitsubishi l300 2022 utility vehicle in dark industrial purple lit studio, realistic"
                    }
                ]
            }
        ]
    }
};

export function findVehicle(
    category: VehicleCategory,
    brandId: string,
    modelId: string
) {
    const brand = vehicleCatalog[category]?.brands.find(
        item => item.id === brandId
    );
    const model = brand?.models.find(item => item.id === modelId);

    if (!brand || !model) {
        return null;
    }

    return {
        category: vehicleCatalog[category],
        brand,
        model
    };
}
