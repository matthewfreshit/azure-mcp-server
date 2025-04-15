import { z } from 'zod';
import { BaseAzureStorageTool } from './BaseAzureStorageTool';

interface DeleteContainerInput {
  accountName: string;
  containerName: string;
}

/**
 * Tool for deleting a container in Azure Storage
 */
class DeleteContainerTool extends BaseAzureStorageTool<DeleteContainerInput> {
  name = 'azure_delete_container';
  description = 'Delete a container from an Azure Storage account';

  schema = {
    accountName: {
      type: z.string(),
      description: 'Azure Storage account name'
    },
    containerName: {
      type: z.string(),
      description: 'Name of the container to delete'
    }
  };

  async execute(input: DeleteContainerInput) {
    try {
      console.log(`[DEBUG] Deleting container ${input.containerName} from account ${input.accountName}`);
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
          error: 'Container does not exist'
        };
      }
      
      console.log(`[DEBUG] Deleting container: ${input.containerName}`);
      const deleteContainerResponse = await containerClient.delete();
      console.log(`[DEBUG] Container deleted successfully: ${input.containerName}`);

      return {
        containerName: input.containerName,
        deleted: true,
        requestId: deleteContainerResponse.requestId,
        date: deleteContainerResponse.date
      };
    } catch (error) {
      console.error(`[DEBUG ERROR] Error deleting container:`, error);
      if (error instanceof Error) {
        return {
          containerName: input.containerName,
          deleted: false,
          error: `Error deleting container: ${error.message}`,
          stack: error.stack
        };
      }
      return {
        containerName: input.containerName,
        deleted: false,
        error: `Unknown error deleting container: ${String(error)}`
      };
    }
  }
}

export default DeleteContainerTool;
