// Centralized Data Layer

export interface PortfolioImage {
	id: string;
	src: string;
	alt: string;
	blurDataURL?: string;
	category?: string;
}

export interface Service {
	id: string;
	title: string;
	description: string;
	image: string;
}

export const servicesData: Service[] = [
	{
		id: "luxury-weddings",
		title: "Luxury Weddings",
		description:
			"Cinematic, editorial storytelling of your most grand and opulent celebrations, capturing the scale and the intimate moments simultaneously.",
		image: "/images/wedding_reception_1773261219216.png",
	},
	{
		id: "couple-portraits",
		title: "Intimate Portraits",
		description:
			"Pre-wedding and engagement sessions focused on raw emotion, natural light, and breathtaking locations.",
		image: "/images/wedding_couple_portrait_1773261177325.png",
	},
	{
		id: "details-decor",
		title: "Details & Decor",
		description:
			"Preserving the intricate craftsmanship of your attire, jewelry, and the architectural beauty of your chosen venue.",
		image: "/images/wedding_details_1773261206723.png",
	},
];

export const portfolioImages: PortfolioImage[] = [
	{
		id: "hero",
		src: "/images/wedding_hero_1773261165253.png",
		alt: "Cinematic Wedding Hero",
	},
	{
		id: "ceremony",
		src: "/images/wedding_ceremony_1773261191985.png",
		alt: "Elaborate Wedding Ceremony",
	},
	{
		id: "portrait",
		src: "/images/photographer/Abhi.jpeg",
		alt: "Abhi Kansara - Photographer",
	},
];
