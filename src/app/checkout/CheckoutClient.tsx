"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Minus,
  Plus,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/LanguageContext";
import { z } from "zod";
import bdUpazilasData from "@/data/bdLocations.json";

const bdUpazilas = bdUpazilasData as Record<string, string[]>;

export default function CheckoutClient() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();
  const { t } = useTranslation();

  const getCheckoutSchema = () =>
    z.object({
      phone: z
        .string()
        .min(1, { message: t("errorRequiredPhone") as string })
        .regex(/^(?:01[3-9]\d{8}|1[3-9]\d{8})$/, {
          message: t("errorInvalidPhone") as string,
        }),
      fullName: z
        .string()
        .min(1, { message: t("errorRequiredName") as string })
        .min(3, { message: t("errorRequiredName") as string }),
      address: z
        .string()
        .min(1, { message: t("errorRequiredAddress") as string })
        .min(5, { message: t("errorRequiredAddress") as string }),
      division: z
        .string()
        .min(1, { message: t("errorRequiredDivision") as string }),
      district: z
        .string()
        .min(1, { message: t("errorRequiredDistrict") as string }),
      upazila: z.string().optional().or(z.literal("")),
    });
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [mounted, setMounted] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [checkoutNote, setCheckoutNote] = useState<string>("");

  React.useEffect(() => {
    setMounted(true);
    const fetchStore = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
        const res = await fetch(`${apiUrl}/store/my-store`);
        const json = await res.json();
        if (json.data?.settings?.checkoutNote) {
          setCheckoutNote(json.data.settings.checkoutNote);
        }
      } catch (err) {}
    };
    fetchStore();
  }, []);

  // Mock form state
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");

  // Auto-fill customer details from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("customerInfo");
      if (saved) {
        const info = JSON.parse(saved);
        if (info.phone) setPhone(info.phone);
        if (info.fullName) setFullName(info.fullName);
        if (info.address) setAddress(info.address);
        if (info.division) setDivision(info.division);
        if (info.district) setDistrict(info.district);
        if (info.upazila) setUpazila(info.upazila);
      }
    } catch (error) {
      console.error("Failed to load customer info", error);
    }
  }, []);

  const divisions = [
    "Dhaka",
    "Chattogram",
    "Khulna",
    "Rajshahi",
    "Sylhet",
    "Barishal",
    "Rangpur",
    "Mymensingh",
  ];

  const bdDistricts: Record<string, string[]> = {
    Dhaka: [
      "Dhaka",
      "Faridpur",
      "Gazipur",
      "Gopalganj",
      "Kishoreganj",
      "Madaripur",
      "Manikganj",
      "Munshiganj",
      "Narayanganj",
      "Narsingdi",
      "Rajbari",
      "Shariatpur",
      "Tangail",
    ],
    Chattogram: [
      "Bandarban",
      "Brahmanbaria",
      "Chandpur",
      "Chattogram",
      "Comilla",
      "Cox's Bazar",
      "Feni",
      "Khagrachari",
      "Lakshmipur",
      "Noakhali",
      "Rangamati",
    ],
    Khulna: [
      "Bagerhat",
      "Chuadanga",
      "Jessore",
      "Jhenaidah",
      "Khulna",
      "Kushtia",
      "Magura",
      "Meherpur",
      "Narail",
      "Satkhira",
    ],
    Rajshahi: [
      "Bogura",
      "Chapainawabganj",
      "Joypurhat",
      "Naogaon",
      "Natore",
      "Pabna",
      "Rajshahi",
      "Sirajganj",
    ],
    Sylhet: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
    Barishal: [
      "Barguna",
      "Barishal",
      "Bhola",
      "Jhalokati",
      "Patuakhali",
      "Pirojpur",
    ],
    Rangpur: [
      "Dinajpur",
      "Gaibandha",
      "Kurigram",
      "Lalmonirhat",
      "Nilphamari",
      "Panchagarh",
      "Rangpur",
      "Thakurgaon",
    ],
    Mymensingh: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
  };

  const deliveryCharge = 120;
  const grandTotal = totalPrice > 0 ? totalPrice + deliveryCharge : 0;

  const handleCheckout = async () => {
    const schema = getCheckoutSchema();
    const result = schema.safeParse({
      phone,
      fullName,
      address,
      division,
      district,
      upazila,
    });
    if (!result.success) {
      setFieldErrors(
        result.error.flatten().fieldErrors as Record<string, string[]>,
      );
      setTimeout(() => {
        const errorElement = document.querySelector(".border-red-500");
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    setFieldErrors({});
    setStatus("processing");
    try {
      const payload = {
        customerName: fullName,
        customerPhone: phone,
        shippingAddress: `${address}, ${upazila}, ${district}, ${division}`,
        note: deliveryNote,
        items: cartItems.map((item) => ({
          productId: item.productId || item.id,
          title: item.title,
          variantName: item.variantName || null,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subTotal: totalPrice,
        shippingCharge: deliveryCharge,
        totalPrice: grandTotal,
        paymentStatus: "unpaid",
      };

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const res = await fetch(`${apiUrl}/orders/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Checkout failed");

      // Save customer info for future auto-fill
      try {
        localStorage.setItem(
          "customerInfo",
          JSON.stringify({
            phone,
            fullName,
            address,
            division,
            district,
            upazila,
          }),
        );
      } catch (err) {
        console.error("Failed to save customer info", err);
      }

      setStatus("success");
      clearCart();
    } catch (e) {
      console.error(e);
      setStatus("idle");
      alert("Something went wrong during checkout. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {t("orderConfirmed")}
          </h1>
          <p className="text-gray-500 mb-8">{t("thankYouPurchase")}</p>
          <Link
            href="/"
            className="block w-full bg-primary hover:opacity-90 transition-opacity text-white font-bold py-4 px-8 rounded-xl"
          >
            {t("continueShopping")}
          </Link>
        </div>
      </div>
    );
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 font-sans">
      <main className="max-w-[1400px] mx-auto px-6 py-12 w-full">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 lg:p-12 flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left Column: Form */}
          <div className="flex-1 space-y-10">
            <h1 className="text-xl font-bold text-primary">
              {t("placeOrder")}
            </h1>

            {/* Contact */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-4">
                {t("contact")}
              </h2>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                  {t("phoneNumber")}
                </label>
                <div
                  className={`flex rounded-md border bg-white overflow-hidden focus-within:ring-1 focus-within:ring-primary ${fieldErrors.phone?.length ? "border-red-500" : "border-gray-200"}`}
                >
                  <div className="flex items-center px-4 border-r border-gray-200 bg-gray-50 shrink-0">
                    <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-700 rounded-full flex items-center justify-center overflow-hidden">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      </div>
                      (+880)
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (fieldErrors.phone)
                        setFieldErrors((prev) => ({ ...prev, phone: [] }));
                    }}
                    placeholder="Phone number"
                    className="flex-1 min-w-0 block w-full px-4 py-3 text-sm focus:outline-none"
                  />
                </div>
                {fieldErrors.phone?.[0] && (
                  <p className="text-xs text-red-500 mt-1">
                    {fieldErrors.phone[0]}
                  </p>
                )}
              </div>
            </section>

            {/* Personal Info */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-4">
                {t("personalInfo")}
              </h2>
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                    {t("fullName")}
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName)
                        setFieldErrors((prev) => ({ ...prev, fullName: [] }));
                    }}
                    placeholder="Full Name"
                    className={`block w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ${fieldErrors.fullName?.length ? "border-red-500" : "border-gray-200"}`}
                  />
                  {fieldErrors.fullName?.[0] && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.fullName[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                    {t("address")}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (fieldErrors.address)
                        setFieldErrors((prev) => ({ ...prev, address: [] }));
                    }}
                    placeholder="Address"
                    className={`block w-full px-4 py-3 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary ${fieldErrors.address?.length ? "border-red-500" : "border-gray-200"}`}
                  />
                  {fieldErrors.address?.[0] && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.address[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                    {t("selectDivision") as string}
                  </label>
                  <select
                    value={division}
                    onChange={(e) => {
                      setDivision(e.target.value);
                      setDistrict(""); // reset district when division changes
                      setUpazila(""); // reset upazila as well
                      if (fieldErrors.division)
                        setFieldErrors((prev) => ({ ...prev, division: [] }));
                    }}
                    className={`block w-full px-4 py-3 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary bg-white appearance-none ${fieldErrors.division?.length ? "border-red-500" : "border-gray-200"}`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    <option value="" disabled>
                      {t("selectDivision") as string}
                    </option>
                    {divisions.map((div) => (
                      <option key={div} value={div}>
                        {div}
                      </option>
                    ))}
                  </select>
                  {fieldErrors.division?.[0] && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.division[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                    {t("selectDistrict") as string}
                  </label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      setUpazila(""); // reset upazila when district changes
                      if (fieldErrors.district)
                        setFieldErrors((prev) => ({ ...prev, district: [] }));
                    }}
                    className={`block w-full px-4 py-3 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary bg-white appearance-none ${fieldErrors.district?.length ? "border-red-500" : "border-gray-200"} ${!division ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                    disabled={!division}
                  >
                    <option value="" disabled>
                      {t("selectDistrict") as string}
                    </option>
                    {division &&
                      bdDistricts[division]?.map((dist) => (
                        <option key={dist} value={dist}>
                          {dist}
                        </option>
                      ))}
                  </select>
                  {fieldErrors.district?.[0] && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.district[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
                    {t("selectUpazila") as string}
                  </label>
                  <select
                    value={upazila}
                    onChange={(e) => {
                      setUpazila(e.target.value);
                      if (fieldErrors.upazila)
                        setFieldErrors((prev) => ({ ...prev, upazila: [] }));
                    }}
                    className={`block w-full px-4 py-3 border rounded-md text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary bg-white appearance-none ${fieldErrors.upazila?.length ? "border-red-500" : "border-gray-200"} ${!district ? "opacity-50 cursor-not-allowed" : ""}`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                    disabled={!district}
                  >
                    <option value="" disabled>
                      {t("selectUpazila") as string}
                    </option>
                    {district &&
                      bdUpazilas[district]?.map((upz) => (
                        <option key={upz} value={upz}>
                          {upz}
                        </option>
                      ))}
                  </select>
                  {fieldErrors.upazila?.[0] && (
                    <p className="text-xs text-red-500 mt-1">
                      {fieldErrors.upazila[0]}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Payment Options */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-4">
                {t("paymentOptions")}
              </h2>
              <div className="border border-primary bg-gray-50 rounded-lg p-5 relative cursor-pointer flex items-center justify-between shadow-sm">
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-gray-900 text-sm">
                    {t("cashOnDelivery")}
                  </span>
                </div>
                <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white">
                  <Check size={12} strokeWidth={3} />
                </div>
              </div>

              {checkoutNote && (
                <p className="mt-2 text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {checkoutNote}
                </p>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[480px] shrink-0 flex flex-col relative before:hidden lg:before:block before:absolute before:-left-10 before:top-0 before:bottom-0 before:w-[1px] before:bg-gray-200">
            <div className="flex-1 space-y-8">
              {/* Cart Items List */}
              <div>
                <div className="max-h-[400px] overflow-y-auto pr-2 divide-y divide-gray-100">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      {t("yourCartIsEmpty")}
                    </div>
                  ) : (
                    cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="py-4 flex gap-4 items-start first:pt-0 border-b border-gray-100 last:border-0"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F8F9FA] rounded overflow-hidden shrink-0 border border-gray-200 flex items-center justify-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover mix-blend-multiply"
                          />
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h4 className="text-[13px] font-semibold text-gray-900 line-clamp-2 leading-tight">
                                {item.title}
                              </h4>
                              <div className="text-[13px] font-bold text-[#D3100B] mt-1">
                                {item.price.toLocaleString()} {t("bdt")}
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-400 hover:text-red-600 transition-colors shrink-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-200 rounded text-gray-700 h-7 bg-white">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-7 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                              >
                                <Minus size={12} />
                              </button>
                              <div className="w-8 text-center text-xs font-semibold border-x border-gray-200 h-full flex items-center justify-center">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-7 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-500"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <div className="text-sm font-bold text-gray-900 text-right">
                              <span className="text-[11px] font-normal text-gray-500 block sm:inline sm:mr-1">
                                {t("total") || "Total"}:
                              </span>
                              {(item.price * item.quantity).toLocaleString()}{" "}
                              {t("bdt")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link
                    href="/"
                    className="text-xs font-bold text-primary hover:opacity-80 flex items-center gap-1"
                  >
                    <Plus size={14} /> {t("addMoreItems")}
                  </Link>
                </div>
              </div>

              {/* Totals Summary */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-[13px] text-gray-600">
                  <span>{t("subTotal")}</span>
                  <span className="font-bold text-gray-900">
                    {totalPrice.toLocaleString()} {t("bdt")}
                  </span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-600">
                  <span>{t("vatTax")}</span>
                  <span className="font-bold text-gray-900">0 {t("bdt")}</span>
                </div>
                <div className="flex justify-between text-[13px] text-gray-600">
                  <span>{t("deliveryCharge")}</span>
                  <span className="font-bold text-gray-900">
                    {totalPrice > 0 ? deliveryCharge.toLocaleString() : 0}{" "}
                    {t("bdt")}
                  </span>
                </div>
                <div className="pt-4 flex justify-between text-sm font-black text-gray-900">
                  <span>{t("total")}</span>
                  <span>
                    {grandTotal.toLocaleString()} {t("bdt")}
                  </span>
                </div>
              </div>

              {/* Add Note */}
              <div>
                <label className="text-[11px] font-bold text-gray-900 mb-2 block uppercase tracking-wide">
                  {t("addNote")}
                </label>
                <textarea
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                  placeholder={t("deliveryInstructions")}
                  className="w-full bg-white border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary h-20 resize-none shadow-sm"
                ></textarea>
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="pt-6 mt-auto">
              <label className="flex items-start gap-3 cursor-pointer group ju">
                <div className="flex items-center justify-center mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-primary"
                  />
                </div>
                <span className="text-[13px] text-gray-600 leading-snug select-none group-hover:text-gray-900 transition-colors">
                  {t("agreeToTerms") as string}
                </span>
              </label>
            </div>

            {/* Confirm Order Button */}
            <div className="pt-4">
              <button
                onClick={handleCheckout}
                disabled={
                  !mounted ||
                  status === "processing" ||
                  cartItems.length === 0 ||
                  !agreed
                }
                className="w-full bg-primary hover:bg-primary text-white font-bold py-3.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {status === "processing" ? "Processing..." : t("confirmOrder")}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
