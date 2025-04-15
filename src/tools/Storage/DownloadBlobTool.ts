import { z } from 'zod';
import BaseAzureStorageTool from './BaseAzureStorageTool';

interface DownloadBlobInput {
  accountName: string;
  containerName: string;
  blobName: string;
}

/**
 * Tool for downloading a blob from a container
 */
class DownloadBlobTool extends BaseAzureStorageTool<DownloadBlobInput> {
  name = 'azure_download_blob';
  description = 'Download a blob from a container in Azure Storage';

  schema = {
    accountName: {
      type: z.string(),
      description: 'Azure Storage account name'
    },
    containerName: {
      type: z.string(),
      description: 'Container name where the blob is stored'
    },
    blobName: {
      type: z.string(),
      description: 'Name of the blob to download'
    }
  };

  async execute(input: DownloadBlobInput) {
    try {
      console.log(
        `[DEBUG] Downloading blob ${input.blobName} from container ${input.containerName}`
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

      console.log(`[DEBUG] Getting blob client for: ${input.blobName}`);
      const blobClient = containerClient.getBlobClient(input.blobName);

      // Check if blob exists
      console.log(`[DEBUG] Checking if blob exists: ${input.blobName}`);
      const blobExists = await blobClient.exists();
      if (!blobExists) {
        console.log(`[DEBUG] Blob does not exist: ${input.blobName}`);
        return {
          containerName: input.containerName,
          blobName: input.blobName,
          error: 'Blob does not exist'
        };
      }

      console.log(`[DEBUG] Downloading blob: ${input.blobName}`);
      const downloadResponse = await blobClient.download();
      console.log(`[DEBUG] Blob downloaded, converting stream to string`);
      const downloaded = await this.streamToString(
        downloadResponse.readableStreamBody
      );
      console.log(
        `[DEBUG] Blob content retrieved, size: ${downloaded.length} bytes`
      );

      return {
        containerName: input.containerName,
        blobName: input.blobName,
        content: downloaded,
        contentType: downloadResponse.contentType,
        contentLength: downloadResponse.contentLength
      };
    } catch (error) {
      console.error(`[DEBUG ERROR] Error downloading blob:`, error);
      if (error instanceof Error) {
        return {
          containerName: input.containerName,
          blobName: input.blobName,
          error: `Error downloading blob: ${error.message}`,
          stack: error.stack
        };
      }
      return {
        containerName: input.containerName,
        blobName: input.blobName,
        error: `Unknown error downloading blob: ${String(error)}`
      };
    }
  }
}

export default DownloadBlobTool;
