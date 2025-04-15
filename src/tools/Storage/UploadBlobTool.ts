import { z } from 'zod';
import BaseAzureStorageTool from './BaseAzureStorageTool';

interface UploadBlobInput {
  accountName: string;
  containerName: string;
  blobName: string;
  content: string;
}

/**
 * Tool for uploading a blob to a container
 */
class UploadBlobTool extends BaseAzureStorageTool<UploadBlobInput> {
  name = 'azure_upload_blob';
  description = 'Upload a blob to a container in Azure Storage';

  schema = {
    accountName: {
      type: z.string(),
      description: 'Azure Storage account name'
    },
    containerName: {
      type: z.string(),
      description: 'Container name to upload the blob to'
    },
    blobName: {
      type: z.string(),
      description: 'Name of the blob to create'
    },
    content: {
      type: z.string(),
      description: 'Content to upload as the blob'
    }
  };

  async execute(input: UploadBlobInput) {
    try {
      console.log(
        `[DEBUG] Uploading blob ${input.blobName} to container ${input.containerName}`
      );
      const blobServiceClient = this.createBlobServiceClient(input.accountName);

      console.log(
        `[DEBUG] Getting container client for: ${input.containerName}`
      );
      const containerClient = blobServiceClient.getContainerClient(
        input.containerName
      );

      // Check if container exists
      console.log(
        `[DEBUG] Checking if container exists: ${input.containerName}`
      );
      const containerExists = await containerClient.exists();
      if (!containerExists) {
        console.log(`[DEBUG] Container does not exist: ${input.containerName}`);
        return {
          containerName: input.containerName,
          blobName: input.blobName,
          error: 'Container does not exist'
        };
      }

      console.log(`[DEBUG] Getting block blob client for: ${input.blobName}`);
      const blockBlobClient = containerClient.getBlockBlobClient(
        input.blobName
      );

      console.log(
        `[DEBUG] Uploading blob: ${input.blobName}, size: ${input.content.length} bytes`
      );
      const uploadBlobResponse = await blockBlobClient.upload(
        input.content,
        input.content.length
      );
      console.log(`[DEBUG] Blob uploaded successfully: ${input.blobName}`);

      return {
        containerName: input.containerName,
        blobName: input.blobName,
        etag: uploadBlobResponse.etag,
        lastModified: uploadBlobResponse.lastModified,
        requestId: uploadBlobResponse.requestId
      };
    } catch (error) {
      console.error(`[DEBUG ERROR] Error uploading blob:`, error);
      if (error instanceof Error) {
        return {
          containerName: input.containerName,
          blobName: input.blobName,
          error: `Error uploading blob: ${error.message}`,
          stack: error.stack
        };
      }
      return {
        containerName: input.containerName,
        blobName: input.blobName,
        error: `Unknown error uploading blob: ${String(error)}`
      };
    }
  }
}

export default UploadBlobTool;
