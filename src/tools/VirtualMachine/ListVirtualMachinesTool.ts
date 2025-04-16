import { z } from 'zod';
import BaseAzureVirtualMachineTool, { BaseVirtualMachineInput } from './BaseAzureVirtualMachineTool';

type ListVMsInput = BaseVirtualMachineInput;

class ListVirtualMachinesTool extends BaseAzureVirtualMachineTool<ListVMsInput> {
  name = 'azure_vms_list';
  description = 'List all Azure Virtual Machines';

  schema = {
    subscriptionId: {
      type: z.string(),
      description: 'Azure Subscription ID'
    }
  };

  async execute(input: ListVMsInput) {
    const client = await this.getClient(input.subscriptionId);
    const vmList = await client.virtualMachines.listAll();
    const allVMs = [];
    for await (const vm of vmList) {
      allVMs.push({
        name: vm.name,
        id: vm.id
      });
    }
    return allVMs;
  }
}

export default ListVirtualMachinesTool;
