import { useCallback } from 'react';
import { Loader, UploadCloud } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
// UI
import { Input } from '../ui/input';
import { MultipleImagesView } from './MultipleImagesView';
// Utils
import { useUploadMultipleImage } from '@/apis/upload';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';

type Props<S> = {
	fieldTitle: string;
	nameInSchema: keyof S & string;
};

export function UploadMultipleImages<S>({
	fieldTitle,
	nameInSchema,
}: Props<S>) {
	const form = useFormContext();
	const uploadImage = useUploadMultipleImage();

	const onDrop = useCallback((droppedFiles: File[]) => {
		// console.log('droppedFiles', droppedFiles);
		const imageFiles = droppedFiles;
		const formData = new FormData();
		imageFiles.forEach(file => {
			formData.append('images', file);
		});

		uploadImage.mutate(
			{ formData },
			{
				onSuccess: ({ images }) => {
					form.setValue(
						'images',
						[
							...form.getValues('images'),
							...imageFiles.map((file, idx) => ({
								name: file.name,
								size: file.size,
								url: images[idx],
							})),
						],
						{
							shouldValidate: true,
							shouldDirty: true,
							shouldTouch: true,
						}
					);
				},
			}
		);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		multiple: true,
		onDrop,
		accept: {
			'image/*': [],
		},
	});

	return (
		<FormField
			control={form.control}
			name={nameInSchema}
			render={() => (
				<FormItem className='col-span-2'>
					<FormLabel className='text-xs'>{fieldTitle}</FormLabel>
					<FormControl>
						<article {...getRootProps()}>
							<Input
								type='file'
								{...getInputProps({ name: 'base64' })}
							/>
							<div
								className={
									'flex h-20 w-full cursor-pointer flex-col items-center justify-center border hover:bg-gray-50' +
									(isDragActive ? ' ' : ' ')
								}>
								{uploadImage.isPending ? (
									<>
										<Loader
											color='gray '
											size={30}
											className='animate-spin'
										/>
										<p className='text-gray-400'>
											Please wait while uploading...
										</p>
									</>
								) : (
									<>
										<UploadCloud
											size={40}
											color='gray'
										/>
										<p className='text-gray-600'>
											Drop image here or click to upload.
										</p>
									</>
								)}
							</div>
						</article>
					</FormControl>
					<FormMessage />
					<article className='grid gap-4 lg:grid-cols-2'>
						<MultipleImagesView
							images={[...form.getValues(nameInSchema)]}
							nameInSchema={nameInSchema}
						/>
					</article>
				</FormItem>
			)}
		/>
	);
}
