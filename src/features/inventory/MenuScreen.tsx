import { Button } from "@/components/base/Button";
import Chip from "@/components/base/Chip";
import { Input } from "@/components/base/Input";
import { routeConstants } from "@/routes/routeConstants";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CategoryDragSection from "./components/CategoryDragSection";
import ProductDragSection, {
  type MenuParameters,
} from "./components/ProductDragSection";

const MenuScreen = () => {
  const [selectedParameters, setSelectedParameters] =
    useState<MenuParameters>(null);
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden pt-4">
      <div className="flex w-full items-center gap-4 px-4">
        <Input
          className="flex-1"
          placeholder="Search"
          leftElement={<Search />}
          fullWidth
        />
        <Link to={routeConstants.addons}>
          <Button>Add-ons</Button>
        </Link>
      </div>
      <div className="flex w-full items-center gap-4 px-4">
        <Chip label="All (50)" />
        <Chip label="Out Of Stock (30)" />
        <Chip label="With Variants (20)" />
        <Chip label="With Addons (10)" />
      </div>
      <div className="flex w-full flex-1 items-start overflow-hidden">
        <div className="h-full w-[30%]">
          <CategoryDragSection
            selectedParams={selectedParameters}
            onSelect={setSelectedParameters}
          />
        </div>
        <div className="h-full w-[70%]">
          <ProductDragSection selectedParameters={selectedParameters} />
        </div>
      </div>
    </div>
  );
};

export default MenuScreen;
