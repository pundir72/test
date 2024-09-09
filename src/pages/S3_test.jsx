import React, { useState } from 'react';
import axios from 'axios';

const UploadToS3 = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file first');
            return;
        }

        try {
            console.log(selectedFile.type, "File Type Selected");

            const response = await axios.get(`${import.meta.env.VITE_REACT_APP_ENDPOINT
                }/api/s3/get-presigned-url`, {
                params: {
                    fileName: selectedFile.name,
                    fileType: selectedFile.type,
                },
            });

            const { url } = response.data;
            console.log(url, 'Generated Pre-signed URL');

            // Use the pre-signed URL to upload the file directly to S3
            const uploadResponse = await axios.put(url, selectedFile, {
                headers: {
                    'Content-Type': selectedFile.type,  // Set the correct MIME type
                    // Remove 'Content-Type' if error persists
                },
            });

            if (uploadResponse.status === 200) {
                console.log(uploadResponse);
                alert('File uploaded successfully!');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload to S3</button>
        </div>
    );
};

export default UploadToS3;
