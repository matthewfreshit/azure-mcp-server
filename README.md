# Azure MCP Server

A Model Context Protocol (MCP) server built with mcp-framework that provides tools for interacting with Azure services.

## Quick Start

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

## Project Structure

```
azure-mcp-server/
├── src/
│   ├── tools/                # MCP Tools
│   │   ├── Storage/          # Azure Storage tools
│   │   ├── VirtualMachine/   # Azure VM tools
│   │   └── AppService/      # Azure App Service tools
│   └── index.ts              # Server entry point
├── package.json
└── tsconfig.json
```

## Azure Tools Overview

This server provides tools for interacting with multiple Azure services:

| Service          | Tool Prefix    | Description              |
| ---------------- | -------------- | ------------------------ |
| Storage          | `azure_*`      | Blob storage operations  |
| Virtual Machines | `azure_vms_*`  | VM management operations |
| App Service      | `azure_apps_*` | App Service operations   |

### Authentication

All tools use DefaultAzureCredential from @azure/identity, which tries multiple authentication methods in the following order:

1. Environment variables (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)
2. Managed Identity
3. Azure CLI credentials
4. Visual Studio Code credentials
5. Interactive browser login (as a fallback)

## Available Tools

### Azure Storage Tools

#### Required Permissions

- **Storage Account Contributor**: For managing storage account settings
- **Storage Blob Data Contributor**: For CRUD operations on blobs and containers

#### Container Operations

| Tool                       | Description      | Example Input                                                             |
| -------------------------- | ---------------- | ------------------------------------------------------------------------- |
| **azure_list_containers**  | List containers  | `{ "accountName": "yourstorageaccount" }`                                 |
| **azure_create_container** | Create container | `{ "accountName": "yourstorageaccount", "containerName": "mycontainer" }` |
| **azure_delete_container** | Delete container | `{ "accountName": "yourstorageaccount", "containerName": "mycontainer" }` |

#### Blob Operations

| Tool                    | Description   | Example Input                                                                                                                          |
| ----------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **azure_list_blobs**    | List blobs    | `{ "accountName": "yourstorageaccount", "containerName": "mycontainer" }`                                                              |
| **azure_upload_blob**   | Upload blob   | `{ "accountName": "yourstorageaccount", "containerName": "mycontainer", "blobName": "example.txt", "content": "This is the content" }` |
| **azure_download_blob** | Download blob | `{ "accountName": "yourstorageaccount", "containerName": "mycontainer", "blobName": "example.txt" }`                                   |
| **azure_delete_blob**   | Delete blob   | `{ "accountName": "yourstorageaccount", "containerName": "mycontainer", "blobName": "example.txt" }`                                   |

### Azure Virtual Machine Tools

#### Required Permissions

- **Virtual Machine Contributor**: For managing VMs
- **Reader**: For listing and viewing VM details

#### VM Operations

| Tool                  | Description | Example Input                                                                                                        |
| --------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------- |
| **azure_vms_list**    | List VMs    | `{ "subscriptionId": "your-subscription-id" }`                                                                       |
| **azure_vms_start**   | Start VM    | `{ "subscriptionId": "your-subscription-id", "resourceGroupName": "your-resource-group", "vmName": "your-vm-name" }` |
| **azure_vms_stop**    | Stop VM     | `{ "subscriptionId": "your-subscription-id", "resourceGroupName": "your-resource-group", "vmName": "your-vm-name" }` |
| **azure_vms_restart** | Restart VM  | `{ "subscriptionId": "your-subscription-id", "resourceGroupName": "your-resource-group", "vmName": "your-vm-name" }` |
| **azure_vms_delete**  | Delete VM   | `{ "subscriptionId": "your-subscription-id", "resourceGroupName": "your-resource-group", "vmName": "your-vm-name" }` |

### Azure App Service Tools

#### Required Permissions

- **Website Contributor**: For managing App Services
- **Reader**: For listing and viewing App Service details

#### App Service Operations

| Tool                      | Description             | Example Input                                                                                                          |
| ------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **azure_apps_list**       | List App Services       | `{ "subscriptionId": "your-subscription-id" }`                                                                         |
| **azure_apps_get**        | Get App Service details | `{ "subscriptionId": "your-subscription-id", "resourceGroupName": "your-resource-group", "appName": "your-app-name" }` |
| **azure_apps_get_config** | Get App Service config  | `{ "subscriptionId": "your-subscription-id", "resourceGroupName": "your-resource-group", "appName": "your-app-name" }` |
| **azure_apps_start**      | Start App Service       | `{ "subscriptionId": "your-subscription-id", "resourceGroupName": "your-resource-group", "appName": "your-app-name" }` |
| **azure_apps_stop**       | Stop App Service        | `{ "subscriptionId": "your-subscription-id", "resourceGroupName": "your-resource-group", "appName": "your-app-name" }` |
| **azure_apps_restart**    | Restart App Service     | `{ "subscriptionId": "your-subscription-id", "resourceGroupName": "your-resource-group", "appName": "your-app-name" }` |

## Tool Development

### Creating a New Tool

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

## Debugging

If you encounter issues with the Azure tools, check the console logs for detailed debugging information. Common issues include:

- Authentication failures
- Missing permissions
- Non-existent resources
- Network connectivity problems

## Building and Testing

1. Make changes to your tools
2. Run `npm run build` to compile
3. The server will automatically load your tools on startup

## Learn More

- [MCP Framework Github](https://github.com/QuantGeekDev/mcp-framework)
- [MCP Framework Docs](https://mcp-framework.com)
