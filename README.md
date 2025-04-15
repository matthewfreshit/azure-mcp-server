# azure-mcp-server

A Model Context Protocol (MCP) server built with mcp-framework.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

```

## Project Structure

```
azure-mcp-server/
├── src/
│   ├── tools/                # MCP Tools
│   │   ├── Storage/      # Azure Storage tools
│   │   │   ├── BaseAzureStorageTool.ts  # Base class for Azure tools
│   │   │   ├── ListContainersTool.ts    # List containers
│   │   │   ├── CreateContainerTool.ts   # Create container
│   │   │   ├── DeleteContainerTool.ts   # Delete container
│   │   │   ├── ListBlobsTool.ts         # List blobs
│   │   │   ├── UploadBlobTool.ts        # Upload blob
│   │   │   ├── DownloadBlobTool.ts      # Download blob
│   │   │   └── DeleteBlobTool.ts        # Delete blob
│   │   └── ExampleTool.ts    # Example tool template
│   └── index.ts              # Server entry point
├── package.json
└── tsconfig.json
```

## Tool Development

### Example Tool Structure

```typescript
import { MCPTool } from 'mcp-framework';
import { z } from 'zod';

interface MyToolInput {
  message: string;
}

class MyTool extends MCPTool<MyToolInput> {
  name = 'my_tool';
  description = 'Describes what your tool does';

  schema = {
    message: {
      type: z.string(),
      description: 'Description of this input parameter'
    }
  };

  async execute(input: MyToolInput) {
    // Your tool logic here
    return `Processed: ${input.message}`;
  }
}

export default MyTool;
```

## Azure Storage Tools

This MCP server includes several tools for interacting with Azure Blob Storage using DefaultAzureCredential for authentication.

### Required Azure Permissions

To use the Azure Storage tools, you need the following Azure RBAC roles:

- **Storage Account Contributor**: Required for listing containers and managing storage account settings
- **Storage Blob Data Contributor**: Required for creating/reading/updating/deleting blobs and containers

Without these permissions, certain operations may fail with authorization errors.

### Authentication

All tools use DefaultAzureCredential from @azure/identity, which tries multiple authentication methods in the following order:

1. Environment variables (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)
2. Managed Identity
3. Azure CLI credentials
4. Visual Studio Code credentials
5. Interactive browser login (as a fallback)

Ensure at least one of these authentication methods is properly configured.

### Available Tools

The following Azure Storage tools are available:

#### Container Operations

- **azure_list_containers**: Lists all containers in a storage account
- **azure_create_container**: Creates a new container
- **azure_delete_container**: Deletes a container

#### Blob Operations

- **azure_list_blobs**: Lists all blobs in a container
- **azure_upload_blob**: Uploads a blob to a container
- **azure_download_blob**: Downloads a blob and returns its content
- **azure_delete_blob**: Deletes a blob from a container

### Example Usage

#### List Containers

```json
{
  "accountName": "yourstorageaccount"
}
```

#### Create Container

```json
{
  "accountName": "yourstorageaccount",
  "containerName": "mycontainer"
}
```

#### List Blobs

```json
{
  "accountName": "yourstorageaccount",
  "containerName": "mycontainer"
}
```

#### Upload Blob

```json
{
  "accountName": "yourstorageaccount",
  "containerName": "mycontainer",
  "blobName": "example.txt",
  "content": "This is the content of the blob"
}
```

#### Download Blob

```json
{
  "accountName": "yourstorageaccount",
  "containerName": "mycontainer",
  "blobName": "example.txt"
}
```

#### Delete Blob

```json
{
  "accountName": "yourstorageaccount",
  "containerName": "mycontainer",
  "blobName": "example.txt"
}
```

#### Delete Container

```json
{
  "accountName": "yourstorageaccount",
  "containerName": "mycontainer"
}
```

### Debugging

If you encounter issues with the Azure Storage tools, check the console logs for detailed debugging information. Common issues include:

- Authentication failures
- Missing permissions
- Non-existent containers or blobs
- Network connectivity problems

## Building and Testing

1. Make changes to your tools
2. Run `npm run build` to compile
3. The server will automatically load your tools on startup

## Learn More

- [MCP Framework Github](https://github.com/QuantGeekDev/mcp-framework)
- [MCP Framework Docs](https://mcp-framework.com)
