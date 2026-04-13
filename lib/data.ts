const R2_URL = "https://pub-576c3f4676204ddb823a5e2e2e27435e.r2.dev";

// Centralized Data Layer

export interface Service {
	id: string;
	title: string;
	image: string;
}

// Pre-Wedding | Wedding | Baby Shower | Product | Portrait | Editorial | Event
export const servicesData: Service[] = [
	{ id: "s0", title: "Wedding", image: `${R2_URL}/images/work/work0.webp` },
	{ id: "s1", title: "Event", image: `${R2_URL}/images/work/work1.webp` },
	{ id: "s2", title: "Portrait", image: `${R2_URL}/images/work/work2.webp` },
	{ id: "s3", title: "Portrait", image: `${R2_URL}/images/work/work3.webp` },
	{ id: "s4", title: "Pre-Wedding", image: `${R2_URL}/images/work/work4.webp` },
	{ id: "s5", title: "Portrait", image: `${R2_URL}/images/work/work5.webp` },
	{ id: "s6", title: "Event", image: `${R2_URL}/images/work/work6.webp` },
	{ id: "s7", title: "Event", image: `${R2_URL}/images/work/work7.webp` },
	{ id: "s8", title: "Event", image: `${R2_URL}/images/work/work8.webp` },
	{ id: "s9", title: "Portrait", image: `${R2_URL}/images/work/work9.webp` },
	{ id: "s10", title: "Pre-Wedding", image: `${R2_URL}/images/work/work10.webp` },
	{ id: "s11", title: "Pre-Wedding", image: `${R2_URL}/images/work/work11.webp` },
	{ id: "s12", title: "Portrait", image: `${R2_URL}/images/work/work12.webp` },
	{ id: "s13", title: "Baby Shower", image: `${R2_URL}/images/work/work13.webp` },
];


export const backgroundImages = [
	`${R2_URL}/images/bg/bg4.webp`,
	`${R2_URL}/images/bg/bg1.webp`,
	`${R2_URL}/images/bg/bg0.webp`,
	`${R2_URL}/images/bg/bg2.webp`,
	`${R2_URL}/images/bg/bg3.webp`,
	`${R2_URL}/images/bg/bg5.webp`,
	`${R2_URL}/images/bg/bg6.webp`,
	// `${R2_URL}/images/bg/bg7.webp`,
];

export const videoSources = {
	portrait0Poster: `${R2_URL}/images/thumbnail/t-portrait-0.webp`,
	portrait0:
		`${R2_URL}/videos/portrait-0/portrait0.m3u8`,
	portrait1Poster: `${R2_URL}/images/thumbnail/t-portrait-1.webp`,
	portrait1:
		`${R2_URL}/videos/portrait-1/portrait1.m3u8`,
	landscape0Poster: `${R2_URL}/images/thumbnail/t-landscape-0.webp`,
	landscape0:
		`${R2_URL}/videos/landscape-0/landscape0.m3u8`,
	landscape1Poster: `${R2_URL}/images/thumbnail/t-landscape-1.webp`,
	landscape1:
		`${R2_URL}/videos/landscape-1/landscape1.m3u8`,
};
