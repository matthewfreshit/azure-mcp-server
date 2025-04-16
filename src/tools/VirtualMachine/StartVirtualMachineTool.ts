import { z } from 'zod';
import { BaseAzureVirtualMachineTool, BaseVirtualMachineInput } from './BaseAzureVirtualMachineTool';

type StartVMInput = Required<BaseVirtualMachineInput>;

class StartVirtualMachineTool extends BaseAzureVirtualMachineTool<StartVMInput> {
    name = 'azure_vms_start';
    description = 'Start an Azure Virtual Machine';

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

    async execute(input: StartVMInput) {
        this.validateResourceGroup(input.resourceGroupName);
        this.validateVmName(input.vmName);

        const client = await this.getClient(input.subscriptionId);
        await client.virtualMachines.beginStartAndWait(input.resourceGroupName, input.vmName);
        return { status: 'started', vmName: input.vmName };
    }
}

export default StartVirtualMachineTool;