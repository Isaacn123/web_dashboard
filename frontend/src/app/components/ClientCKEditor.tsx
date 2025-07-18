'use client';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

type Props = {
  value: string;
  onChange: (data: string) => void;
  uploadAdapter?: any;
};

export default function ClientCKEditor({ value, onChange, uploadAdapter }: Props) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(_, editor: any) => {
        const data = editor.getData();
        onChange(data);
      }}
      config={{
        placeholder: 'Write your article content here...',
        toolbar: [
          'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
          'outdent', 'indent', '|', 'blockQuote', 'insertTable', 'imageUpload', 'undo', 'redo'
        ],
        extraPlugins: uploadAdapter ? [uploadAdapter] : [],
      }}
    />
  );
}
