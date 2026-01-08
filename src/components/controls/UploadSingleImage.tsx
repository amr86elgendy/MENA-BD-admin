import { useCallback } from 'react';
import { Loader, UploadCloud } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
// UI
import { Input } from '@/components/ui/input';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form';
import { SingleImageView } from './SingleImageView';
// Utils
import { useUploadSingleImage } from '@/apis/upload';

type Props<S> = {
	fieldTitle: string;
	nameInSchema: keyof S & string;
};

export function UploadSingleImage<S>({ fieldTitle, nameInSchema }: Props<S>) {
	const form = useFormContext();
	const uploadImage = useUploadSingleImage();

	const onDrop = useCallback((droppedFiles: File[]) => {
		// console.log("droppedFiles", droppedFiles);
		const imageFile = droppedFiles[0];
		const formData = new FormData();

		formData.append('image', imageFile);

		uploadImage.mutate(
			{ formData },
			{
				onSuccess: ({ image }) => {
					form.setValue(
						nameInSchema as string,
						{
							name: imageFile.name,
							size: imageFile.size,
							url: image,
						},
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
		multiple: false,
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
						<div {...getRootProps()}>
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
									<Loader
										size={30}
										className='animate-spin'
									/>
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
						</div>
					</FormControl>
					<FormMessage />
					{form.getValues(nameInSchema) && (
						<SingleImageView
							image={form.getValues(nameInSchema)}
							nameInSchema={nameInSchema}
						/>
					)}
				</FormItem>
			)}
		/>
	);
}
