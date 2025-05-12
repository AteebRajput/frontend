import * as React from "react";
import { cn } from "../../../lib/utils";
import { AlertCircle, CheckCircle, Info, XCircle } from "lucide-react";

// Alert component
const Alert = React.forwardRef(({ children, className, variant = "default", ...props }, ref) => {
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <XCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      case "info":
        return <Info className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "destructive":
        return "border-red-500 bg-red-50 text-red-700";
      case "success":
        return "border-green-500 bg-green-50 text-green-700";
      case "info":
        return "border-blue-500 bg-blue-50 text-blue-700";
      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4 flex items-start gap-3",
        getVariantClasses(),
        className
      )}
      {...props}
    >
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
});

Alert.displayName = "Alert";

// AlertDescription component
const AlertDescription = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm leading-5", className)}
    {...props}
  >
    {children}
  </div>
));

AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };