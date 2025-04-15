import { z } from 'zod';
import { BaseAzureStorageTool } from './BaseAzureStorageTool';

interface ListContainersInput {
  accountName: string;
}

/**
 * Tool for listing containers in an Azure Storage account
 */
class ListContainersTool extends BaseAzureStorageTool<ListContainersInput> {
  name = 'azure_list_containers';
  description = 'List all containers in an Azure Storage account';

  schema = {
    accountName: {
      type: z.string(),
      description: 'Azure Storage account name'
    }
  };

  async execute(input: ListContainersInput) {
    try {
      console.log(`[DEBUG] Starting ListContainersTool for account: ${input.accountName}`);
      const blobServiceClient = this.createBlobServiceClient(input.accountName);
      
      console.log(`[DEBUG] Getting container iterator`);
      const containerIterator = blobServiceClient.listContainers();
      
      const containers = [];
      console.log(`[DEBUG] Iterating through containers`);
      for await (const container of containerIterator) {
        console.log(`[DEBUG] Found container: ${container.name}`);
        containers.push({
          name: container.name,
          properties: container.properties
        });
      }
      console.log(`[DEBUG] Found ${containers.length} containers in total`);
      
      return { containers };
    } catch (error) {
      console.error(`[DEBUG ERROR] Error listing containers:`, error);
      if (error instanceof Error) {
        return {
          containers: [],
          error: `Error listing containers: ${error.message}`,
          stack: error.stack
        };
      }
      return {
        containers: [],
        error: `Unknown error listing containers: ${String(error)}`
      };
    }
  }
}

export default ListContainersTool;
