import { ContractFactory, ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../common";
import type { Condominium, CondominiumInterface } from "../Condominium";
type CondominiumConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;
export declare class Condominium__factory extends ContractFactory {
    constructor(...args: CondominiumConstructorParams);
    getDeployTransaction(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<ContractDeployTransaction>;
    deploy(overrides?: NonPayableOverrides & {
        from?: string;
    }): Promise<Condominium & {
        deploymentTransaction(): ContractTransactionResponse;
    }>;
    connect(runner: ContractRunner | null): Condominium__factory;
    static readonly bytecode = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060005b60028161ffff161161011f5760005b60058161ffff161161010b576000600190505b60058161ffff16116100f7576001806000836064866100959190610162565b6103e8886100a39190610162565b6100ad919061019f565b6100b7919061019f565b61ffff1661ffff16815260200190815260200160002060006101000a81548160ff02191690831515021790555080806100ef906101d5565b915050610076565b508080610103906101d5565b915050610063565b508080610117906101d5565b915050610054565b506101ff565b600061ffff82169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061016d82610125565b915061017883610125565b925082820261018681610125565b915080821461019857610197610133565b5b5092915050565b60006101aa82610125565b91506101b583610125565b9250828201905061ffff8111156101cf576101ce610133565b5b92915050565b60006101e082610125565b915061ffff82036101f4576101f3610133565b5b600182019050919050565b61300f8061020e6000396000f3fe608060405234801561001057600080fd5b50600436106101215760003560e01c80637b57ee49116100ad578063b158354611610071578063b158354614610358578063b7f59c9914610374578063bc2f89f314610390578063c1e6adfd146103c0578063e4d65d54146103dc57610121565b80637b57ee49146102b85780638fc5dad8146102d457806390ca27f3146102f0578063967d59e41461030c5780639e1bf9851461033c57610121565b8063481c6a75116100f4578063481c6a75146101ee5780634de532651461020c578063597de9871461023c57806368aca3351461025857806378b5749d1461028857610121565b80630847a4fb146101265780630f2fbeec146101595780632f9f21fe1461018e578063474502d8146101be575b600080fd5b610140600480360381019061013b9190611cdc565b61040c565b6040516101509493929190611e00565b60405180910390f35b610173600480360381019061016e9190611e45565b610494565b60405161018596959493929190611f4a565b60405180910390f35b6101a860048036038101906101a391906120ee565b6105ed565b6040516101b59190612137565b60405180910390f35b6101d860048036038101906101d391906120ee565b610619565b6040516101e5919061224a565b60405180910390f35b6101f66107d0565b604051610203919061226c565b60405180910390f35b610226600480360381019061022191906122b3565b6107f4565b60405161023391906122fb565b60405180910390f35b610256600480360381019061025191906122b3565b610814565b005b610272600480360381019061026d91906122b3565b610a24565b60405161027f91906122fb565b60405180910390f35b6102a2600480360381019061029d91906120ee565b610a81565b6040516102af91906122fb565b60405180910390f35b6102d260048036038101906102cd91906120ee565b610a99565b005b6102ee60048036038101906102e991906120ee565b610c54565b005b61030a6004803603810190610305919061233b565b611082565b005b610326600480360381019061032191906123c3565b6114a4565b60405161033391906122fb565b60405180910390f35b610356600480360381019061035191906120ee565b6114d6565b005b610372600480360381019061036d91906123f0565b61168e565b005b61038e6004803603810190610389919061245c565b611816565b005b6103aa60048036038101906103a591906123c3565b6119ac565b6040516103b791906122fb565b60405180910390f35b6103da60048036038101906103d5919061249c565b6119cc565b005b6103f660048036038101906103f191906122b3565b611b96565b6040516104039190612514565b60405180910390f35b6005602052816000526040600020818154811061042857600080fd5b9060005260206000209060020201600091509150508060000160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16908060000160149054906101000a900461ffff16908060000160169054906101000a900460ff16908060010154905084565b60046020528060005260406000206000915090508060000180546104b79061255e565b80601f01602080910402602001604051908101604052809291908181526020018280546104e39061255e565b80156105305780601f1061050557610100808354040283529160200191610530565b820191906000526020600020905b81548152906001019060200180831161051357829003601f168201915b5050505050908060010180546105459061255e565b80601f01602080910402602001604051908101604052809291908181526020018280546105719061255e565b80156105be5780601f10610593576101008083540402835291602001916105be565b820191906000526020600020905b8154815290600101906020018083116105a157829003601f168201915b5050505050908060020160009054906101000a900460ff16908060030154908060040154908060050154905086565b600080828051906020012090506005600082815260200190815260200160002080549050915050919050565b610621611bb7565b600082805190602001209050600460008281526020019081526020016000206040518060c001604052908160008201805461065b9061255e565b80601f01602080910402602001604051908101604052809291908181526020018280546106879061255e565b80156106d45780601f106106a9576101008083540402835291602001916106d4565b820191906000526020600020905b8154815290600101906020018083116106b757829003601f168201915b505050505081526020016001820180546106ed9061255e565b80601f01602080910402602001604051908101604052809291908181526020018280546107199061255e565b80156107665780601f1061073b57610100808354040283529160200191610766565b820191906000526020600020905b81548152906001019060200180831161074957829003601f168201915b505050505081526020016002820160009054906101000a900460ff16600381111561079457610793611d7a565b5b60038111156107a6576107a5611d7a565b5b81526020016003820154815260200160048201548152602001600582015481525050915050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60036020528060005260406000206000915054906101000a900460ff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff16146108a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161089990612601565b60405180910390fd5b600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161561092f576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109269061266d565b60405180910390fd5b600260008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81549061ffff0219169055600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615610a2157600360008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81549060ff02191690555b50565b600080600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900461ffff1661ffff16119050919050565b600080610a8d83610619565b60600151119050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff1614610b27576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b1e90612601565b60405180910390fd5b6000610b3282610619565b9050610b3d82610a81565b610b7c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b73906126d9565b60405180910390fd5b60006003811115610b9057610b8f611d7a565b5b81604001516003811115610ba757610ba6611d7a565b5b14610be7576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bde9061276b565b60405180910390fd5b600460008380519060200120815260200190815260200160002060008082016000610c129190611bff565b600182016000610c229190611bff565b6002820160006101000a81549060ff021916905560038201600090556004820160009055600582016000905550505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff1614610ce2576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cd990612601565b60405180910390fd5b6000610ced82610619565b90506000816060015111610d36576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d2d906127d7565b60405180910390fd5b60016003811115610d4a57610d49611d7a565b5b81604001516003811115610d6157610d60611d7a565b5b14610da1576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d9890612843565b60405180910390fd5b60008060008085805190602001209050600060056000838152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b82821015610ed357838290600052602060002090600202016040518060800160405290816000820160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020016000820160149054906101000a900461ffff1661ffff1661ffff1681526020016000820160169054906101000a900460ff166003811115610ea457610ea3611d7a565b5b6003811115610eb657610eb5611d7a565b5b815260200160018201548152505081526020019060010190610de6565b50505050905060005b81518160ff161015610fcb5760016003811115610efc57610efb611d7a565b5b828260ff1681518110610f1257610f11612863565b5b6020026020010151604001516003811115610f3057610f2f611d7a565b5b03610f48578580610f40906128ce565b965050610fb8565b60026003811115610f5c57610f5b611d7a565b5b828260ff1681518110610f7257610f71612863565b5b6020026020010151604001516003811115610f9057610f8f611d7a565b5b03610fa8578480610fa0906128ce565b955050610fb7565b8380610fb3906128ce565b9450505b5b8080610fc3906128ce565b915050610edc565b508360ff168560ff16111561101e5760026004600084815260200190815260200160002060020160006101000a81548160ff0219169083600381111561101457611013611d7a565b5b021790555061105e565b60036004600084815260200190815260200160002060020160006101000a81548160ff0219169083600381111561105857611057611d7a565b5b02179055505b42600460008481526020019081526020016000206005018190555050505050505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff1614806110e157506110e032610a24565b5b611120576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161111790612969565b60405180910390fd5b6000600381111561113457611133611d7a565b5b81600381111561114757611146611d7a565b5b03611187576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161117e906129d5565b60405180910390fd5b600061119283610619565b905060008160600151116111db576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016111d2906127d7565b60405180910390fd5b600160038111156111ef576111ee611d7a565b5b8160400151600381111561120657611205611d7a565b5b14611246576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161123d90612a41565b60405180910390fd5b6000600260003273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900461ffff169050600084805190602001209050600060056000838152602001908152602001600020905060005b81805490508160ff161015611366578361ffff16828260ff16815481106112e8576112e7612863565b5b906000526020600020906002020160000160149054906101000a900461ffff1661ffff1603611353576000611352576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161134990612ad3565b60405180910390fd5b5b808061135e906128ce565b9150506112be565b50600060405180608001604052803273ffffffffffffffffffffffffffffffffffffffff1681526020018561ffff1681526020018760038111156113ad576113ac611d7a565b5b81526020014281525090506005600084815260200190815260200160002081908060018154018082558091505060019003906000526020600020906002020160009091909190915060008201518160000160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060208201518160000160146101000a81548161ffff021916908361ffff16021790555060408201518160000160166101000a81548160ff0219169083600381111561148a57611489611d7a565b5b021790555060608201518160010155505050505050505050565b6000600160008361ffff1661ffff16815260200190815260200160002060009054906101000a900460ff169050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff1614611564576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161155b90612601565b60405180910390fd5b600061156f82610619565b905060008160600151116115b8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016115af906127d7565b60405180910390fd5b600060038111156115cc576115cb611d7a565b5b816040015160038111156115e3576115e2611d7a565b5b14611623576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161161a90612b65565b60405180910390fd5b60008280519060200120905060016004600083815260200190815260200160002060020160006101000a81548160ff0219169083600381111561166957611668611d7a565b5b0217905550426004600083815260200190815260200160002060040181905550505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff1614806117315750600360003273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff165b611770576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161176790612bf7565b60405180910390fd5b611779816114a4565b6117b8576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016117af90612c63565b60405180910390fd5b80600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548161ffff021916908361ffff1602179055505050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff16146118a4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161189b90612601565b60405180910390fd5b801561194f576118b382610a24565b6118f2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016118e990612ccf565b60405180910390fd5b6001600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506119a8565b6000600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055505b5050565b60016020528060005260406000206000915054906101000a900460ff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163273ffffffffffffffffffffffffffffffffffffffff161480611a2b5750611a2a32610a24565b5b611a6a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a6190612969565b60405180910390fd5b611a7382610a81565b15611ab3576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611aaa90612d3b565b60405180910390fd5b60006040518060c0016040528084815260200183815260200160006003811115611ae057611adf611d7a565b5b815260200142815260200160008152602001600081525090508060046000858051906020012081526020019081526020016000206000820151816000019081611b299190612f07565b506020820151816001019081611b3f9190612f07565b5060408201518160020160006101000a81548160ff02191690836003811115611b6b57611b6a611d7a565b5b0217905550606082015181600301556080820151816004015560a08201518160050155905050505050565b60026020528060005260406000206000915054906101000a900461ffff1681565b6040518060c00160405280606081526020016060815260200160006003811115611be457611be3611d7a565b5b81526020016000815260200160008152602001600081525090565b508054611c0b9061255e565b6000825580601f10611c1d5750611c3c565b601f016020900490600052602060002090810190611c3b9190611c3f565b5b50565b5b80821115611c58576000816000905550600101611c40565b5090565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b611c8381611c70565b8114611c8e57600080fd5b50565b600081359050611ca081611c7a565b92915050565b6000819050919050565b611cb981611ca6565b8114611cc457600080fd5b50565b600081359050611cd681611cb0565b92915050565b60008060408385031215611cf357611cf2611c66565b5b6000611d0185828601611c91565b9250506020611d1285828601611cc7565b9150509250929050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000611d4782611d1c565b9050919050565b611d5781611d3c565b82525050565b600061ffff82169050919050565b611d7481611d5d565b82525050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60048110611dba57611db9611d7a565b5b50565b6000819050611dcb82611da9565b919050565b6000611ddb82611dbd565b9050919050565b611deb81611dd0565b82525050565b611dfa81611ca6565b82525050565b6000608082019050611e156000830187611d4e565b611e226020830186611d6b565b611e2f6040830185611de2565b611e3c6060830184611df1565b95945050505050565b600060208284031215611e5b57611e5a611c66565b5b6000611e6984828501611c91565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b83811015611eac578082015181840152602081019050611e91565b60008484015250505050565b6000601f19601f8301169050919050565b6000611ed482611e72565b611ede8185611e7d565b9350611eee818560208601611e8e565b611ef781611eb8565b840191505092915050565b60048110611f1357611f12611d7a565b5b50565b6000819050611f2482611f02565b919050565b6000611f3482611f16565b9050919050565b611f4481611f29565b82525050565b600060c0820190508181036000830152611f648189611ec9565b90508181036020830152611f788188611ec9565b9050611f876040830187611f3b565b611f946060830186611df1565b611fa16080830185611df1565b611fae60a0830184611df1565b979650505050505050565b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b611ffb82611eb8565b810181811067ffffffffffffffff8211171561201a57612019611fc3565b5b80604052505050565b600061202d611c5c565b90506120398282611ff2565b919050565b600067ffffffffffffffff82111561205957612058611fc3565b5b61206282611eb8565b9050602081019050919050565b82818337600083830152505050565b600061209161208c8461203e565b612023565b9050828152602081018484840111156120ad576120ac611fbe565b5b6120b884828561206f565b509392505050565b600082601f8301126120d5576120d4611fb9565b5b81356120e584826020860161207e565b91505092915050565b60006020828403121561210457612103611c66565b5b600082013567ffffffffffffffff81111561212257612121611c6b565b5b61212e848285016120c0565b91505092915050565b600060208201905061214c6000830184611df1565b92915050565b600082825260208201905092915050565b600061216e82611e72565b6121788185612152565b9350612188818560208601611e8e565b61219181611eb8565b840191505092915050565b6121a581611f29565b82525050565b6121b481611ca6565b82525050565b600060c08301600083015184820360008601526121d78282612163565b915050602083015184820360208601526121f18282612163565b9150506040830151612206604086018261219c565b50606083015161221960608601826121ab565b50608083015161222c60808601826121ab565b5060a083015161223f60a08601826121ab565b508091505092915050565b6000602082019050818103600083015261226481846121ba565b905092915050565b60006020820190506122816000830184611d4e565b92915050565b61229081611d3c565b811461229b57600080fd5b50565b6000813590506122ad81612287565b92915050565b6000602082840312156122c9576122c8611c66565b5b60006122d78482850161229e565b91505092915050565b60008115159050919050565b6122f5816122e0565b82525050565b600060208201905061231060008301846122ec565b92915050565b6004811061232357600080fd5b50565b60008135905061233581612316565b92915050565b6000806040838503121561235257612351611c66565b5b600083013567ffffffffffffffff8111156123705761236f611c6b565b5b61237c858286016120c0565b925050602061238d85828601612326565b9150509250929050565b6123a081611d5d565b81146123ab57600080fd5b50565b6000813590506123bd81612397565b92915050565b6000602082840312156123d9576123d8611c66565b5b60006123e7848285016123ae565b91505092915050565b6000806040838503121561240757612406611c66565b5b60006124158582860161229e565b9250506020612426858286016123ae565b9150509250929050565b612439816122e0565b811461244457600080fd5b50565b60008135905061245681612430565b92915050565b6000806040838503121561247357612472611c66565b5b60006124818582860161229e565b925050602061249285828601612447565b9150509250929050565b600080604083850312156124b3576124b2611c66565b5b600083013567ffffffffffffffff8111156124d1576124d0611c6b565b5b6124dd858286016120c0565b925050602083013567ffffffffffffffff8111156124fe576124fd611c6b565b5b61250a858286016120c0565b9150509250929050565b60006020820190506125296000830184611d6b565b92915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061257657607f821691505b6020821081036125895761258861252f565b5b50919050565b7f4f6e6c79206d616e616765722063616e2063616c6c20746869732066756e637460008201527f696f6e0000000000000000000000000000000000000000000000000000000000602082015250565b60006125eb602383611e7d565b91506125f68261258f565b604082019050919050565b6000602082019050818103600083015261261a816125de565b9050919050565b7f54686520636f756e63696c2063616e6e6f742062652072656d6f766564000000600082015250565b6000612657601d83611e7d565b915061266282612621565b602082019050919050565b600060208201905081810360008301526126868161264a565b9050919050565b7f546f70696320646f6573206e6f74206578697374000000000000000000000000600082015250565b60006126c3601483611e7d565b91506126ce8261268d565b602082019050919050565b600060208201905081810360008301526126f2816126b6565b9050919050565b7f4f6e6c7920746f7069637320696e2049444c45207374617475732063616e206260008201527f652072656d6f7665640000000000000000000000000000000000000000000000602082015250565b6000612755602983611e7d565b9150612760826126f9565b604082019050919050565b6000602082019050818103600083015261278481612748565b9050919050565b7f54686520746f70696320646f6573206e6f742065786973740000000000000000600082015250565b60006127c1601883611e7d565b91506127cc8261278b565b602082019050919050565b600060208201905081810360008301526127f0816127b4565b9050919050565b7f4f6e6c7920564f54494e4720746f7069732063616e20626520636c6f73656400600082015250565b600061282d601f83611e7d565b9150612838826127f7565b602082019050919050565b6000602082019050818103600083015261285c81612820565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600060ff82169050919050565b60006128d9826128c1565b915060ff82036128ec576128eb612892565b5b600182019050919050565b7f4f6e6c7920746865206d616e61676572206f72207265736964656e747320636160008201527f6e2063616c6c20746869732066756e6374696f6e000000000000000000000000602082015250565b6000612953603483611e7d565b915061295e826128f7565b604082019050919050565b6000602082019050818103600083015261298281612946565b9050919050565b7f546865206f7074696f6e2063616e6e6f7420626520454d505459000000000000600082015250565b60006129bf601a83611e7d565b91506129ca82612989565b602082019050919050565b600060208201905081810360008301526129ee816129b2565b9050919050565b7f4f6e6c7920564f54494e4720746f706963732063616e20626520766f74656400600082015250565b6000612a2b601f83611e7d565b9150612a36826129f5565b602082019050919050565b60006020820190508181036000830152612a5a81612a1e565b9050919050565b7f41207265736964656e63652073686f756c6420766f7465206f6e6c79206f6e6360008201527f6500000000000000000000000000000000000000000000000000000000000000602082015250565b6000612abd602183611e7d565b9150612ac882612a61565b604082019050919050565b60006020820190508181036000830152612aec81612ab0565b9050919050565b7f4f6e6c792049444c4520746f7069732063616e206265206f70656e20666f722060008201527f766f74696e670000000000000000000000000000000000000000000000000000602082015250565b6000612b4f602683611e7d565b9150612b5a82612af3565b604082019050919050565b60006020820190508181036000830152612b7e81612b42565b9050919050565b7f4f6e6c7920746865206d616e61676572206f722074686520636f756e63696c2060008201527f63616e2063616c6c20746869732066756e6374696f6e00000000000000000000602082015250565b6000612be1603683611e7d565b9150612bec82612b85565b604082019050919050565b60006020820190508181036000830152612c1081612bd4565b9050919050565b7f5265736964656e636520646f6573206e6f742065786973740000000000000000600082015250565b6000612c4d601883611e7d565b9150612c5882612c17565b602082019050919050565b60006020820190508181036000830152612c7c81612c40565b9050919050565b7f54686520636f6e7375656c6f72206d7573742062652061207265736964656e74600082015250565b6000612cb9602083611e7d565b9150612cc482612c83565b602082019050919050565b60006020820190508181036000830152612ce881612cac565b9050919050565b7f546f70696320616c726561647920657869737473000000000000000000000000600082015250565b6000612d25601483611e7d565b9150612d3082612cef565b602082019050919050565b60006020820190508181036000830152612d5481612d18565b9050919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302612dbd7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82612d80565b612dc78683612d80565b95508019841693508086168417925050509392505050565b6000819050919050565b6000612e04612dff612dfa84611ca6565b612ddf565b611ca6565b9050919050565b6000819050919050565b612e1e83612de9565b612e32612e2a82612e0b565b848454612d8d565b825550505050565b600090565b612e47612e3a565b612e52818484612e15565b505050565b5b81811015612e7657612e6b600082612e3f565b600181019050612e58565b5050565b601f821115612ebb57612e8c81612d5b565b612e9584612d70565b81016020851015612ea4578190505b612eb8612eb085612d70565b830182612e57565b50505b505050565b600082821c905092915050565b6000612ede60001984600802612ec0565b1980831691505092915050565b6000612ef78383612ecd565b9150826002028217905092915050565b612f1082611e72565b67ffffffffffffffff811115612f2957612f28611fc3565b5b612f33825461255e565b612f3e828285612e7a565b600060209050601f831160018114612f715760008415612f5f578287015190505b612f698582612eeb565b865550612fd1565b601f198416612f7f86612d5b565b60005b82811015612fa757848901518255600182019150602085019450602081019050612f82565b86831015612fc45784890151612fc0601f891682612ecd565b8355505b6001600288020188555050505b50505050505056fea2646970667358221220c0ef3e240798d86f64bae5c9fe9d7493776b702ca4068d6caebc55005a90d29b64736f6c634300081c0033";
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
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "counselors";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "string";
            readonly name: "title";
            readonly type: "string";
        }];
        readonly name: "getTopic";
        readonly outputs: readonly [{
            readonly components: readonly [{
                readonly internalType: "string";
                readonly name: "title";
                readonly type: "string";
            }, {
                readonly internalType: "string";
                readonly name: "description";
                readonly type: "string";
            }, {
                readonly internalType: "enum CondominiumLib.Status";
                readonly name: "status";
                readonly type: "uint8";
            }, {
                readonly internalType: "uint256";
                readonly name: "createdDate";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "startDate";
                readonly type: "uint256";
            }, {
                readonly internalType: "uint256";
                readonly name: "endDate";
                readonly type: "uint256";
            }];
            readonly internalType: "struct CondominiumLib.Topic";
            readonly name: "";
            readonly type: "tuple";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "resident";
            readonly type: "address";
        }];
        readonly name: "isResident";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [];
        readonly name: "manager";
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
        readonly name: "numberOfVotes";
        readonly outputs: readonly [{
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
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
            readonly internalType: "uint16";
            readonly name: "residenceId";
            readonly type: "uint16";
        }];
        readonly name: "residenceExists";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly name: "residences";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "address";
            readonly name: "";
            readonly type: "address";
        }];
        readonly name: "residents";
        readonly outputs: readonly [{
            readonly internalType: "uint16";
            readonly name: "";
            readonly type: "uint16";
        }];
        readonly stateMutability: "view";
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
        }];
        readonly name: "topicExists";
        readonly outputs: readonly [{
            readonly internalType: "bool";
            readonly name: "";
            readonly type: "bool";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }];
        readonly name: "topics";
        readonly outputs: readonly [{
            readonly internalType: "string";
            readonly name: "title";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "description";
            readonly type: "string";
        }, {
            readonly internalType: "enum CondominiumLib.Status";
            readonly name: "status";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint256";
            readonly name: "createdDate";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "startDate";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "endDate";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
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
    }, {
        readonly inputs: readonly [{
            readonly internalType: "bytes32";
            readonly name: "";
            readonly type: "bytes32";
        }, {
            readonly internalType: "uint256";
            readonly name: "";
            readonly type: "uint256";
        }];
        readonly name: "votes";
        readonly outputs: readonly [{
            readonly internalType: "address";
            readonly name: "resident";
            readonly type: "address";
        }, {
            readonly internalType: "uint16";
            readonly name: "residence";
            readonly type: "uint16";
        }, {
            readonly internalType: "enum CondominiumLib.Options";
            readonly name: "option";
            readonly type: "uint8";
        }, {
            readonly internalType: "uint256";
            readonly name: "timestamp";
            readonly type: "uint256";
        }];
        readonly stateMutability: "view";
        readonly type: "function";
    }];
    static createInterface(): CondominiumInterface;
    static connect(address: string, runner?: ContractRunner | null): Condominium;
}
export {};
