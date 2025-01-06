import { type ContractRunner } from "ethers";
import type { ICondominium, ICondominiumInterface } from "../../ICondominuim.sol/ICondominium";
export declare class ICondominium__factory {
    static readonly abi: readonly [{
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
    static createInterface(): ICondominiumInterface;
    static connect(address: string, runner?: ContractRunner | null): ICondominium;
}
