// @ts-nocheck
import React, { useRef } from 'react';
import { Input, Box, useToast } from '@chakra-ui/react';
import api from '@/lib/api';

export default function Uploader({ onUploaded, children, ...restProps }: any) {
  const fileInputRef = useRef(null);
  const toast = useToast();

  const uploadToServer = async (file: any) => {
    console.log('file is', file);
    const fileExtension = file.type.split('/')[1];
    console.log(fileExtension);

    try {
      const res = await api.operation.fileUploadUrl({
        fileExtension,
      });

      const { fileKey, url, accessUrl } = res.data;
      console.log('file key and url', fileKey, url);

      const result = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      console.log('upload result', result);

      if (result.status === 200) {
        // do upload logic
        onUploaded({
          fileKey,
          fileType: file.type,
          accessUrl,
        });
      } else {
        toast({
          title: 'error',
          title: 'Failed to upload to server',
        });
      }
    } catch (err) {
      toast({
        status: 'error',
        title: err.response.data.msg,
      });
    }
  };

  const handleFileInput = async (e: any) => {
    // e.target.files.map((item) => uploadToServer(item));
    const file = e.target.files[0];
    await uploadToServer(file);
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <Box onClick={handleClick} {...restProps}>
      <Input type="file" display={'none'} onChange={handleFileInput} ref={fileInputRef} />
      {children}
    </Box>
  );
}
