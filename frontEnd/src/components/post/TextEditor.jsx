import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';
import config from "../../config/config"

export default function TextEditor({ name, control, label, defaultValue = "" }) {
    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1'>{label}</label>}

            <Controller
                name={name || "content"}
                control={control}
                render={({ field: { onChange } }) => (
                    <Editor
                        apiKey={config.TINY_MCE_API_KEY}
                        initialValue={defaultValue}
                        init={{
                            height: 500,

                            branding: false,
                            promotion: false,
                            statusbar: false,
                            menubar: false,

                            plugins: [
                                "lists",
                                "link",
                                "image",
                                "code",
                                "table",
                                "wordcount",
                                "preview"
                            ],

                            toolbar:
                                "undo redo | blocks | bold italic underline | " +
                                "bullist numlist | link image | table | code | preview",

                            block_formats: "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3; Heading 4=h4",

                            content_style:
                                "body { font-family:Arial,sans-serif; font-size:14px }"
                        }}s
                        onEditorChange={onChange}
                    />
                )}
            />

        </div>
    )
}
