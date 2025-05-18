/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="react-router-dom" />
/// <reference types="lucide-react" />
/// <reference types="@tanstack/react-query" />

declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.json" {
  const content: Record<string, any>;
  export default content;
}
