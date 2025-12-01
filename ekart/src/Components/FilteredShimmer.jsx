import React from "react";
import Shimmer from "../Shimmer";

function FilteredShimmer() {
  return (
    <div className="w-full flex gap-4">
      {/* LEFT SIDEBAR SHIMMER (Desktop only) */}
      <div className="hidden md:block w-[250px]">
        <Shimmer width="100%" height="40px" radius="8px" />

        {[1, 2, 3].map((i) => (
          <div key={i} className="mt-6">
            <Shimmer width="60%" height="20px" radius="6px" />

            <div className="mt-3 flex flex-col gap-2">
              <Shimmer width="80%" height="16px" radius="6px" />
              <Shimmer width="70%" height="16px" radius="6px" />
              <Shimmer width="65%" height="16px" radius="6px" />
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT PRODUCT GRID SHIMMER */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i}>
            <Shimmer width="100%" height="200px" radius="10px" />
            <div className="py-3">
              <Shimmer width="70%" height="20px" radius="6px" />

              <div className="mt-2">
                <Shimmer width="50%" height="18px" radius="6px" />
              </div>

              <div className="mt-4">
                <Shimmer width="30%" height="22px" radius="6px" />
              </div>

              <div className="flex gap-3 mt-4">
                <Shimmer width="50%" height="40px" radius="6px" />
                <Shimmer width="50%" height="40px" radius="6px" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FilteredShimmer;
