import { z } from 'zod';
import BaseAzureStorageTool from './BaseAzureStorageTool';

interface CreateContainerInput {
  accountName: string;
  containerName: string;
}

/**
 * Tool for creating a container in an Azure Storage account
 */
class CreateContainerTool extends BaseAzureStorageTool<CreateContainerInput> {
  name = 'azure_create_container';
  description = 'Create a new container in an Azure Storage account';

  schema = {
    accountName: {
      type: z.string(),
      description: 'Azure Storage account name'
    },
    containerName: {
      type: z.string(),
      description: 'Name of the container to create'
    }
  };

  async execute(input: CreateContainerInput) {
    try {
      console.log(
        `[DEBUG] Creating container ${input.containerName} in account ${input.accountName}`
      );
      const blobServiceClient = this.createBlobServiceClient(input.accountName);

      console.log(
        `[DEBUG] Getting container client for: ${input.containerName}`
      );
      const containerClient = blobServiceClient.getContainerClient(
        input.containerName
      );

      // Check if container already exists
      console.log(
        `[DEBUG] Checking if container exists: ${input.containerName}`
      );
      const containerExists = await containerClient.exists();
      if (containerExists) {
        console.log(`[DEBUG] Container already exists: ${input.containerName}`);
        return {
          containerName: input.containerName,
          created: false,
          error: 'Container already exists'
        };
      }

      console.log(`[DEBUG] Creating container: ${input.containerName}`);
      const createContainerResponse = await containerClient.create();
      console.log(
        `[DEBUG] Container created successfully: ${input.containerName}`
      );

      return {
        containerName: input.containerName,
        created: true,
        requestId: createContainerResponse.requestId,
        date: createContainerResponse.date
      };
    } catch (error) {
      console.error(`[DEBUG ERROR] Error creating container:`, error);
      if (error instanceof Error) {
        return {
          containerName: input.containerName,
          created: false,
          error: `Error creating container: ${error.message}`,
          stack: error.stack
        };
      }
      return {
        containerName: input.containerName,
        created: false,
        error: `Unknown error creating container: ${String(error)}`
      };
    }
  }
}

export default CreateContainerTool;
