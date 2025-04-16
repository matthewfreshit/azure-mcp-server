import { z } from 'zod';
import { BaseAzureVirtualMachineTool, BaseVirtualMachineInput } from './BaseAzureVirtualMachineTool';

type RestartVMInput = Required<BaseVirtualMachineInput>;

class RestartVirtualMachineTool extends BaseAzureVirtualMachineTool<RestartVMInput> {
    name = 'azure_vms_restart';
    description = 'Restart an Azure Virtual Machine';

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

    async execute(input: RestartVMInput) {
        this.validateResourceGroup(input.resourceGroupName);
        this.validateVmName(input.vmName);

        const client = await this.getClient(input.subscriptionId);
        await client.virtualMachines.beginRestartAndWait(input.resourceGroupName, input.vmName);
        return { status: 'restarted', vmName: input.vmName };
    }
}

export default RestartVirtualMachineTool;