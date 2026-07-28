import React, { useState } from 'react'
import { Editor } from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';

export default function RTE({ name, control, label, defaultValue = "" }) {
  const [editorError, setEditorError] = useState(false);

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
          !editorError ? (
            <Editor
              tinymceScriptSrc="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.2/tinymce.min.js"
              initialValue={defaultValue}
              value={value || defaultValue}
              onScriptLoadingError={() => setEditorError(true)}
              init={{
                height: 380,
                menubar: true,
                readonly: false,
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
                setup: (editor) => {
                  editor.on('init', () => {
                    try {
                      editor.mode.set('design');
                    } catch {
                      // mode already editable
                    }
                  });
                }
              }}
              onEditorChange={onChange}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-t-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <span>Content Editor (Fallback Mode)</span>
              </div>
              <textarea
                value={value || defaultValue}
                onChange={(e) => onChange(e.target.value)}
                rows={12}
                className="w-full p-3 rounded-b-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                placeholder="Write your article content here (HTML or formatted text)..."
              />
            </div>
          )
        )}
      />
    </div>
  )
}
