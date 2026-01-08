import { Link } from '@tanstack/react-router';
import { useFormContext } from 'react-hook-form';
import { Eye, Trash2 } from 'lucide-react';
// UI
import { Card, CardDescription, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
// Utils
import { formatBytes } from '@/lib/utils';

type TImage = {
	name: string;
	size: number;
	url: string;
};

export function SingleImageView({
	image,
	nameInSchema,
}: {
	image: TImage;
	nameInSchema: string;
}) {
	const { setValue } = useFormContext();

	const handleDelete = () => {
		setValue(nameInSchema, null, { shouldDirty: true });
	};
console.log('image', image);
console.log('nameInSchema', nameInSchema);

	return (
		<Card
			className='flex-row items-center justify-between'
			key={image.url}>
			<article className='flex gap-x-4 p-2 pt-0 md:p-4'>
				<img
					src={image.url}
					alt={image.url}
					className='h-14 w-14 rounded-full'
				/>
				<div>
					<CardTitle className='line-clamp-1 text-base'>{image.name}</CardTitle>
					<CardDescription className='font-semibold'>
						{formatBytes(image.size)}
					</CardDescription>
				</div>
			</article>
			<div className='flex items-center gap-x-1 pr-4'>
				<Button
					type='button'
					variant='ghost'
					size='icon'>
					<Link
						to={image.url}
						target='_blank'>
						<Eye
							size={18}
							color='gray'
						/>
					</Link>
				</Button>
				<Button
					type='button'
					className='text-destructive hover:bg-destructive/5 hover:text-destructive'
					variant='ghost'
					size='icon'
					onClick={handleDelete}>
					<Trash2 size={18} />
				</Button>
			</div>
		</Card>
	);
}
