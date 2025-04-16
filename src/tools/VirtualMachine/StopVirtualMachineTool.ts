import { z } from 'zod';
import BaseAzureVirtualMachineTool, { BaseVirtualMachineInput } from './BaseAzureVirtualMachineTool';

type StopVMInput = Required<BaseVirtualMachineInput>;

class StopVirtualMachineTool extends BaseAzureVirtualMachineTool<StopVMInput> {
  name = 'azure_vms_stop';
  description = 'Stop an Azure Virtual Machine';

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

  async execute(input: StopVMInput) {
    this.validateResourceGroup(input.resourceGroupName);
    this.validateVmName(input.vmName);

    const client = await this.getClient(input.subscriptionId);
    await client.virtualMachines.beginPowerOffAndWait(input.resourceGroupName, input.vmName);
    return { status: 'stopped', vmName: input.vmName };
  }
}

export default StopVirtualMachineTool;
