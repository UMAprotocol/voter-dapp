import { ethers,BigNumber } from "ethers";
import assert from 'assert'
// note these imports use relative directories because this file is used in the manual reveal script with ts-node
import createVotingContractInstance from "../web3/createVotingContractInstance";
import createDesignatedVotingContractInstance from "../web3/createDesignatedVotingContractInstance";
import { VOTER_CONTRACT_BLOCK } from "../config";
import { decryptMessage } from "../tempUmaFunctions";
import { PostRevealData } from "../web3/post/revealVotes";
import { queryCurrentRoundId } from "../web3/get/queryCurrentRoundId";

export async function queryEncryptedVotes(contract:ethers.Contract,address:string,roundId:string){
  const filter = contract.filters.EncryptedVote(
    address,
    Number(roundId),
    null,
    null,
    null,
    null
  );
  return contract.queryFilter(filter,VOTER_CONTRACT_BLOCK);
}

type EtherscanReveal = [string, string, string, string, string]
type EtherscanBatchReveal = EtherscanReveal[]
type BackupCommitsForRound = Record<string,string>
type BackupCommitsForAccount = Record<string,BackupCommitsForRound>
type BackupCommits = Record<string,BackupCommitsForAccount>

export async function encodeWithPrivateKey(signer:ethers.Signer,networkId:string, address:string, privateKey:string,roundId?:string):Promise<EtherscanBatchReveal>{
  const votingContract = createVotingContractInstance(signer,networkId)
  roundId = roundId || await queryCurrentRoundId(votingContract)
  assert(roundId,'missing roundId')
  const events = await queryEncryptedVotes(votingContract,address,roundId)
  assert(events.length,'No commited votes found for round id: ' + roundId)
  const revealData = await Promise.all(
    events.map(event=>decodeEncryptedVoteWithPK(event.args as ethers.utils.Result,privateKey))
  )
  return etherscanBatchReveal(revealData)
}


export async function encodeWithSaltBackup(signer:ethers.Signer,networkId:string, address:string, backupCommits:BackupCommits, roundId?:string):Promise<PostRevealData[]>{
  const votingContract = createVotingContractInstance(signer,networkId)
  roundId = roundId || await queryCurrentRoundId(votingContract)
  assert(roundId,'no round id found')
  const myBackupCommits = findValueByKey<string,BackupCommitsForAccount>(backupCommits,address) || findValueByKey<string,BackupCommitsForAccount>(backupCommits,address.toLowerCase())
  assert(myBackupCommits,'missing backup commits for address: ' + address)
  const roundBackupCommits = findValueByKey<string,BackupCommitsForRound>(myBackupCommits,roundId.toString())
  assert(roundBackupCommits,'missing round commits for current round: ' + roundId)
  const events = await queryEncryptedVotes(votingContract,address,roundId)
  assert(events.length,'No commited votes found for round id: ' + roundId)
  return Promise.all(
    events.map(event=>decodeEncryptedVoteWithBackup(event.args as ethers.utils.Result,roundBackupCommits))
  )
}

export function makeKey(args:Pick<PostRevealData,'identifier'|'time'|'ancillaryData'>):string{
  return [ethers.utils.toUtf8String(args.identifier).trim(),args.time.toString(), args.ancillaryData.toString()].join('~')
}
// dont understand why, but regular lookups, or lodash.get not working in objects pasted from localstorage
function findValueByKey<K extends string | number,V>(obj:Record<K,V>,find:K):V | undefined {
  const found = Object.entries(obj).find(([k,v])=>k===find)
  if(found) return found[1] as unknown as V
}
export async function decodeEncryptedVoteWithBackup(args:ethers.utils.Result,roundBackupCommits:BackupCommitsForRound):Promise<PostRevealData>{
  const key = makeKey(args as unknown as Pick<PostRevealData,'identifier'|'time'|'ancillaryData'>)
  const salt = findValueByKey<string,string>(roundBackupCommits,key)
  assert(salt,'Could not find salt for vote: ' + key)
  return {
    price:'',
    salt:salt.toString(),
    identifier:args.identifier,
    time:args.time.toString(),
    ancillaryData:args.ancillaryData,
  }
}
export async function decodeEncryptedVoteWithPK(args:ethers.utils.Result,privateKey:string):Promise<PostRevealData>{
  const {price,salt} = JSON.parse(await decryptMessage(privateKey, args.encryptedVote));
  return {
    price:price.toString(),
    salt:salt.toString(),
    identifier:args.identifier,
    time:args.time.toString(),
    ancillaryData:args.ancillaryData,
  }
}

export function etherscanBatchReveal(data:PostRevealData[]):EtherscanBatchReveal{
  return data.map(datum=>{
    return [datum.identifier,datum.time.toString(),datum.price,datum.ancillaryData,datum.salt]
  })
}
