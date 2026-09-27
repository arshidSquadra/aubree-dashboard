import { createFileRoute } from "@tanstack/react-router";
import { AubreeApp } from "@/components/AubreeApp";
export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Brand Name · Owner Dashboard" },
    { name: "description", content: "Sales, marketing, operations and forecasts for a multi-outlet Bengaluru bakery and cloud kitchen." },
    { property: "og:title", content: "Brand Name · Owner Dashboard" },
    { property: "og:description", content: "One premium workspace for Aubree's cake and dessert business." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: () => <AubreeApp initialPath="/" />,
});
