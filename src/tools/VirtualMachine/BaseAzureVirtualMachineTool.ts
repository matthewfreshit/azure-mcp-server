import { MCPTool } from 'mcp-framework';
import { ComputeManagementClient } from '@azure/arm-compute';
import { DefaultAzureCredential } from '@azure/identity';

export interface BaseVirtualMachineInput {
  subscriptionId: string;
  resourceGroupName?: string;
  vmName?: string;
}

export default abstract class BaseAzureVirtualMachineTool<T extends BaseVirtualMachineInput> extends MCPTool<T> {
  abstract name: string;
  abstract description: string;

  protected async getClient(subscriptionId: string): Promise<ComputeManagementClient> {
    const credential = new DefaultAzureCredential();
    return new ComputeManagementClient(credential, subscriptionId);
  }

  protected validateResourceGroup(resourceGroupName?: string): void {
    if (!resourceGroupName) {
      throw new Error('Resource Group name is required for this operation.');
    }
  }

  protected validateVmName(vmName?: string): void {
    if (!vmName) {
      throw new Error('Virtual Machine name is required for this operation.');
    }
  }
}
