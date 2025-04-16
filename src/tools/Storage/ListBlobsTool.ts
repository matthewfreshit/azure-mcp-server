import { z } from 'zod';
import BaseAzureStorageTool from './BaseAzureStorageTool';

interface ListBlobsInput {
  accountName: string;
  containerName: string;
}

/**
 * Tool for listing blobs in a container
 */
class ListBlobsTool extends BaseAzureStorageTool<ListBlobsInput> {
  name = 'azure_list_blobs';
  description = 'List all blobs in a container';

  schema = {
    accountName: {
      type: z.string(),
      description: 'Azure Storage account name'
    },
    containerName: {
      type: z.string(),
      description: 'Container name to list blobs from'
    }
  };

  async execute(input: ListBlobsInput) {
    console.log(`[DEBUG] Starting ListBlobsTool for container: ${input.containerName}`);

    try {
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
          blobs: [],
          error: 'Container does not exist'
        };
      }

      console.log(`[DEBUG] Container exists, attempting to list blobs`);

      // Try a simpler approach first - just get the iterator
      const blobIterator = containerClient.listBlobsFlat();
      const blobs = [];

      // Get the first blob to test if iteration works
      console.log(`[DEBUG] Attempting to get first blob`);
      const firstBlobResponse = await blobIterator.next();

      if (!firstBlobResponse.done && firstBlobResponse.value) {
        console.log(`[DEBUG] Successfully retrieved first blob: ${firstBlobResponse.value.name}`);

        // Add the first blob to our results
        const firstBlob = firstBlobResponse.value;
        blobs.push({
          name: firstBlob.name,
          contentType: firstBlob.properties?.contentType || 'unknown',
          contentLength: firstBlob.properties?.contentLength || 0,
          lastModified: firstBlob.properties?.lastModified || new Date(),
          blobType: firstBlob.properties?.blobType || 'unknown'
        });

        // Now try to get the rest of the blobs
        console.log(`[DEBUG] Retrieving remaining blobs`);
        let nextBlob = await blobIterator.next();
        let count = 1;

        while (!nextBlob.done) {
          const blob = nextBlob.value;
          blobs.push({
            name: blob.name,
            contentType: blob.properties?.contentType || 'unknown',
            contentLength: blob.properties?.contentLength || 0,
            lastModified: blob.properties?.lastModified || new Date(),
            blobType: blob.properties?.blobType || 'unknown'
          });

          nextBlob = await blobIterator.next();
          count++;
        }

        console.log(`[DEBUG] Retrieved ${blobs.length} blobs in total`);
      } else {
        console.log(`[DEBUG] No blobs found in container or error getting first blob`);
      }

      console.log(`[DEBUG] Completed listBlobs, found ${blobs.length} blobs`);
      return { containerName: input.containerName, blobs };
    } catch (error) {
      console.error(`[DEBUG ERROR] Error in listBlobs:`, error);
      if (error instanceof Error) {
        return {
          containerName: input.containerName,
          blobs: [],
          error: `Error listing blobs: ${error.message}`,
          stack: error.stack
        };
      }
      return {
        containerName: input.containerName,
        blobs: [],
        error: `Unknown error listing blobs: ${String(error)}`
      };
    }
  }
}

export default ListBlobsTool;
