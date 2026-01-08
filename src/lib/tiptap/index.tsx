import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Color } from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import MenuBar from './menu-bar';

// define your extension array
const extensions = [
	Color.configure({ types: [TextStyle.name, ListItem.name] }),
	TextStyle,
	Underline,
	TextAlign.configure({
		types: ['heading', 'paragraph'],
	}),
	StarterKit.configure({
		bulletList: {
			keepMarks: true,
			keepAttributes: false,
		},
		orderedList: {
			keepMarks: true,
			keepAttributes: false,
		},
	}),
	// Placeholder.configure({
	// 	placeholder: ({ node }) => {
	// 		return 'Write something...';
	// 	},
	// }),
];

type TTiptapEditorProps = {
	value: string;
	onChange(value: string): void;
	onBlur(): void;
	dir: 'rtl' | 'ltr';
};

export default function TiptapEditor({
	onChange,
	value,
	onBlur,
	dir,
}: TTiptapEditorProps) {
	const editor = useEditor({
		extensions,
		content: value,
		onUpdate: ({ editor }) => {
			const currentValue = editor.getHTML();
			onChange(currentValue);
		},
		onBlur,
		// editorProps: {
		//   attributes: {
		//     class:
		//       '',
		//   },
		// },
		autofocus: true,
	});

	useEffect(() => {
		if (value) {
			const html = editor?.getHTML();
			if (html !== value) {
				editor?.commands.setContent(value);
			}
		}
	}, [value]);

	return (
		<>
			<MenuBar editor={editor} />
			<EditorContent
				editor={editor}
				dir={dir}
			/>
		</>
	);
}
