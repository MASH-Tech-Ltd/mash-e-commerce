"use client";

import React from "react";
import { ShoppingCart, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useTranslation } from "@/context/LanguageContext";

interface ProductProps {
  product: {
    id?: number | string;
    _id?: string;
    slug?: string;
    title: string;
    image?: string | { secure_url: string };
    images?: Array<{ secure_url: string }>;
    originalPrice: number;
    discountedPrice: number;
    saveAmount?: number;
    shortDescription?: string;
    tenantId: string;
    productType?: string;
    variants?: Array<{
      variantName: string;
      originalPrice: number;
      discountedPrice: number;
      stock: number;
    }>;
  };
  isList?: boolean;
}

export default function ProductCard({ product, isList = false }: ProductProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { t } = useTranslation();
  const productId = product._id || product.id;
  const productSlug = product.slug || productId;

  // Handle both single image and images array structures
  let imageUrl = "";
  if (product.images && product.images.length > 0) {
    imageUrl = product.images[0].secure_url;
  } else if (product.image) {
    imageUrl =
      typeof product.image === "string"
        ? product.image
        : product.image.secure_url;
  }

  // For variant products, use the first variant's price as the display price
  const isVariant =
    product.productType === "VARIANT" &&
    product.variants &&
    product.variants.length > 0;
  const displayOriginalPrice = isVariant
    ? product.variants![0].originalPrice
    : product.originalPrice;
  const displayDiscountedPrice = isVariant
    ? product.variants![0].discountedPrice
    : product.discountedPrice;

  const savePercent =
    displayOriginalPrice > 0
      ? Math.round(
          ((displayOriginalPrice - displayDiscountedPrice) /
            displayOriginalPrice) *
            100,
        )
      : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    addToCart({
      id: String(productId),
      productId: String(productId),
      title: product.title,
      price: displayDiscountedPrice,
      image: imageUrl,
      tenantId: product.tenantId || "main",
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    addToCart({
      id: String(productId),
      productId: String(productId),
      title: product.title,
      price: displayDiscountedPrice,
      image: imageUrl,
      tenantId: product.tenantId || "main",
    });
    router.push("/cart"); // Change to /cart instead of /checkout, user usually wants to see cart first or straight to checkout. We'll send them to cart to proceed.
  };

  return (
    <Link
      href={`/product/${productSlug}`}
      className={`group flex bg-white rounded-md shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden relative h-full ${isList ? "flex-row" : "flex-col"}`}
    >
      {/* Image Container */}
      <div
        className={`relative bg-[#F8F9FA] flex items-center justify-center overflow-hidden shrink-0 ${isList ? "w-24 h-24 sm:w-36 sm:h-36 md:w-48 md:h-48" : "aspect-square w-full"}`}
      >
        {(savePercent > 0 ||
          (product.saveAmount && product.saveAmount > 0)) && (
          <div className="absolute top-0 left-0 bg-primary text-white text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-br-lg z-10 shadow-sm">
            {t("save")}:{" "}
            {(
              product.saveAmount ||
              displayOriginalPrice - displayDiscountedPrice
            ).toLocaleString()}{" "}
            {t("bdt")} (-{savePercent}%)
          </div>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div
        className={`flex flex-col flex-1 ${isList ? "p-2.5 sm:p-4 justify-center" : "p-4"}`}
      >
        <h4
          className={`text-gray-800 leading-snug mb-2 sm:mb-3 group-hover:text-primary transition-colors select-text ${isList ? "text-sm sm:text-base md:text-lg font-semibold" : "text-[13px] line-clamp-2 min-h-[36px]"}`}
          onClick={(e) => {
            // Check if user is selecting text
            if (window.getSelection()?.toString().length) {
              e.preventDefault();
            }
          }}
        >
          {product.title}
        </h4>

        {isList && product.shortDescription && (
          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 line-clamp-2">
            {product.shortDescription}
          </p>
        )}

        <div className="flex items-baseline gap-2 mb-2 sm:mb-4">
          <span
            className={`font-bold text-[#D3100B] ${isList ? "text-base sm:text-lg md:text-xl" : "text-[15px]"}`}
          >
            {displayDiscountedPrice.toLocaleString()} {t("bdt")}
          </span>
          {displayOriginalPrice > displayDiscountedPrice && (
            <span className="text-[12px] text-gray-500 line-through">
              {displayOriginalPrice.toLocaleString()} {t("bdt")}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div
          className={`mt-auto flex ${isList ? "flex-col sm:flex-row gap-1.5 sm:gap-3 sm:w-64" : "flex-col gap-2"}`}
        >
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center space-x-2 py-1.5 border border-primary text-primary rounded hover:bg-primary hover:text-white transition-colors"
          >
            <ShoppingCart size={14} />
            <span className="text-xs font-semibold">{t("addToCart")}</span>
          </button>
          <button
            onClick={handleBuyNow}
            className="w-full flex items-center justify-center space-x-2 py-1.5 bg-primary text-white rounded hover:bg-primary transition-colors shadow-sm"
          >
            <Zap size={14} />
            <span className="text-xs font-semibold">{t("buyNow")}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
