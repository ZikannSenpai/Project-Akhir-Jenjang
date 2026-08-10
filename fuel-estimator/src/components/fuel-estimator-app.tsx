"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
    buildAiImageUrl,
    vehicleCatalog,
    WEBSITE_NAME,
    type VehicleCategory
} from "@/data/vehicles";
import { RevealSection } from "@/components/reveal-section";

type RangeResponse = {
    vehicleName: string;
    fuelEfficiencyKmPerLiter: number;
    tankCapacityLiters: number;
    estimatedRangeKm: number;
    safeRangeKm: number;
    percentageOfTank: number;
};

type TripResponse = {
    vehicleName: string;
    destinationLabel: string;
    destinationCoordinates: {
        latitude: number;
        longitude: number;
    };
    distanceKm: number;
    estimatedFuelUsedLiters: number;
    recommendedFuelBufferLiters: number;
    availableFuelLiters: number | null;
    isEnoughFuel: boolean | null;
    remainingFuelLiters: number | null;
    fuelEfficiencyKmPerLiter: number;
};

const categories: VehicleCategory[] = ["motor", "mobil"];

export function FuelEstimatorApp() {
    const [selectedCategory, setSelectedCategory] =
        useState<VehicleCategory>("motor");
    const [selectedBrandId, setSelectedBrandId] = useState("");
    const [selectedModelId, setSelectedModelId] = useState("");
    const [liters, setLiters] = useState("2");
    const [destinationQuery, setDestinationQuery] = useState("");
    const [origin, setOrigin] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [rangeResult, setRangeResult] = useState<RangeResponse | null>(null);
    const [tripResult, setTripResult] = useState<TripResponse | null>(null);
    const [rangeError, setRangeError] = useState("");
    const [tripError, setTripError] = useState("");
    const [isRangeLoading, setIsRangeLoading] = useState(false);
    const [isTripLoading, setIsTripLoading] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const selectedCategoryData = vehicleCatalog[selectedCategory];
    const selectedBrand =
        selectedCategoryData.brands.find(
            brand => brand.id === selectedBrandId
        ) ?? null;
    const selectedModel =
        selectedBrand?.models.find(model => model.id === selectedModelId) ??
        null;

    const vehicleHighlights = useMemo(
        () => [
            "Estimasi jarak tempuh hingga bensin habis",
            "GEBDT berbasis lokasi awal dan tujuan",
            "Dataset motor dan mobil populer di Indonesia"
        ],
        []
    );

    async function handleEstimateRange() {
        setRangeError("");
        setRangeResult(null);

        if (!selectedBrandId || !selectedModelId) {
            setRangeError("Pilih merek dan jenis kendaraan terlebih dahulu.");
            return;
        }

        const parsedLiters = Number(liters);
        if (!Number.isFinite(parsedLiters) || parsedLiters <= 0) {
            setRangeError("Masukkan volume bensin yang valid.");
            return;
        }

        setIsRangeLoading(true);

        try {
            const response = await fetch("/api/estimate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    category: selectedCategory,
                    brandId: selectedBrandId,
                    modelId: selectedModelId,
                    liters: parsedLiters
                })
            });

            const data = (await response.json()) as RangeResponse & {
                message?: string;
            };

            if (!response.ok) {
                throw new Error(
                    data.message ?? "Gagal menghitung estimasi jarak."
                );
            }

            setRangeResult(data);
        } catch (error) {
            setRangeError(
                error instanceof Error ? error.message : "Terjadi kesalahan."
            );
        } finally {
            setIsRangeLoading(false);
        }
    }

    async function handleUseCurrentLocation() {
        if (!navigator.geolocation) {
            setTripError("Browser ini belum mendukung GPS/geolocation.");
            return;
        }

        setTripError("");
        setIsLocating(true);

        try {
            const position = await new Promise<GeolocationPosition>(
                (resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    });
                }
            );

            setOrigin({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        } catch {
            setTripError("Izin lokasi ditolak atau lokasi gagal diambil.");
        } finally {
            setIsLocating(false);
        }
    }

    async function handleEstimateTrip() {
        setTripError("");
        setTripResult(null);

        if (!selectedBrandId || !selectedModelId) {
            setTripError("Pilih kendaraan dulu sebelum memakai GEBDT.");
            return;
        }

        if (!origin) {
            setTripError("Ambil lokasi awal Anda terlebih dahulu.");
            return;
        }

        if (!destinationQuery.trim()) {
            setTripError("Masukkan tujuan perjalanan Anda.");
            return;
        }

        setIsTripLoading(true);

        try {
            const response = await fetch("/api/gebdt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    category: selectedCategory,
                    brandId: selectedBrandId,
                    modelId: selectedModelId,
                    originLat: origin.latitude,
                    originLng: origin.longitude,
                    destinationQuery,
                    availableFuelLiters: liters ? Number(liters) : undefined
                })
            });

            const data = (await response.json()) as TripResponse & {
                message?: string;
            };

            if (!response.ok) {
                throw new Error(data.message ?? "Gagal menghitung GEBDT.");
            }

            setTripResult(data);
        } catch (error) {
            setTripError(
                error instanceof Error ? error.message : "Terjadi kesalahan."
            );
        } finally {
            setIsTripLoading(false);
        }
    }

    function handleSelectCategory(category: VehicleCategory) {
        setSelectedCategory(category);
        setSelectedBrandId("");
        setSelectedModelId("");
        setRangeResult(null);
        setTripResult(null);
        setRangeError("");
        setTripError("");
    }

    function handleSelectBrand(brandId: string) {
        setSelectedBrandId(brandId);
        setSelectedModelId("");
        setRangeResult(null);
        setTripResult(null);
        setRangeError("");
        setTripError("");
    }

    function handleSelectModel(modelId: string) {
        setSelectedModelId(modelId);
        setRangeResult(null);
        setTripResult(null);
        setRangeError("");
        setTripError("");
    }

    return (
        <div className="min-h-screen bg-[#05010c] text-white">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05010c]/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
                    <div>
                        <p className="text-xs uppercase tracking-[0.4em] text-violet-300/80">
                            Estimasi Bensin Responsif
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {WEBSITE_NAME}
                        </h1>
                    </div>
                    <div className="hidden rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-100 md:block">
                        Backend TypeScript + Siap Deploy Vercel
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-10">
                <RevealSection className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
                    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.4),_transparent_35%),linear-gradient(135deg,_rgba(20,16,35,0.98),_rgba(7,4,15,0.98))] p-8 shadow-[0_0_80px_rgba(124,58,237,0.14)] lg:p-10">
                        <span className="inline-flex rounded-full border border-violet-400/30 bg-violet-500/15 px-4 py-1 text-xs uppercase tracking-[0.35em] text-violet-200">
                            Fuel Distance Estimator
                        </span>
                        <h2 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                            Ketahui estimasi jarak tempuh bensin kendaraan Anda
                            sebelum perjalanan dimulai.
                        </h2>
                        <p className="mt-5 max-w-2xl text-base leading-8 text-white/70 md:text-lg">
                            {WEBSITE_NAME} membantu meminimalisir risiko
                            kehabisan bensin saat berkendara dekat maupun jauh
                            dengan estimasi jarak berdasarkan jenis kendaraan,
                            volume bensin, dan GEBDT untuk kebutuhan rute
                            aktual.
                        </p>
                        <div className="mt-8 grid gap-3 sm:grid-cols-3">
                            {vehicleHighlights.map(item => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[2rem] border border-violet-400/20 bg-white/5 p-5 shadow-[0_0_50px_rgba(139,92,246,0.18)]">
                        <RemoteImage
                            src={buildAiImageUrl(
                                "realistic modern black car and motorcycle on a futuristic dark purple road, premium cinematic lighting, high detail automotive visual",
                                "portrait_16_9"
                            )}
                            alt="Ilustrasi kendaraan"
                            containerClassName="h-full min-h-[340px] w-full rounded-[1.5rem]"
                            imageClassName="object-cover"
                            priority
                        />
                    </div>
                </RevealSection>

                <RevealSection
                    className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-[0_0_50px_rgba(139,92,246,0.1)]"
                    delayMs={80}
                >
                    <div className="mb-6 flex flex-col gap-2">
                        <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
                            Page Utama
                        </p>
                        <h3 className="text-2xl font-semibold">
                            Pilih tipe kendaraan
                        </h3>
                        <p className="max-w-3xl text-white/65">
                            Pilih salah satu opsi berikut untuk menampilkan
                            merek, jenis kendaraan, dan tahun pembuatan yang
                            sesuai.
                        </p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {categories.map(category => {
                            const item = vehicleCatalog[category];
                            const active = selectedCategory === category;

                            return (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() =>
                                        handleSelectCategory(category)
                                    }
                                    className={`pressable group overflow-hidden rounded-[1.75rem] border text-left transition-all duration-300 ${
                                        active
                                            ? "border-violet-400 bg-violet-500/15 shadow-[0_0_40px_rgba(139,92,246,0.22)]"
                                            : "border-white/10 bg-[#0d0916] hover:border-violet-400/40 hover:bg-violet-500/8"
                                    }`}
                                >
                                    <RemoteImage
                                        src={buildAiImageUrl(item.imagePrompt)}
                                        alt={item.label}
                                        containerClassName="h-52 w-full"
                                        imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="space-y-3 p-5">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-2xl font-semibold">
                                                {item.label}
                                            </h4>
                                            <span className="rounded-full border border-violet-300/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-violet-200">
                                                {active ? "Terpilih" : "Pilih"}
                                            </span>
                                        </div>
                                        <p className="text-sm leading-7 text-white/65">
                                            {item.subtitle}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </RevealSection>

                <RevealSection
                    className="grid gap-6 lg:grid-cols-[1fr_1.2fr]"
                    delayMs={120}
                >
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
                            Merek Kendaraan
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            Semua merek{" "}
                            {selectedCategoryData.label.toLowerCase()}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-white/65">
                            Pilih merek untuk menampilkan jenis kendaraan dan
                            tahun pembuatan yang tersedia pada katalog estimasi.
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            {selectedCategoryData.brands.map(brand => {
                                const active = brand.id === selectedBrandId;

                                return (
                                    <button
                                        key={brand.id}
                                        type="button"
                                        onClick={() =>
                                            handleSelectBrand(brand.id)
                                        }
                                        className={`pressable group overflow-hidden rounded-[1.5rem] border text-left transition-all duration-300 ${
                                            active
                                                ? "border-violet-400 bg-violet-500/15 shadow-[0_0_35px_rgba(168,85,247,0.18)]"
                                                : "border-white/10 bg-[#0c0815] hover:border-violet-400/40 hover:bg-white/6"
                                        }`}
                                    >
                                        <RemoteImage
                                            src={buildAiImageUrl(
                                                brand.imagePrompt
                                            )}
                                            alt={brand.name}
                                            containerClassName="h-36 w-full"
                                            imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="flex items-center justify-between p-4">
                                            <div>
                                                <h4 className="text-lg font-semibold">
                                                    {brand.name}
                                                </h4>
                                                <p className="text-sm text-white/60">
                                                    {brand.models.length} jenis
                                                    kendaraan
                                                </p>
                                            </div>
                                            <span className="text-xs uppercase tracking-[0.25em] text-violet-200/70">
                                                {active ? "Aktif" : "Tap"}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
                            Jenis Kendaraan
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            {selectedBrand
                                ? `Model ${selectedBrand.name}`
                                : "Pilih merek terlebih dahulu"}
                        </h3>
                        <p className="mt-3 text-sm leading-7 text-white/65">
                            Setelah memilih model, Anda dapat mengisi volume
                            bensin untuk melihat estimasi jarak tempuh hingga
                            bensin habis.
                        </p>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {selectedBrand ? (
                                selectedBrand.models.map(model => {
                                    const active = model.id === selectedModelId;

                                    return (
                                        <button
                                            key={model.id}
                                            type="button"
                                            onClick={() =>
                                                handleSelectModel(model.id)
                                            }
                                            className={`pressable group overflow-hidden rounded-[1.5rem] border text-left transition-all duration-300 ${
                                                active
                                                    ? "border-violet-400 bg-violet-500/15 shadow-[0_0_35px_rgba(168,85,247,0.18)]"
                                                    : "border-white/10 bg-[#0c0815] hover:border-violet-400/40 hover:bg-white/6"
                                            }`}
                                        >
                                            <RemoteImage
                                                src={buildAiImageUrl(
                                                    model.imagePrompt
                                                )}
                                                alt={`${model.name} ${model.year}`}
                                                containerClassName="h-40 w-full"
                                                imageClassName="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="space-y-3 p-4">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div>
                                                        <h4 className="text-lg font-semibold">
                                                            {model.name}
                                                        </h4>
                                                        <p className="text-sm text-violet-200/80">
                                                            Tahun {model.year}
                                                        </p>
                                                    </div>
                                                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70">
                                                        {
                                                            model.fuelEfficiencyKmPerLiter
                                                        }{" "}
                                                        km/L
                                                    </span>
                                                </div>
                                                <p className="text-sm leading-7 text-white/60">
                                                    {model.description}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-[#090611] p-6 text-white/55 md:col-span-2">
                                    Daftar model akan muncul setelah Anda
                                    memilih merek kendaraan.
                                </div>
                            )}
                        </div>
                    </div>
                </RevealSection>

                <RevealSection
                    className="grid gap-6 lg:grid-cols-[1fr_0.95fr]"
                    delayMs={160}
                >
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
                            Kalkulasi Volume Bensin
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            Hitung estimasi jarak yang dapat ditempuh
                        </h3>

                        <div className="mt-6 grid gap-4">
                            <div className="rounded-[1.5rem] border border-white/10 bg-[#0a0712] p-5">
                                <p className="text-sm text-white/55">
                                    Kendaraan terpilih
                                </p>
                                <p className="mt-2 text-xl font-semibold">
                                    {selectedModel
                                        ? `${selectedBrand?.name} ${selectedModel.name} ${selectedModel.year}`
                                        : "Belum ada kendaraan yang dipilih"}
                                </p>
                                <p className="mt-2 text-sm text-white/60">
                                    {selectedModel
                                        ? `${selectedModel.fuelEfficiencyKmPerLiter} km/L | kapasitas tangki ${selectedModel.tankCapacityLiters} L`
                                        : "Pilih merek dan jenis kendaraan terlebih dahulu."}
                                </p>
                            </div>

                            <label className="rounded-[1.5rem] border border-white/10 bg-[#0a0712] p-5 transition-transform duration-300 focus-within:scale-[1.01] focus-within:border-violet-400/50">
                                <span className="text-sm text-white/60">
                                    Volume bensin (Liter)
                                </span>
                                <input
                                    type="number"
                                    min="0.1"
                                    step="0.1"
                                    value={liters}
                                    onChange={event =>
                                        setLiters(event.target.value)
                                    }
                                    className="mt-3 w-full border-none bg-transparent text-3xl font-semibold outline-none"
                                    placeholder="Contoh: 2.5"
                                />
                            </label>

                            <button
                                type="button"
                                onClick={handleEstimateRange}
                                disabled={isRangeLoading}
                                className="pressable rounded-[1.5rem] bg-violet-500 px-5 py-4 text-base font-semibold text-white shadow-[0_16px_50px_rgba(139,92,246,0.3)] transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isRangeLoading
                                    ? "Menghitung estimasi..."
                                    : "Hitung Estimasi Jarak"}
                            </button>

                            {rangeError ? (
                                <div className="rounded-[1.25rem] border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                                    {rangeError}
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-violet-400/20 bg-[linear-gradient(180deg,_rgba(29,15,47,0.95),_rgba(10,7,18,0.95))] p-6 shadow-[0_0_50px_rgba(139,92,246,0.16)]">
                        <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
                            Hasil Estimasi
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            {rangeResult
                                ? "Estimasi siap dibaca"
                                : "Menunggu perhitungan"}
                        </h3>

                        {rangeResult ? (
                            <div className="mt-6 grid gap-4">
                                <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
                                    <p className="text-sm text-white/55">
                                        Kendaraan
                                    </p>
                                    <p className="mt-2 text-lg font-semibold">
                                        {rangeResult.vehicleName}
                                    </p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <StatCard
                                        label="Jarak maksimum"
                                        value={`${formatNumber(
                                            rangeResult.estimatedRangeKm
                                        )} km`}
                                    />
                                    <StatCard
                                        label="Jarak aman"
                                        value={`${formatNumber(
                                            rangeResult.safeRangeKm
                                        )} km`}
                                    />
                                    <StatCard
                                        label="Efisiensi rata-rata"
                                        value={`${formatNumber(
                                            rangeResult.fuelEfficiencyKmPerLiter
                                        )} km/L`}
                                    />
                                    <StatCard
                                        label="Isi tangki saat ini"
                                        value={`${formatNumber(
                                            rangeResult.percentageOfTank
                                        )}%`}
                                    />
                                </div>
                                <div className="rounded-[1.5rem] border border-violet-300/20 bg-violet-500/10 p-5 text-sm leading-7 text-violet-100/90">
                                    Saran aman: gunakan estimasi jarak aman
                                    sebagai patokan perjalanan agar tetap ada
                                    cadangan bahan bakar sebelum tangki
                                    benar-benar habis.
                                </div>
                            </div>
                        ) : (
                            <div className="mt-6 rounded-[1.5rem] border border-dashed border-white/15 bg-[#090611] p-5 text-sm leading-7 text-white/55">
                                Hasil estimasi akan tampil di sini setelah Anda
                                memilih kendaraan dan memasukkan volume bensin.
                            </div>
                        )}
                    </div>
                </RevealSection>

                <RevealSection
                    className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
                    delayMs={200}
                >
                    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
                                GEBDT
                            </p>
                            <h3 className="mt-2 text-2xl font-semibold">
                                Gasoline Estimate Based on Distance Traveled
                            </h3>
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/65">
                                Gunakan GPS lokasi saat ini, lalu masukkan
                                tujuan berupa nama tempat, alamat, kota, atau
                                koordinat `lat,lng`. Sistem akan memperkirakan
                                jarak dan kebutuhan bensin untuk menempuh rute
                                tersebut.
                            </p>

                            <div className="mt-6 grid gap-4">
                                <button
                                    type="button"
                                    onClick={handleUseCurrentLocation}
                                    disabled={isLocating}
                                    className="pressable rounded-[1.5rem] border border-violet-400/30 bg-violet-500/10 px-5 py-4 text-left transition hover:border-violet-300/50 hover:bg-violet-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <span className="block text-sm text-white/60">
                                        Lokasi awal
                                    </span>
                                    <span className="mt-2 block text-lg font-semibold">
                                        {isLocating
                                            ? "Mengambil koordinat GPS..."
                                            : origin
                                            ? `${formatNumber(
                                                  origin.latitude,
                                                  5
                                              )}, ${formatNumber(
                                                  origin.longitude,
                                                  5
                                              )}`
                                            : "Gunakan lokasi saya"}
                                    </span>
                                </button>

                                <label className="rounded-[1.5rem] border border-white/10 bg-[#0a0712] p-5 transition-transform duration-300 focus-within:scale-[1.01] focus-within:border-violet-400/50">
                                    <span className="text-sm text-white/60">
                                        Tujuan perjalanan
                                    </span>
                                    <input
                                        type="text"
                                        value={destinationQuery}
                                        onChange={event =>
                                            setDestinationQuery(
                                                event.target.value
                                            )
                                        }
                                        className="mt-3 w-full border-none bg-transparent text-lg outline-none placeholder:text-white/25"
                                        placeholder="Contoh: Monas Jakarta atau -6.1754, 106.8272"
                                    />
                                </label>

                                <button
                                    type="button"
                                    onClick={handleEstimateTrip}
                                    disabled={isTripLoading}
                                    className="pressable rounded-[1.5rem] bg-white px-5 py-4 text-base font-semibold text-[#12091f] transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isTripLoading
                                        ? "Menghitung GEBDT..."
                                        : "Hitung Kebutuhan Bensin"}
                                </button>

                                {tripError ? (
                                    <div className="rounded-[1.25rem] border border-rose-400/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                                        {tripError}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-violet-400/20 bg-[linear-gradient(180deg,_rgba(19,10,31,0.98),_rgba(8,6,14,0.98))] p-5">
                            <p className="text-sm text-white/55">Hasil GEBDT</p>
                            {tripResult ? (
                                <div className="mt-4 grid gap-4">
                                    <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                                        <p className="text-sm text-white/55">
                                            Tujuan
                                        </p>
                                        <p className="mt-2 text-lg font-semibold">
                                            {tripResult.destinationLabel}
                                        </p>
                                    </div>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <StatCard
                                            label="Estimasi jarak"
                                            value={`${formatNumber(
                                                tripResult.distanceKm
                                            )} km`}
                                        />
                                        <StatCard
                                            label="Bensin terpakai"
                                            value={`${formatNumber(
                                                tripResult.estimatedFuelUsedLiters
                                            )} L`}
                                        />
                                        <StatCard
                                            label="Cadangan disarankan"
                                            value={`${formatNumber(
                                                tripResult.recommendedFuelBufferLiters
                                            )} L`}
                                        />
                                        <StatCard
                                            label="Efisiensi kendaraan"
                                            value={`${formatNumber(
                                                tripResult.fuelEfficiencyKmPerLiter
                                            )} km/L`}
                                        />
                                    </div>
                                    {tripResult.isEnoughFuel !== null ? (
                                        <div
                                            className={`rounded-[1.25rem] border px-4 py-4 text-sm leading-7 ${
                                                tripResult.isEnoughFuel
                                                    ? "border-emerald-400/25 bg-emerald-500/10 text-emerald-100"
                                                    : "border-amber-300/25 bg-amber-400/10 text-amber-100"
                                            }`}
                                        >
                                            {tripResult.isEnoughFuel
                                                ? `Bensin saat ini diperkirakan cukup. Sisa bensin setelah perjalanan sekitar ${formatNumber(
                                                      Math.max(
                                                          tripResult.remainingFuelLiters ??
                                                              0,
                                                          0
                                                      )
                                                  )} L.`
                                                : `Bensin saat ini diperkirakan belum aman. Tambahkan setidaknya sekitar ${formatNumber(
                                                      Math.max(
                                                          tripResult.recommendedFuelBufferLiters -
                                                              (tripResult.availableFuelLiters ??
                                                                  0),
                                                          0
                                                      )
                                                  )} L agar perjalanan lebih aman.`}
                                        </div>
                                    ) : null}
                                </div>
                            ) : (
                                <div className="mt-4 rounded-[1.5rem] border border-dashed border-white/15 bg-[#090611] p-5 text-sm leading-7 text-white/55">
                                    Panel ini akan menampilkan estimasi bensin
                                    berdasarkan jarak aktual dari lokasi saat
                                    ini ke titik tujuan.
                                </div>
                            )}
                        </div>
                    </div>
                </RevealSection>

                <RevealSection
                    className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]"
                    delayMs={240}
                >
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-violet-200/80">
                            Kenapa Web Ini Berguna
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            Dirancang untuk meminimalisir kehabisan bensin
                        </h3>
                        <div className="mt-5 grid gap-3">
                            {[
                                "Membantu pengendara merencanakan isi bensin sebelum perjalanan.",
                                "Memberikan gambaran jarak tempuh berdasarkan kendaraan yang dipakai.",
                                "Menyediakan estimasi kebutuhan bensin untuk rute nyata menggunakan GPS.",
                                "Cocok untuk presentasi Projek Akhir Jenjang dan deployment ke Vercel."
                            ].map(item => (
                                <div
                                    key={item}
                                    className="rounded-[1.25rem] border border-white/10 bg-[#0a0712] px-4 py-4 text-sm text-white/75"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[2rem] border border-violet-400/20 bg-violet-500/10 p-6">
                        <p className="text-sm uppercase tracking-[0.3em] text-violet-100/85">
                            Credit
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                            Pembuat & Asisten
                        </h3>
                        <div className="mt-5 grid gap-4">
                            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                                <p className="text-sm text-white/55">
                                    Pembuat Web
                                </p>
                                <p className="mt-2 text-xl font-semibold">
                                    Anda
                                </p>
                                <p className="mt-2 text-sm text-white/65">
                                    Pengembang utama web untuk kebutuhan Projek
                                    Akhir Jenjang.
                                </p>
                            </div>
                            <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
                                <p className="text-sm text-white/55">Asisten</p>
                                <p className="mt-2 text-xl font-semibold">
                                    TRAE AI
                                </p>
                                <p className="mt-2 text-sm text-white/65">
                                    Membantu perancangan UI/UX, backend
                                    TypeScript, dan alur estimasi.
                                </p>
                            </div>
                        </div>
                    </div>
                </RevealSection>
            </main>

            <footer className="border-t border-white/10 bg-black/30">
                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 lg:px-10">
                    <p className="text-lg font-semibold">{WEBSITE_NAME}</p>
                    <p className="max-w-3xl text-sm leading-7 text-white/60">
                        Web estimasi bensin responsif untuk mengetahui perkiraan
                        jarak tempuh kendaraan motor maupun mobil berdasarkan
                        volume bensin, serta kebutuhan bahan bakar berdasarkan
                        jarak perjalanan aktual.
                    </p>
                </div>
            </footer>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-white/55">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
        </div>
    );
}

function RemoteImage({
    src,
    alt,
    containerClassName,
    imageClassName,
    priority = false
}: {
    src: string;
    alt: string;
    containerClassName: string;
    imageClassName: string;
    priority?: boolean;
}) {
    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            <Image
                src={src}
                alt={alt}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, 50vw"
                className={imageClassName}
            />
        </div>
    );
}

function formatNumber(value: number, maximumFractionDigits = 1) {
    return new Intl.NumberFormat("id-ID", {
        maximumFractionDigits
    }).format(value);
}
