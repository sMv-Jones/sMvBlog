import { BlobServiceClient } from '@azure/storage-blob';
import multer from 'multer';
import dotenv from 'dotenv';
import crypto from "crypto";
import path from "path"
dotenv.config();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);

export const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {
        const allowed = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ];

        if (!allowed.includes(file.mimetype)) {
            return cb(
                new Error(
                    'Only JPG, PNG and WebP images are allowed'
                )
            );
        }

        cb(null, true);
    }
});


export const verifyAzureConnection = async () => {
    try {
        await blobServiceClient.getProperties();
        console.log(`Azure Blob Storage: Verified connection. Container "${process.env.AZURE_CONTAINER_NAME}" is active.`);
    } catch (error) {
        console.error('Azure Blob Storage: Handshake failed! Verification aborted.');
        console.error(`Error details: ${error.message}`);
    }
};

export const uploadToAzure = async ({ buffer, mimetype, originalname }) => {
    try {
        const extension = path.extname(originalname).toLowerCase();
        const blobName = `${crypto.randomUUID()}${extension}`;

        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: {
                blobContentType: mimetype,
                blobCacheControl: 'public, max-age=31536000'
            }
        });

        return blockBlobClient.url;

    } catch (error) {
        console.error('Azure Storage :: uploadToAzure ::', error.message);
        throw new Error('Failed to upload image to cloud storage');
    }
};

export const deleteFromAzure = async (fileUrl) => {
    try {
        if (!fileUrl) return false;
        const parsedUrl = new URL(fileUrl);
        const blobName = decodeURIComponent(parsedUrl.pathname.split('/').slice(2).join('/'));
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        return await blockBlobClient.deleteIfExists();
    } catch (error) {
        console.error("Azure Storage Service :: deleteFromAzure :: error", error);
        return false;
    }
};