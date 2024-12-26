"use client"
import './loaderStyle.css';

import { useTheme } from "next-themes";

export function Loader() {
  const { resolvedTheme } = useTheme();

  return (
    <span className={`loader ${resolvedTheme === "dark" ? "loader-dark" : "loader-light"}`}></span>
  );
}