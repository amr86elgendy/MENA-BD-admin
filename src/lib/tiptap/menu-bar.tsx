import { type Editor } from '@tiptap/react';
import { cn } from '../utils';
import {
	AlignCenterIcon,
	AlignJustifyIcon,
	AlignLeftIcon,
	AlignRightIcon,
	CuboidIcon,
	ItalicIcon,
	ListIcon,
	ListOrderedIcon,
	MinusIcon,
	QuoteIcon,
	Redo2Icon,
	Undo2Icon,
} from 'lucide-react';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

const MenuBar = ({ editor }: { editor: Editor | null }) => {
	if (!editor) {
		return null;
	}

	return (
		<div className='flex flex-wrap gap-x-8 gap-y-4 border p-2'>
			<TooltipProvider>
				{/* Word */}
				<div className='rich-editor-group'>
					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() => editor.chain().focus().toggleBold().run()}
								disabled={!editor.can().chain().focus().toggleBold().run()}
								className={cn('font-bold', {
									'bg-gray-200': editor.isActive('bold'),
								})}
							>
								B
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Bold</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() => editor.chain().focus().toggleItalic().run()}
								disabled={!editor.can().chain().focus().toggleItalic().run()}
								className={cn('', {
									'bg-gray-200': editor.isActive('italic'),
								})}
							>
								<ItalicIcon size={16} />
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Italic</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() => editor.chain().focus().toggleUnderline().run()}
								disabled={!editor.can().chain().focus().toggleUnderline().run()}
								className={cn('underline', {
									'bg-gray-200': editor.isActive('underline'),
								})}
							>
								U
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Underline</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() => editor.chain().focus().toggleStrike().run()}
								disabled={!editor.can().chain().focus().toggleStrike().run()}
								className={cn('line-through', {
									'bg-gray-200': editor.isActive('strike'),
								})}
							>
								S
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Strike through</p>
						</TooltipContent>
					</Tooltip>
				</div>
				{/* Headings */}
				<div className='rich-editor-group'>
					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 1 }).run()
								}
								className={cn('text-xs font-semibold', {
									'bg-gray-200': editor.isActive('heading', { level: 1 }),
								})}
							>
								H1
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Heading 1</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 2 }).run()
								}
								className={cn('text-xs font-semibold', {
									'bg-gray-200': editor.isActive('heading', { level: 2 }),
								})}
							>
								H2
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Heading 2</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 3 }).run()
								}
								className={cn('text-xs font-semibold', {
									'bg-gray-200': editor.isActive('heading', { level: 3 }),
								})}
							>
								H3
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Heading 3</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 4 }).run()
								}
								className={cn('text-xs font-semibold', {
									'bg-gray-200': editor.isActive('heading', { level: 4 }),
								})}
							>
								H4
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Heading 4</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 5 }).run()
								}
								className={cn('text-xs font-semibold', {
									'bg-gray-200': editor.isActive('heading', { level: 5 }),
								})}
							>
								H5
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Heading 5</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() =>
									editor.chain().focus().toggleHeading({ level: 6 }).run()
								}
								className={cn('text-xs font-semibold', {
									'bg-gray-200': editor.isActive('heading', { level: 6 }),
								})}
							>
								H6
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Heading 6</p>
						</TooltipContent>
					</Tooltip>
				</div>
				{/* List */}
				<div className='rich-editor-group'>
					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() => editor.chain().focus().toggleBulletList().run()}
								className={cn('', {
									'bg-gray-200': editor.isActive('bulletList'),
								})}
							>
								<ListIcon
									strokeWidth='1.5px'
									size={20}
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Bullet list</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() => editor.chain().focus().toggleOrderedList().run()}
								className={cn('', {
									'bg-gray-200': editor.isActive('orderedList'),
								})}
							>
								<ListOrderedIcon
									strokeWidth='1.5px'
									size={20}
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Ordered list</p>
						</TooltipContent>
					</Tooltip>
				</div>
				{/* Horizontal Line & Code Block */}
				<div className='rich-editor-group'>
					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() => editor.chain().focus().toggleCodeBlock().run()}
								className={cn('flex items-center justify-center', {
									'bg-gray-200': editor.isActive('codeBlock'),
								})}
							>
								<CuboidIcon
									strokeWidth='1.5'
									size={18}
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Code block</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() => editor.chain().focus().toggleBlockquote().run()}
								className={cn('flex items-center justify-center', {
									'bg-gray-200': editor.isActive('blockquote'),
								})}
							>
								<QuoteIcon
									strokeWidth='1.5'
									size={18}
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Block quote</p>
						</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() => editor.chain().focus().setHorizontalRule().run()}
								className='flex items-center justify-center'
							>
								<MinusIcon
									strokeWidth='1.5'
									size={20}
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Horizontal line</p>
						</TooltipContent>
					</Tooltip>
				</div>
				{/* Text Align */}
				<div className='rich-editor-group'>
					<Tooltip>
						<TooltipTrigger
							asChild
							className='flex items-center justify-center'
						>
							<button
								type='button'
								onClick={() =>
									editor.chain().focus().setTextAlign('left').run()
								}
								className={cn('flex items-center justify-center', {
									'bg-gray-200': editor.isActive({ textAlign: 'left' }),
								})}
							>
								<AlignLeftIcon
									strokeWidth='1.5'
									size={20}
								/>
							</button>
						</TooltipTrigger>
						<TooltipContent>
							<p>Text align left</p>
						</TooltipContent>
					</Tooltip>

					<button
						type='button'
						onClick={() => editor.chain().focus().setTextAlign('center').run()}
						className={cn('flex items-center justify-center', {
							'bg-gray-200': editor.isActive({ textAlign: 'center' }),
						})}
					>
						<AlignCenterIcon
							strokeWidth='1.5'
							size={20}
						/>
					</button>
					<button
						type='button'
						onClick={() => editor.chain().focus().setTextAlign('justify').run()}
						className={cn('flex items-center justify-center', {
							'bg-gray-200': editor.isActive({ textAlign: 'justify' }),
						})}
					>
						<AlignJustifyIcon
							strokeWidth='1.5'
							size={20}
						/>
					</button>
					<button
						type='button'
						onClick={() => editor.chain().focus().setTextAlign('right').run()}
						className={cn('flex items-center justify-center', {
							'bg-gray-200': editor.isActive({ textAlign: 'right' }),
						})}
					>
						<AlignRightIcon
							strokeWidth='1.5'
							size={20}
						/>
					</button>
				</div>
				{/* Undo Redo */}
				<div className='rich-editor-group'>
					<button
						type='button'
						onClick={() => editor.chain().focus().undo().run()}
						disabled={!editor.can().undo()}
						className={cn(
							'flex items-center justify-center disabled:opacity-30',
							{
								'bg-gray-200': editor.isActive('undo'),
							}
						)}
					>
						<Undo2Icon
							strokeWidth='1.5'
							size={20}
						/>
					</button>
					<button
						type='button'
						onClick={() => editor.chain().focus().redo().run()}
						disabled={!editor.can().redo()}
						className={cn(
							'flex items-center justify-center disabled:opacity-30',
							{
								'bg-gray-200': editor.isActive('redo'),
							}
						)}
					>
						<Redo2Icon
							strokeWidth='1.5'
							size={20}
						/>
					</button>
				</div>
			</TooltipProvider>
		</div>
	);
};

export default MenuBar;
