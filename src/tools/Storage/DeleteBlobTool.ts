import { z } from 'zod';
import { BaseAzureStorageTool } from './BaseAzureStorageTool';

interface DeleteBlobInput {
  accountName: string;
  containerName: string;
  blobName: string;
}

/**
 * Tool for deleting a blob from a container
 */
class DeleteBlobTool extends BaseAzureStorageTool<DeleteBlobInput> {
  name = 'azure_delete_blob';
  description = 'Delete a blob from a container in Azure Storage';

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
      description: 'Name of the blob to delete'
    }
  };

  async execute(input: DeleteBlobInput) {
    try {
      console.log(`[DEBUG] Deleting blob ${input.blobName} from container ${input.containerName}`);
      const blobServiceClient = this.createBlobServiceClient(input.accountName);
      
      console.log(`[DEBUG] Getting container client for: ${input.containerName}`);
      const containerClient = blobServiceClient.getContainerClient(input.containerName);
      
      // Check if container exists
      console.log(`[DEBUG] Checking if container exists: ${input.containerName}`);
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

      console.log(`[DEBUG] Deleting blob: ${input.blobName}`);
      await blobClient.delete();
      console.log(`[DEBUG] Blob deleted successfully: ${input.blobName}`);

      return {
        containerName: input.containerName,
        blobName: input.blobName,
        deleted: true
      };
    } catch (error) {
      console.error(`[DEBUG ERROR] Error deleting blob:`, error);
      if (error instanceof Error) {
        return {
          containerName: input.containerName,
          blobName: input.blobName,
          error: `Error deleting blob: ${error.message}`,
          stack: error.stack
        };
      }
      return {
        containerName: input.containerName,
        blobName: input.blobName,
        error: `Unknown error deleting blob: ${String(error)}`
      };
    }
  }
}

export default DeleteBlobTool;
