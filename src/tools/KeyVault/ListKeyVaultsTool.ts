import { KeyVaultManagementClient } from '@azure/arm-keyvault';
import { DefaultAzureCredential } from '@azure/identity';
import { MCPTool } from 'mcp-framework';
import { z } from 'zod';

interface ListVaultsInput {
  subscriptionId: string;
}

class ListKeyVaultsTool extends MCPTool<ListVaultsInput> {
  name = 'azure_keyvault_list';
  description = 'List all Azure Key Vaults in a subscription';

  schema = {
    subscriptionId: {
      type: z.string(),
      description: 'Azure Subscription ID'
    }
  };

  async execute(input: ListVaultsInput) {
    try {
      const credential = new DefaultAzureCredential();
      const client = new KeyVaultManagementClient(credential, input.subscriptionId);

      const vaults = [];
      for await (const vault of client.vaults.list()) {
        vaults.push({
          id: vault.id,
          name: vault.name,
          location: vault.location,
          tags: vault.tags
        });
      }

      return { vaults };
    } catch (error) {
      if (error instanceof Error) {
        return {
          error: `Error listing Key Vaults: ${error.message}`,
          vaults: []
        };
      }
      return {
        error: 'Unknown error occurred',
        vaults: []
      };
    }
  }
}

export default ListKeyVaultsTool;
