import { Outlet } from "react-router";

export function Root() {
  return (
    <div className="min-h-screen bg-[#F5F2ED]">
      <div className="max-w-md mx-auto min-h-screen bg-[#F5F2ED]">
        <Outlet />
      </div>
    </div>
  );
}
