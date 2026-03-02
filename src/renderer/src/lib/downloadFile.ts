export const downloadFile = ({
  content,
  file,
  extension,
  cb
}: {
  content: any;
  file: string;
  extension: 'json' | 'txt' | 'csv';
  cb?: () => void;
}) => {
  const _ = window.URL.createObjectURL(
    new Blob([JSON.stringify(content)], { type: `text/${extension};charset=utf-8` })
  );

  const link = document.createElement('a');
  link.setAttribute('download', `${file}.${extension}`);
  link.href = _;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(_);

  if (cb) cb();
};
