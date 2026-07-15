import { createFileRoute } from "@tanstack/react-router";
import { Banner } from "../components/Banner";
import { Categories } from "../components/Categories";
import { BestSelling } from "../components/Bestselling";
import { ExploreProducts } from "../components/ExploreProduct";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Banner />
      <div className="mt-8" />
      <Categories />
      <div className="mt-8" />
      <BestSelling />
      <div className="mt-8" />
      <ExploreProducts />
      <div className="mt-8" />
    </div>
  );
}
