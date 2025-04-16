import { z } from 'zod';
import BaseAzureVirtualMachineTool, { BaseVirtualMachineInput } from './BaseAzureVirtualMachineTool';

type DeleteVMInput = Required<BaseVirtualMachineInput>;

class DeleteVirtualMachineTool extends BaseAzureVirtualMachineTool<DeleteVMInput> {
  name = 'azure_vms_delete';
  description = 'Delete an Azure Virtual Machine';

  schema = {
    subscriptionId: {
      type: z.string(),
      description: 'Azure Subscription ID'
    },
    resourceGroupName: {
      type: z.string(),
      description: 'Azure Resource Group name'
    },
    vmName: {
      type: z.string(),
      description: 'Virtual Machine name'
    }
  };

  async execute(input: DeleteVMInput) {
    this.validateResourceGroup(input.resourceGroupName);
    this.validateVmName(input.vmName);

    const client = await this.getClient(input.subscriptionId);
    await client.virtualMachines.beginDeleteAndWait(input.resourceGroupName, input.vmName);
    return { status: 'deleted', vmName: input.vmName };
  }
}

export default DeleteVirtualMachineTool;
