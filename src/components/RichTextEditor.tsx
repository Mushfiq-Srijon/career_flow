
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import {TextStyle} from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

type RichTextEditorProps = {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
};

export default function RichTextEditor({
    content,
    onChange,
    placeholder = "Write your content here...",
}: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            TextStyle,
            Color,
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: "min-h-48 px-4 py-3 text-sm text-slate-800 outline-none",
                "aria-label": placeholder,
            },
        },
    });

    if (!editor) {
        return (
            <div className="min-h-48 animate-pulse rounded-lg border border-slate-300 bg-slate-50" />
        );
    }

    const buttonClass = (active: boolean) =>
        `rounded px-2.5 py-1.5 text-sm transition ${active
            ? "bg-blue-100 text-blue-700"
            : "text-slate-700 hover:bg-slate-100"
        }`;

    return (
        <div className="rich-text-editor overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 p-2">
                <button
                    type="button"
                    title="Bold"
                    aria-label="Bold"
                    className={buttonClass(editor.isActive("bold"))}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <strong>B</strong>
                </button>

                <button
                    type="button"
                    title="Italic"
                    aria-label="Italic"
                    className={buttonClass(editor.isActive("italic"))}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <em>I</em>
                </button>

                <button
                    type="button"
                    title="Underline"
                    aria-label="Underline"
                    className={buttonClass(editor.isActive("underline"))}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >
                    <span className="underline">U</span>
                </button>

                <div className="mx-1 h-6 border-l border-slate-300" />

                <button
                    type="button"
                    title="Heading 2"
                    aria-label="Heading 2"
                    className={buttonClass(editor.isActive("heading", { level: 2 }))}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >
                    H2
                </button>

                <button
                    type="button"
                    title="Heading 3"
                    aria-label="Heading 3"
                    className={buttonClass(editor.isActive("heading", { level: 3 }))}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                >
                    H3
                </button>

                <button
                    type="button"
                    title="Bullet list"
                    aria-label="Bullet list"
                    className={buttonClass(editor.isActive("bulletList"))}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    • List
                </button>

                <button
                    type="button"
                    title="Numbered list"
                    aria-label="Numbered list"
                    className={buttonClass(editor.isActive("orderedList"))}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >
                    1. List
                </button>

                <button
                    type="button"
                    title="Paragraph"
                    aria-label="Paragraph"
                    className={buttonClass(editor.isActive("paragraph"))}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                        editor.chain().focus().setParagraph().run()
                    }
                >
                    ¶
                </button>

                <div className="mx-1 h-6 border-l border-slate-300" />

                <label className="flex cursor-pointer items-center gap-1 rounded px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
                    <span>Color</span>
                    <input
                        type="color"
                        aria-label="Text color"
                        defaultValue="#334155"
                        className="h-5 w-5 cursor-pointer border-0 bg-transparent p-0"
                        onInput={(event) =>
                            editor.chain().focus().setColor(event.currentTarget.value).run()
                        }
                    />
                </label>

                <button
                    type="button"
                    title="Remove formatting"
                    aria-label="Remove formatting"
                    className="rounded px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() =>
                        editor.chain().focus().unsetAllMarks().clearNodes().run()
                    }
                >
                    Clear
                </button>
            </div>

            <EditorContent editor={editor} />

            <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-500">
                Use the toolbar to format your content. Press Enter to start a new paragraph.
            </div>
        </div>
    );
}