'use client';

import Image, { type ImageProps } from "next/image";
import { useTheme } from "@/contexts/ThemeContext";

type BrandLogoProps = Omit<ImageProps, "src" | "alt"> & {
  /**
   * Controls which logo variant is rendered
   * - auto: matches current theme
   * - light: always use light (blue) logo
   * - dark: always use transparent / white logo
   */
  variant?: "auto" | "light" | "dark";
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "auto",
  className,
  priority = false,
  width = 150,
  height = 28,
  ...props
}) => {
  const { darkMode } = useTheme();
  const isDark = variant === "auto" ? darkMode : variant === "dark";
  const src = isDark ? "/Logos/trakaply-white.svg" : "/Logos/trakaply-blue.svg";

  return (
    <Image
      src={src}
      alt="Trakaply Logo"
      width={width}
      height={height}
      className={className}
      priority={priority}
      {...props}
    />
  );
};

