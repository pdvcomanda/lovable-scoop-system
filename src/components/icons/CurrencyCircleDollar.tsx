
import { SVGProps } from "react";

export const CurrencyCircleDollar = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12" />
      <path d="M15 9.5a3 3 0 0 0-6 0c0 1.5 2 2 3 2.5s3 1 3 2.5a3 3 0 0 1-6 0" />
    </svg>
  );
};
