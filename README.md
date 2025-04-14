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
│   │   ├── ExampleTool.ts    # Example tool template
│   │   └── BlobsTool.ts      # Azure Blob Storage integration
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

## Azure Blob Storage Tool

This MCP server includes a tool (`azure_blobs`) for interacting with Azure Blob Storage using DefaultAzureCredential for authentication.

### Required Azure Permissions

To use the Azure Blob Storage tool, you need the following Azure RBAC roles:

- **Storage Account Contributor**: Required for listing containers and managing storage account settings
- **Storage Blob Data Contributor**: Required for creating/reading/updating/deleting blobs and containers

Without these permissions, certain operations may fail with authorization errors.

### Authentication

The tool uses DefaultAzureCredential from @azure/identity, which tries multiple authentication methods in the following order:

1. Environment variables (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)
2. Managed Identity
3. Azure CLI credentials
4. Visual Studio Code credentials
5. Interactive browser login (as a fallback)

Ensure at least one of these authentication methods is properly configured.

### Operations

The Azure Blob Storage tool supports the following operations:

- **listContainers**: Lists all containers in the storage account
- **createContainer**: Creates a new container
- **listBlobs**: Lists all blobs in a container
- **uploadBlob**: Uploads a blob to a container
- **downloadBlob**: Downloads a blob and returns its content
- **deleteBlob**: Deletes a blob from a container

### Example Usage

To list containers in a storage account:

```json
{
  "operation": "listContainers",
  "accountName": "yourstorageaccount"
}
```

To upload a blob:

```json
{
  "operation": "uploadBlob",
  "accountName": "yourstorageaccount",
  "containerName": "mycontainer",
  "blobName": "example.txt",
  "content": "This is the content of the blob"
}
```

### Debugging

If you encounter issues with the Azure Blob Storage tool, check the console logs for detailed debugging information. Common issues include:

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
