import { Loader } from 'lucide-react';

export default function WhiteOverlay() {
	return (
		<div className='absolute inset-0 z-10 flex items-center justify-center bg-white/60'>
			<Loader className='animate-spin' />
		</div>
	);
}
