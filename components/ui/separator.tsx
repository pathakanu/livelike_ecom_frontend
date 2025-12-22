"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(({ className, orientation = "horizontal", ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn(
      orientation === "horizontal"
        ? "h-px w-full bg-slate-100"
        : "h-full w-px bg-slate-100",
      className,
    )}
    {...props}
  />
));
Separator.displayName = "Separator";
