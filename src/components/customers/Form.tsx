// import { useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Undo2 } from 'lucide-react';
// // UI
// import { Button } from '../ui/button';
// import {
// 	Form,
// 	FormControl,
// 	FormField,
// 	FormItem,
// 	FormLabel,
// 	FormMessage,
// } from '../ui/form';
// import { Input } from '../ui/input';
// // Utils
// import { useUpdateUser, useViewUser } from '@/apis/customers';
// import { getDirtyFields } from '@/lib/utils';

// const userSchema = z.object({
// 	firstName: z.string().min(1, {
// 		message: 'First Name is required',
// 	}),
// 	lastName: z.string().min(1, {
// 		message: 'Last Name is required',
// 	}),
// 	email: z
// 		.string()
// 		.min(1, {
// 			message: 'Email is required',
// 		})
// 		.email({ message: 'Please enter a valid email address.' }),
// });

// export default function UserForm() {
// 	const { userId } = useParams();

// 	const form = useForm<z.infer<typeof userSchema>>({
// 		defaultValues: {
// 			firstName: '',
// 			lastName: '',
// 			email: '',
// 		},
// 		resolver: zodResolver(userSchema),
// 	});

// 	const navigate = useNavigate();

// 	const updateProduct = useUpdateUser();

// 	const viewUserQuery = useViewUser({
// 		id: userId ? userId : undefined,
// 	});

// 	useEffect(() => {
// 		if (viewUserQuery.data) {
// 			const { firstName, lastName, email } = viewUserQuery.data;
// 			const newValues = {
// 				firstName,
// 				lastName,
// 				email,
// 			};
// 			form.reset(newValues);
// 		}
// 	}, [viewUserQuery.data]);

// 	const onSubmit = (values: z.infer<typeof userSchema>) => {
// 		if (userId) {
// 			const data = getDirtyFields(values, form.formState.dirtyFields);
// 			updateProduct.mutate(
// 				{
// 					data,
// 					id: userId,
// 				},
// 				{
// 					onSuccess: () => navigate('/customers'),
// 				}
// 			);
// 		}
// 	};
// 	// console.log('form values', form.watch());

// 	return (
// 		<section className='m-auto md:w-3/4'>
// 			<div className='flex items-center justify-between'>
// 				<Button
// 					className='space-x-2'
// 					onClick={() => navigate(-1)}
// 				>
// 					<Undo2 />
// 					<span className='capitalize'>back to customers</span>
// 				</Button>
// 			</div>

// 			<Form {...form}>
// 				<form
// 					onSubmit={form.handleSubmit(onSubmit)}
// 					className='space-y-8'
// 				>
// 					<div className='grid grid-cols-2 gap-8'>
// 						{/* First Name */}
// 						<FormField
// 							control={form.control}
// 							name='firstName'
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>First name</FormLabel>
// 									<FormControl>
// 										<Input {...field} />
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						{/* Last Name */}
// 						<FormField
// 							control={form.control}
// 							name='lastName'
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>Last name</FormLabel>
// 									<FormControl>
// 										<Input {...field} />
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 						{/* Email */}
// 						<FormField
// 							control={form.control}
// 							name='email'
// 							render={({ field }) => (
// 								<FormItem>
// 									<FormLabel>email</FormLabel>
// 									<FormControl>
// 										<Input
// 											type='email'
// 											placeholder='user email...'
// 											{...field}
// 										/>
// 									</FormControl>
// 									<FormMessage />
// 								</FormItem>
// 							)}
// 						/>
// 					</div>
// 					<Button type='submit'>Submit</Button>
// 				</form>
// 			</Form>
// 		</section>
// 	);
// }
