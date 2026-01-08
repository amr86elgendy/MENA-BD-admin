export type TVariant = {
	_id: string;
	product: string;
	name_en: string;
	name_ar: string;
	unitCount: number;
	quantity: number;
	flavor_en?: string;
	flavor_ar?: string;
	price: number;
	sold: number;
	priceAfterDiscount?: number;
	images: {
		name: string;
		size: number;
		url: string;
	}[];
};
