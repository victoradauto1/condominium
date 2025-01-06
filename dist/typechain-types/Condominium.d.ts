import type { BaseContract, BigNumberish, BytesLike, FunctionFragment, Result, Interface, AddressLike, ContractRunner, ContractMethod, Listener } from "ethers";
import type { TypedContractEvent, TypedDeferredTopicFilter, TypedEventLog, TypedListener, TypedContractMethod } from "./common";
export declare namespace CondominiumLib {
    type TopicStruct = {
        title: string;
        description: string;
        status: BigNumberish;
        createdDate: BigNumberish;
        startDate: BigNumberish;
        endDate: BigNumberish;
    };
    type TopicStructOutput = [
        title: string,
        description: string,
        status: bigint,
        createdDate: bigint,
        startDate: bigint,
        endDate: bigint
    ] & {
        title: string;
        description: string;
        status: bigint;
        createdDate: bigint;
        startDate: bigint;
        endDate: bigint;
    };
}
export interface CondominiumInterface extends Interface {
    getFunction(nameOrSignature: "addResident" | "addTopic" | "closeVoting" | "counselors" | "getTopic" | "isResident" | "manager" | "numberOfVotes" | "openVoting" | "removeResident" | "removeTopic" | "residenceExists" | "residences" | "residents" | "setConsuelor" | "topicExists" | "topics" | "vote" | "votes"): FunctionFragment;
    encodeFunctionData(functionFragment: "addResident", values: [AddressLike, BigNumberish]): string;
    encodeFunctionData(functionFragment: "addTopic", values: [string, string]): string;
    encodeFunctionData(functionFragment: "closeVoting", values: [string]): string;
    encodeFunctionData(functionFragment: "counselors", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "getTopic", values: [string]): string;
    encodeFunctionData(functionFragment: "isResident", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "manager", values?: undefined): string;
    encodeFunctionData(functionFragment: "numberOfVotes", values: [string]): string;
    encodeFunctionData(functionFragment: "openVoting", values: [string]): string;
    encodeFunctionData(functionFragment: "removeResident", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "removeTopic", values: [string]): string;
    encodeFunctionData(functionFragment: "residenceExists", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "residences", values: [BigNumberish]): string;
    encodeFunctionData(functionFragment: "residents", values: [AddressLike]): string;
    encodeFunctionData(functionFragment: "setConsuelor", values: [AddressLike, boolean]): string;
    encodeFunctionData(functionFragment: "topicExists", values: [string]): string;
    encodeFunctionData(functionFragment: "topics", values: [BytesLike]): string;
    encodeFunctionData(functionFragment: "vote", values: [string, BigNumberish]): string;
    encodeFunctionData(functionFragment: "votes", values: [BytesLike, BigNumberish]): string;
    decodeFunctionResult(functionFragment: "addResident", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "addTopic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "closeVoting", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "counselors", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "getTopic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "isResident", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "manager", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "numberOfVotes", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "openVoting", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeResident", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "removeTopic", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "residenceExists", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "residences", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "residents", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "setConsuelor", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "topicExists", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "topics", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "vote", data: BytesLike): Result;
    decodeFunctionResult(functionFragment: "votes", data: BytesLike): Result;
}
export interface Condominium extends BaseContract {
    connect(runner?: ContractRunner | null): Condominium;
    waitForDeployment(): Promise<this>;
    interface: CondominiumInterface;
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
        description: string
    ], [
        void
    ], "nonpayable">;
    closeVoting: TypedContractMethod<[title: string], [void], "nonpayable">;
    counselors: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getTopic: TypedContractMethod<[
        title: string
    ], [
        CondominiumLib.TopicStructOutput
    ], "view">;
    isResident: TypedContractMethod<[resident: AddressLike], [boolean], "view">;
    manager: TypedContractMethod<[], [string], "view">;
    numberOfVotes: TypedContractMethod<[title: string], [bigint], "view">;
    openVoting: TypedContractMethod<[title: string], [void], "nonpayable">;
    removeResident: TypedContractMethod<[
        resident: AddressLike
    ], [
        void
    ], "nonpayable">;
    removeTopic: TypedContractMethod<[title: string], [void], "nonpayable">;
    residenceExists: TypedContractMethod<[
        residenceId: BigNumberish
    ], [
        boolean
    ], "view">;
    residences: TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;
    residents: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    setConsuelor: TypedContractMethod<[
        resident: AddressLike,
        isEntering: boolean
    ], [
        void
    ], "nonpayable">;
    topicExists: TypedContractMethod<[title: string], [boolean], "view">;
    topics: TypedContractMethod<[
        arg0: BytesLike
    ], [
        [
            string,
            string,
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            title: string;
            description: string;
            status: bigint;
            createdDate: bigint;
            startDate: bigint;
            endDate: bigint;
        }
    ], "view">;
    vote: TypedContractMethod<[
        title: string,
        option: BigNumberish
    ], [
        void
    ], "nonpayable">;
    votes: TypedContractMethod<[
        arg0: BytesLike,
        arg1: BigNumberish
    ], [
        [
            string,
            bigint,
            bigint,
            bigint
        ] & {
            resident: string;
            residence: bigint;
            option: bigint;
            timestamp: bigint;
        }
    ], "view">;
    getFunction<T extends ContractMethod = ContractMethod>(key: string | FunctionFragment): T;
    getFunction(nameOrSignature: "addResident"): TypedContractMethod<[
        resident: AddressLike,
        residenceId: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "addTopic"): TypedContractMethod<[
        title: string,
        description: string
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "closeVoting"): TypedContractMethod<[title: string], [void], "nonpayable">;
    getFunction(nameOrSignature: "counselors"): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "getTopic"): TypedContractMethod<[
        title: string
    ], [
        CondominiumLib.TopicStructOutput
    ], "view">;
    getFunction(nameOrSignature: "isResident"): TypedContractMethod<[resident: AddressLike], [boolean], "view">;
    getFunction(nameOrSignature: "manager"): TypedContractMethod<[], [string], "view">;
    getFunction(nameOrSignature: "numberOfVotes"): TypedContractMethod<[title: string], [bigint], "view">;
    getFunction(nameOrSignature: "openVoting"): TypedContractMethod<[title: string], [void], "nonpayable">;
    getFunction(nameOrSignature: "removeResident"): TypedContractMethod<[resident: AddressLike], [void], "nonpayable">;
    getFunction(nameOrSignature: "removeTopic"): TypedContractMethod<[title: string], [void], "nonpayable">;
    getFunction(nameOrSignature: "residenceExists"): TypedContractMethod<[residenceId: BigNumberish], [boolean], "view">;
    getFunction(nameOrSignature: "residences"): TypedContractMethod<[arg0: BigNumberish], [boolean], "view">;
    getFunction(nameOrSignature: "residents"): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
    getFunction(nameOrSignature: "setConsuelor"): TypedContractMethod<[
        resident: AddressLike,
        isEntering: boolean
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "topicExists"): TypedContractMethod<[title: string], [boolean], "view">;
    getFunction(nameOrSignature: "topics"): TypedContractMethod<[
        arg0: BytesLike
    ], [
        [
            string,
            string,
            bigint,
            bigint,
            bigint,
            bigint
        ] & {
            title: string;
            description: string;
            status: bigint;
            createdDate: bigint;
            startDate: bigint;
            endDate: bigint;
        }
    ], "view">;
    getFunction(nameOrSignature: "vote"): TypedContractMethod<[
        title: string,
        option: BigNumberish
    ], [
        void
    ], "nonpayable">;
    getFunction(nameOrSignature: "votes"): TypedContractMethod<[
        arg0: BytesLike,
        arg1: BigNumberish
    ], [
        [
            string,
            bigint,
            bigint,
            bigint
        ] & {
            resident: string;
            residence: bigint;
            option: bigint;
            timestamp: bigint;
        }
    ], "view">;
    filters: {};
}
