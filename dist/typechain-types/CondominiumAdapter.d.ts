import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export interface CondominiumAdapterInterface extends Interface {
    getFunction(nameOrSignature: "addResident" | "addTopic" | "closeVoting" | "getImplementAddress" | "openVoting" | "owner" | "removeResident" | "removeTopic" | "setConsuelor" | "upgrade" | "vote"): FunctionFragment;
    encodeFunctionData(functionFragment: "addResident", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "addTopic", values: [string, string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "closeVoting", values: [string]): string;
    encodeFunctionData(functionFragment: "getImplementAddress", values?: undefined): string;
    encodeFunctionData(functionFragment: "openVoting", values: [string]): string;
    encodeFunctionData(functionFragment: "owner", values?: undefined): string;
    encodeFunctionData(functionFragment: "removeResident", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "removeTopic", values: [string]): string;
    encodeFunctionData(functionFragment: "setConsuelor", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "upgrade", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "vote", values: [string, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "addResident", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addTopic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "closeVoting", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getImplementAddress", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "openVoting", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeResident", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeTopic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setConsuelor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "upgrade", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "vote", data: BytesLike): Result;
}
export interface CondominiumAdapter extends BaseContract {
    connect(runner?: ContractRunner | null): CondominiumAdapter;
    waitForDeployment(): Promise<this>;
    interface: CondominiumAdapterInterface;
    queryFilter<TCEvent extends TypedContractEvent>(event: TCEvent, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    queryFilter<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, fromBlockOrBlockhash?: string | number | undefined, toBlock?: string | number | undefined): Promise<Array<TypedEventLog<TCEvent>>>;
    on<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    on<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(event: TCEvent, listener: TypedListener<TCEvent>): Promise<this>;
    once<TCEvent extends TypedContractEvent>(filter: TypedDeferredTopicFilter<TCEvent>, listener: TypedListener<TCEvent>): Promise<this>;
    listeners<TCEvent extends TypedContractEvent>(event: TCEvent): Promise<Array<TypedListener<TCEvent>>>;
    listeners(eventName?: string): Promise<Array<Listener>>;
    removeAllListeners<TCEvent extends TypedContractEvent>(event?: TCEvent): Promise<this>;
    addResident: TypedContractMethod<[
        resident: AddressLike,
        residenceId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    addTopic: TypedContractMethod<[
        title: string,
        description: string,
        arg2: BigNumberish
    ], [
        void
    ], "nonpayable">;
    closeVoting: TypedContractMethod<[title: string], [void], "nonpayable">;
    getImplementAddress: TypedContractMethod<[], [string], "view">;
    openVoting: TypedContractMethod<[title: string], [void], "nonpayable">;
    owner: TypedContractMethod<[], [string], "view">;
    removeResident: TypedContractMethod<[
        resident: AddressLike
    ], [
        void
    ], "nonpayable">;
    removeTopic: TypedContractMethod<[title: string], [void], "nonpayable">;
    setConsuelor: TypedContractMethod<[
        resident: AddressLike,
        isEntering: boolean
    ], [
        void
    ], "nonpayable">;
    upgrade: TypedContractMethod<[
        newImplementation: AddressLike
    ], [
        void
    ], "nonpayable">;
    vote: TypedContractMethod<[
        title: string,
        option: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "addResident"): TypedContractMethod<[
        resident: AddressLike,
        residenceId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "addTopic"): TypedContractMethod<[
        title: string,
        description: string,
        arg2: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "closeVoting"): TypedContractMethod<[title: string], [void], "nonpayable">;
    getFunction(nameOrSignature: "getImplementAddress"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "openVoting"): TypedContractMethod<[title: string], [void], "nonpayable">;
    getFunction(nameOrSignature: "owner"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "removeResident"): TypedContractMethod<[resident: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "removeTopic"): TypedContractMethod<[title: string], [void], "nonpayable">;
    getFunction(nameOrSignature: "setConsuelor"): TypedContractMethod<[
        resident: AddressLike,
        isEntering: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "upgrade"): TypedContractMethod<[
        newImplementation: AddressLike
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "vote"): TypedContractMethod<[
        title: string,
        option: BigNumberish
    ], [
        void
    ], "nonpayable">;
    filters: {};
}
