import { Protobuf } from "as-proto/assembly";
import { Reader } from "as-proto/assembly";
import { Instructions } from "./pb/sol/transactions/v1/Instructions";
import { Bet, Selection } from "../generated/schema";
import { BigInt, log, crypto, Bytes } from "@graphprotocol/graph-ts";
import { BigDecimal } from "@graphprotocol/graph-ts"

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
  // first, extend the generated Instruction type with an index signature
  // type ExtendedInstruction = typeof input.instructions[0] & { [key: string]: any }

  input.instructions.forEach((ix) => {
    let accountAddr: string
    let entity: Bet | null

    if (ix.placeBet !== null) {
      accountAddr = ix.accounts[2];
      // log.debug("Placing bet with account {}", [ix.accounts[2]]);
      entity = new Bet(accountAddr)

      entity.account = accountAddr
      entity.bettor = ix.accounts[0]

      entity.minOdds = BigDecimal.fromString(ix.placeBet!.minOdds.toString())
      entity.settledOdds = BigDecimal.fromString("0")
      entity.amount = BigDecimal.fromString(ix.placeBet!.minOdds.toString())
      entity.status = "PENDING"
      entity.isLive = !!ix.placeBet!.isLiveBet
      entity.isSOLfree = !!ix.placeBet!.isSolFree

      entity.betId = 0
      entity.freeBetId = ix.placeBet!.freeBetId || 0
      entity.result = "PENDING"

      // entity.confirmed = ""
      // entity.claimed = ""
      entity.save()
    }
    else if (ix.placeFreeBet !== null) {
      accountAddr = ix.accounts[3]
      entity = new Bet(accountAddr)

      entity.account = accountAddr
      entity.bettor = ix.accounts[0]

      entity.minOdds = BigDecimal.fromString(ix.placeFreeBet!.minOdds.toString())
      entity.settledOdds = BigDecimal.fromString("0")
      entity.amount = BigDecimal.fromString(ix.placeFreeBet!.minOdds.toString())
      entity.status = "PENDING"
      entity.isLive = !!ix.placeFreeBet!.isLiveBet
      entity.isSOLfree = !!ix.placeFreeBet!.isSolFree

      entity.betId = 0
      entity.freeBetId = ix.placeFreeBet!.freeBetId || 0
      entity.result = "PENDING"

      // entity.confirmed = ""
      // entity.claimed = ""
      entity.save()
    }
    else if (ix.cancelBet === true) {
      accountAddr = ix.accounts[2]
      entity = new Bet(accountAddr)

      entity.status = "CANCELED"
      entity.save()
    }
    else if (ix.confirmBet !== null) {
      accountAddr = ix.accounts[1]
      entity = new Bet(accountAddr)
      entity.status = ix.confirmBet!.status.toString()
      entity.betId = ix.confirmBet!.betId
      entity.save()
    }
    else if (ix.claimBet !== 0) {
      accountAddr = ix.accounts[7]
      entity = Bet.load(accountAddr)

      if (!entity) {
        log.error("Bet not found for claimBet", [])
        return
      }

      const payout = ix.claimBet
      if (payout > 0) {
        entity.settledOdds = BigDecimal.fromString(payout.toString())
          .div(BigDecimal.fromString(entity.amount.toString()))
        entity.result = (BigDecimal.fromString(payout.toString()) == entity.amount) ? "REFUND" : "WON"
      } else {
        entity.result = "LOST"
      }
      entity.status = "CLAIMED"
      entity.save()
    }
  })

}

