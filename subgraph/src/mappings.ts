import { Protobuf } from "as-proto/assembly";
import { Reader } from "as-proto/assembly";
import { Instructions } from "./pb/sol/transactions/v1/Instructions";
import { Bet } from "../generated/schema";
import { BigInt, log, crypto, Bytes} from "@graphprotocol/graph-ts";

export function handleTriggers(bytes: Uint8Array): void {
  const input = Protobuf.decode<Instructions>(bytes, Instructions.decode);
  /*assumed ix is changed to 
  ix = {
    accounts[],
    [instructionType]: {data},
    programId,
    timestamp,
    txHash
  }
  */
  input.instructions.forEach(ix => {
    let accountAddr: String, entity: Bet
    switch (true){

      case ("placeBet" in ix || "placeFreeBet" in ix):
        let functionName: string
        let accountAddrIndex: number
        if("placeBet" in ix){
          functionName = "placeBet"
          accountAddrIndex = 2
        }else{
          functionName = "placeFreeBet"
          accountAddrIndex = 3
        }
        accountAddr = ix.accounts[accountAddrIndex] //is 2 in placeBet and 3 in placeFreeBet
        entity = new Bet(accountAddr)
        entity.account = accountAddr
        entity.bettor = ix.accounts[0]
        entity.placedAt = ix.timestamp //in unix seconds, might need to convert from ms to s. 
        entity.minOdds = ix[functionName].minOdds
        entity.settledOdds = null
        entity.amount = ix[functionName].minOdds
        entity.status = "PENDING"
        entity.isLive = ix[functionName].isLiveBet
        entity.isSOLfree = ix[functionName].isSolFree
        entity.selections = ix[functionName].selections
        entity.betId = 0
        entity.freeBetId = ix[functionName].freeBetId //this might be 0 in non-free bet or it might error so set as null
        entity.result = "PENDING"
        entity.placed = {timestamp: ix.timestamp, txHash: ix.txHash}
        entity.confirmed = null
        entity.claimed = null
        entity.save()
        //break; //for some reason typescript doesnt like me adding breaks
        
      case("cancelBet" in ix):
        accountAddr = ix.accounts[2]
        entity = new Bet(accountAddr)
        entity.status = "CANCELED"
        entity.claimed = {timestamp: ix.timestamp, txHash: ix.txHash}
        entity.save()

      case("confirmBet" in ix):
        accountAddr = ix.accounts[1]
        entity = new Bet(accountAddr)
        entity.status = ix.confirmBet.status
        entity.betId = ix.confirmBet.betId
        entity.confirmed = {timestamp: ix.timestamp, txHash: ix.txHash}
        entity.save()

      case("claimBet" in ix):
        accountAddr = ix.accounts[7]
        entity = Bet.load(accountAddr)
        const payout = ix.claimBet
        if(payout > 0){
          entity.settledOdds = payout / entity.amount
          entity.result = (payout == entity.amount) ? "REFUND" : "WON"
        }else{
          entity.result = "LOST"
        }
        entity.status = "CLAIMED"
        entity.claimed = {timestamp: ix.timestamp, txHash: ix.txHash}
        entity.save()
      }
  })

}

