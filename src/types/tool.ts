import type { LucideIcon } from "lucide-react";

export interface Tool {
  /** Unique slug used in the URL path: /tools/{slug} */
  slug: string;
  /** Display name shown in sidebar and catalog */
  name: string;
  /** One-line description for the catalog card */
  description: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Category for optional grouping */
  category: string;
}
