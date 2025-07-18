'use client';

import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editor } from '@ckeditor/ckeditor5-core'; // this provides proper typing

type Props = {
  value: string;
  onChange: (data: string) => void;
  uploadAdapter: (editor: Editor) => void;
};

export default function ClientCKEditor({ value, onChange, uploadAdapter }: Props) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onReady={(editor: Editor) => {
        uploadAdapter(editor);
      }}
      onChange={(_, editor: Editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      config={{
        placeholder: 'Write your content...',
        toolbar: [
          'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList',
          '|', 'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'imageUpload', 'undo', 'redo'
        ]
      }}
    />
  );
}
