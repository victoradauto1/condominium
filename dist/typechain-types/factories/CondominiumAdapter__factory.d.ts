import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { CondominiumAdapter, CondominiumAdapterInterface } from "../CondominiumAdapter";
type CondominiumAdapterConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class CondominiumAdapter__factory extends ContractFactory {
    constructor(...args: CondominiumAdapterConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<CondominiumAdapter & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): CondominiumAdapter__factory;
    static readonly bytecode = "0x60a0604052348015600f57600080fd5b503373ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff1681525050608051610e8d610066600039600081816101e801526103fe0152610e8d6000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80638fc5dad8116100715780638fc5dad81461013e57806390ca27f31461015a57806394ccd17f146101765780639e1bf98514610192578063b1583546146101ae578063b7f59c99146101ca576100a9565b80630900f010146100ae57806310b2b981146100ca578063597de987146100e85780637b57ee49146101045780638da5cb5b14610120575b600080fd5b6100c860048036038101906100c391906107f3565b6101e6565b005b6100d26102b7565b6040516100df919061082f565b60405180910390f35b61010260048036038101906100fd91906107f3565b6102e0565b005b61011e60048036038101906101199190610990565b61036e565b005b6101286103fc565b604051610135919061082f565b60405180910390f35b61015860048036038101906101539190610990565b610420565b005b610174600480360381019061016f91906109fe565b6104ae565b005b610190600480360381019061018b9190610a7f565b61053f565b005b6101ac60048036038101906101a79190610990565b6105d1565b005b6101c860048036038101906101c39190610b44565b61065f565b005b6101e460048036038101906101df9190610bbc565b6106f0565b005b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610274576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161026b90610c59565b60405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663597de987826040518263ffffffff1660e01b8152600401610339919061082f565b600060405180830381600087803b15801561035357600080fd5b505af1158015610367573d6000803e3d6000fd5b5050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16637b57ee49826040518263ffffffff1660e01b81526004016103c79190610ce7565b600060405180830381600087803b1580156103e157600080fd5b505af11580156103f5573d6000803e3d6000fd5b5050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16638fc5dad8826040518263ffffffff1660e01b81526004016104799190610ce7565b600060405180830381600087803b15801561049357600080fd5b505af11580156104a7573d6000803e3d6000fd5b5050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166390ca27f383836040518363ffffffff1660e01b8152600401610509929190610d80565b600060405180830381600087803b15801561052357600080fd5b505af1158015610537573d6000803e3d6000fd5b505050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c1e6adfd84846040518363ffffffff1660e01b815260040161059a929190610db0565b600060405180830381600087803b1580156105b457600080fd5b505af11580156105c8573d6000803e3d6000fd5b50505050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16639e1bf985826040518263ffffffff1660e01b815260040161062a9190610ce7565b600060405180830381600087803b15801561064457600080fd5b505af1158015610658573d6000803e3d6000fd5b5050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b158354683836040518363ffffffff1660e01b81526004016106ba929190610df6565b600060405180830381600087803b1580156106d457600080fd5b505af11580156106e8573d6000803e3d6000fd5b505050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663b7f59c9983836040518363ffffffff1660e01b815260040161074b929190610e2e565b600060405180830381600087803b15801561076557600080fd5b505af1158015610779573d6000803e3d6000fd5b505050505050565b6000604051905090565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006107c082610795565b9050919050565b6107d0816107b5565b81146107db57600080fd5b50565b6000813590506107ed816107c7565b92915050565b6000602082840312156108095761080861078b565b5b6000610817848285016107de565b91505092915050565b610829816107b5565b82525050565b60006020820190506108446000830184610820565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61089d82610854565b810181811067ffffffffffffffff821117156108bc576108bb610865565b5b80604052505050565b60006108cf610781565b90506108db8282610894565b919050565b600067ffffffffffffffff8211156108fb576108fa610865565b5b61090482610854565b9050602081019050919050565b82818337600083830152505050565b600061093361092e846108e0565b6108c5565b90508281526020810184848401111561094f5761094e61084f565b5b61095a848285610911565b509392505050565b600082601f8301126109775761097661084a565b5b8135610987848260208601610920565b91505092915050565b6000602082840312156109a6576109a561078b565b5b600082013567ffffffffffffffff8111156109c4576109c3610790565b5b6109d084828501610962565b91505092915050565b600481106109e657600080fd5b50565b6000813590506109f8816109d9565b92915050565b60008060408385031215610a1557610a1461078b565b5b600083013567ffffffffffffffff811115610a3357610a32610790565b5b610a3f85828601610962565b9250506020610a50858286016109e9565b9150509250929050565b60048110610a6757600080fd5b50565b600081359050610a7981610a5a565b92915050565b600080600060608486031215610a9857610a9761078b565b5b600084013567ffffffffffffffff811115610ab657610ab5610790565b5b610ac286828701610962565b935050602084013567ffffffffffffffff811115610ae357610ae2610790565b5b610aef86828701610962565b9250506040610b0086828701610a6a565b9150509250925092565b600061ffff82169050919050565b610b2181610b0a565b8114610b2c57600080fd5b50565b600081359050610b3e81610b18565b92915050565b60008060408385031215610b5b57610b5a61078b565b5b6000610b69858286016107de565b9250506020610b7a85828601610b2f565b9150509250929050565b60008115159050919050565b610b9981610b84565b8114610ba457600080fd5b50565b600081359050610bb681610b90565b92915050565b60008060408385031215610bd357610bd261078b565b5b6000610be1858286016107de565b9250506020610bf285828601610ba7565b9150509250929050565b600082825260208201905092915050565b7f596f7520646f206e6f742068617665207065726d697373696f6e000000000000600082015250565b6000610c43601a83610bfc565b9150610c4e82610c0d565b602082019050919050565b60006020820190508181036000830152610c7281610c36565b9050919050565b600081519050919050565b60005b83811015610ca2578082015181840152602081019050610c87565b60008484015250505050565b6000610cb982610c79565b610cc38185610bfc565b9350610cd3818560208601610c84565b610cdc81610854565b840191505092915050565b60006020820190508181036000830152610d018184610cae565b905092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60048110610d4957610d48610d09565b5b50565b6000819050610d5a82610d38565b919050565b6000610d6a82610d4c565b9050919050565b610d7a81610d5f565b82525050565b60006040820190508181036000830152610d9a8185610cae565b9050610da96020830184610d71565b9392505050565b60006040820190508181036000830152610dca8185610cae565b90508181036020830152610dde8184610cae565b90509392505050565b610df081610b0a565b82525050565b6000604082019050610e0b6000830185610820565b610e186020830184610de7565b9392505050565b610e2881610b84565b82525050565b6000604082019050610e436000830185610820565b610e506020830184610e1f565b939250505056fea26469706673582212201f75a8ef9d405285b75008a60ce72544bcba371f53224138636eae86549ebf1164736f6c634300081c0033";
    static readonly abi: readonly [{
        readonly inputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "constructor";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "resident";
            readonly type: "address";
        }, {
            readonly internalType: "uint16";
            readonly name: "residenceId";
            readonly type: "uint16";
        }];
        readonly name: "addResident";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "title";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "description";
            readonly type: "string";
        }, {
            readonly internalType: "enum CondominiumLib.Category";
            readonly name: "";
            readonly type: "uint8";
        }];
        readonly name: "addTopic";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "title";
            readonly type: "string";
        }];
        readonly name: "closeVoting";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "getImplementAddress";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "title";
            readonly type: "string";
        }];
        readonly name: "openVoting";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "owner";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "resident";
            readonly type: "address";
        }];
        readonly name: "removeResident";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "title";
            readonly type: "string";
        }];
        readonly name: "removeTopic";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "resident";
            readonly type: "address";
        }, {
            readonly internalType: "bool";
            readonly name: "isEntering";
            readonly type: "bool";
        }];
        readonly name: "setConsuelor";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "newImplementation";
            readonly type: "address";
        }];
        readonly name: "upgrade";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "title";
            readonly type: "string";
        }, {
            readonly internalType: "enum CondominiumLib.Options";
            readonly name: "option";
            readonly type: "uint8";
        }];
        readonly name: "vote";
        readonly outputs: readonly [];
        readonly stateMutability: "nonpayable";
        readonly type: "function";
    }];
    static createInterface(): CondominiumAdapterInterface;
    static connect(address: string, runner?: ContractRunner | null): CondominiumAdapter;
}
export {};
