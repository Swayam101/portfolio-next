export interface Project {
  id: number;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  link?: string;
  repo?: string;
  /** Extended content for project page SEO (150+ words) */
  overview?: string;
  /** Client brief / challenge section */
  brief?: string;
  /** Design response / key decisions */
  response?: string;
  /** Technical specs: area, materials, services */
  specs?: string;
  /** Preview screenshot — drop a .webp in /public/images/ and reference it here */
  image?: string;
}
