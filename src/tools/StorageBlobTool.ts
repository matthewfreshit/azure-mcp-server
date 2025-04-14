import { MCPTool } from 'mcp-framework';
import { z } from 'zod';
import { BlobServiceClient } from '@azure/storage-blob';
import { DefaultAzureCredential } from '@azure/identity';

interface StorageBlobToolInput {
  operation: string;
  accountName: string;
  containerName?: string;
  blobName?: string;
  content?: string;
}

class StorageBlobTool extends MCPTool<StorageBlobToolInput> {
  name = 'azure_blobs';
  description = 'Interact with Azure Blob Storage using DefaultAzureCredential';

  schema = {
    operation: {
      type: z.enum([
        'listContainers',
        'createContainer',
        'listBlobs',
        'uploadBlob',
        'downloadBlob',
        'deleteBlob'
      ]),
      description: 'Operation to perform on Azure Blob Storage'
    },
    accountName: {
      type: z.string(),
      description: 'Azure Storage account name'
    },
    containerName: {
      type: z.string().optional(),
      description: 'Container name (required for container and blob operations)'
    },
    blobName: {
      type: z.string().optional(),
      description: 'Blob name (required for blob operations)'
    },
    content: {
      type: z.string().optional(),
      description: 'Content to upload (required for uploadBlob operation)'
    }
  };

  async execute(input: StorageBlobToolInput) {
    try {
      // Create BlobServiceClient with DefaultAzureCredential
      const credential = new DefaultAzureCredential();
      const blobServiceClient = new BlobServiceClient(
        `https://${input.accountName}.blob.core.windows.net`,
        credential
      );

      switch (input.operation) {
        case 'listContainers':
          return await this.listContainers(blobServiceClient);
        case 'createContainer':
          return await this.createContainer(
            blobServiceClient,
            input.containerName
          );
        case 'listBlobs':
          return await this.listBlobs(blobServiceClient, input.containerName);
        case 'uploadBlob':
          return await this.uploadBlob(
            blobServiceClient,
            input.containerName,
            input.blobName,
            input.content
          );
        case 'downloadBlob':
          return await this.downloadBlob(
            blobServiceClient,
            input.containerName,
            input.blobName
          );
        case 'deleteBlob':
          return await this.deleteBlob(
            blobServiceClient,
            input.containerName,
            input.blobName
          );
        default:
          throw new Error(`Unsupported operation: ${input.operation}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Azure Blob Storage error: ${error.message}`);
      }
      throw error;
    }
  }

  private async listContainers(blobServiceClient: BlobServiceClient) {
    const containers = [];
    for await (const container of blobServiceClient.listContainers()) {
      containers.push({
        name: container.name,
        properties: container.properties
      });
    }
    return { containers };
  }

  private async createContainer(
    blobServiceClient: BlobServiceClient,
    containerName?: string
  ) {
    if (!containerName) {
      throw new Error(
        'Container name is required for createContainer operation'
      );
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const createContainerResponse = await containerClient.create();

    return {
      containerName,
      created: true,
      requestId: createContainerResponse.requestId,
      date: createContainerResponse.date
    };
  }

  private async listBlobs(
    blobServiceClient: BlobServiceClient,
    containerName?: string
  ) {
    if (!containerName) {
      throw new Error('Container name is required for listBlobs operation');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobs = [];

    try {
      // Use the safer byPage approach to handle potential large lists
      for await (const response of containerClient
        .listBlobsFlat()
        .byPage({ maxPageSize: 50 })) {
        if (response.segment && response.segment.blobItems) {
          for (const blob of response.segment.blobItems) {
            // Safely access properties with optional chaining
            blobs.push({
              name: blob.name,
              contentType: blob.properties?.contentType || 'unknown',
              contentLength: blob.properties?.contentLength || 0,
              lastModified: blob.properties?.lastModified || new Date(),
              blobType: blob.properties?.blobType || 'unknown'
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error listing blobs: ${error.message}`);
      }
      throw error;
    }

    return { containerName, blobs };
  }

  private async uploadBlob(
    blobServiceClient: BlobServiceClient,
    containerName?: string,
    blobName?: string,
    content?: string
  ) {
    if (!containerName) {
      throw new Error('Container name is required for uploadBlob operation');
    }
    if (!blobName) {
      throw new Error('Blob name is required for uploadBlob operation');
    }
    if (!content) {
      throw new Error('Content is required for uploadBlob operation');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const uploadBlobResponse = await blockBlobClient.upload(
      content,
      content.length
    );

    return {
      containerName,
      blobName,
      etag: uploadBlobResponse.etag,
      lastModified: uploadBlobResponse.lastModified,
      requestId: uploadBlobResponse.requestId
    };
  }

  private async downloadBlob(
    blobServiceClient: BlobServiceClient,
    containerName?: string,
    blobName?: string
  ) {
    if (!containerName) {
      throw new Error('Container name is required for downloadBlob operation');
    }
    if (!blobName) {
      throw new Error('Blob name is required for downloadBlob operation');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadResponse = await blobClient.download();
    const downloaded = await this.streamToString(
      downloadResponse.readableStreamBody
    );

    return {
      containerName,
      blobName,
      content: downloaded,
      contentType: downloadResponse.contentType,
      contentLength: downloadResponse.contentLength
    };
  }

  private async deleteBlob(
    blobServiceClient: BlobServiceClient,
    containerName?: string,
    blobName?: string
  ) {
    if (!containerName) {
      throw new Error('Container name is required for deleteBlob operation');
    }
    if (!blobName) {
      throw new Error('Blob name is required for deleteBlob operation');
    }

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    await blobClient.delete();

    return {
      containerName,
      blobName,
      deleted: true
    };
  }

  // Helper method to convert a readable stream to a string
  private async streamToString(
    readableStream: NodeJS.ReadableStream | undefined
  ): Promise<string> {
    if (!readableStream) {
      return '';
    }

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (data: Buffer) => {
        chunks.push(data);
      });
      readableStream.on('end', () => {
        resolve(Buffer.concat(chunks).toString('utf8'));
      });
      readableStream.on('error', reject);
    });
  }
}

export default StorageBlobTool;
