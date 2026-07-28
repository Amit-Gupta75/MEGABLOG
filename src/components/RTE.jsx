import React from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({ name, control, label, defaultValue = "" }) {
  return (
    <div className='w-full text-left'>
      {label && (
        <label className='inline-block mb-1.5 pl-1 text-sm font-medium text-slate-700 dark:text-slate-300'>
          {label}
        </label>
      )}

      <Controller
        name={name || "content"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <Editor
            apiKey='no-api-key-provided' // works in local/demo mode or standard fallback
            initialValue={defaultValue}
            value={value || defaultValue}
            init={{
              height: 380,
              menubar: true,
              plugins: [
                "image",
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount"
              ],
              toolbar:
                "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
              content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              branding: false,
              skin: "oxide",
            }}
            onEditorChange={onChange}
          />
        )}
      />
    </div>
  )
}
