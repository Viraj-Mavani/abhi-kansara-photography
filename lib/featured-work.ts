const R2_URL = "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev";

export interface FeaturedProject {
	id: string;
	title: string;
	category: string;
	src: string;
	slug: string; // Links to client gallery slug in portfolio.ts
	span?: string;
}

export const featuredProjects: FeaturedProject[] = [
	{
		id: "p1",
		title: "Aditya Gadhvi",
		category: "Event",
		src: `${R2_URL}/images/feature/feature1.webp`,
		slug: "aditya-gadhvi-live",
		span: "row-span-2 col-span-1",
	},
	{
		id: "p2",
		title: "Zeel & Dhaval",
		category: "Pre-Wedding",
		src: `${R2_URL}/images/feature/feature2.webp`,
		slug: "zeel-dhaval",
		span: "col-span-1 row-span-1",
	},
	{
		id: "p3",
		title: "Dhruv",
		category: "Portrait",
		src: `${R2_URL}/images/feature/feature3.webp`,
		slug: "dhruv",
		span: "col-span-1 row-span-1",
	},
	{
		id: "p4",
		title: "Jeel & Khushang",
		category: "Wedding",
		src: `${R2_URL}/images/feature/feature4.webp`,
		slug: "jeel-khushang",
		span: "col-span-2 row-span-2",
	},
	{
		id: "p5",
		title: "Hemngi & Dhruvin",
		category: "Pre-Wedding",
		src: `${R2_URL}/images/feature/feature5.webp`,
		slug: "hemngi-dhruvin",
		span: "col-span-1 row-span-1",
	},
	{
		id: "p6",
		title: "Reepal",
		category: "Baby Shower",
		src: `${R2_URL}/images/feature/feature6.webp`,
		slug: "reepal",
		span: "col-span-1 row-span-1",
	},
];
