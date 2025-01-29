import { Protobuf } from "as-proto/assembly";
import { Instructions } from "./pb/sol/transactions/v1/Instructions";
import { Bet, Selection, BetSelection } from "../generated/schema";
import { log } from "@graphprotocol/graph-ts";
import { BigInt } from "@graphprotocol/graph-ts"

export function handleTriggers(bytes: Uint8Array): void {
  const input = Protobuf.decode<Instructions>(bytes, Instructions.decode);

  input.instructions.forEach(ix => {
    let accountAddr: string
    let bet: Bet | null

    if (ix.placeBet !== null) {
      accountAddr = ix.accounts[2];
      // log.debug("Placing bet with account {}", [ix.accounts[2]]);
      bet = new Bet(accountAddr)
      bet.account = accountAddr
      bet.bettor = ix.accounts[0]
      bet.minOdds = BigInt.fromU64(ix.placeBet!.minOdds)
      bet.settledOdds = new BigInt(0)
      bet.amount = BigInt.fromU64(ix.placeBet!.amount)
      bet.status = "PENDING"
      bet.isLive = !!ix.placeBet!.isLiveBet
      bet.isSOLfree = !!ix.placeBet!.isSolFree

      bet.betId = 0
      bet.freeBetId = ix.placeBet!.freeBetId || 0
      bet.result = "PENDING"
      
      bet.placedTime = BigInt.fromI64(ix.time)
      bet.placedTxHash = ix.txHash
      bet.confirmedTime = new BigInt(0)
      bet.confirmedTxHash = ""
      bet.claimedTime = new BigInt(0)
      bet.claimedTxHash = ""
      bet.canceledTime = new BigInt(0)
      bet.canceledTxHash = ""
      bet.save()

      for (let i = 0; i < ix.placeBet!.selections.length; i++) {
        const _selection = ix.placeBet!.selections[i]
        const selection = new Selection(_selection.condition + _selection.outcome.toString())
        selection.conditionId = _selection.condition
        selection.outcomeId = _selection.outcome.toString()
        selection.save()
      
        const betSelection = new BetSelection(accountAddr + _selection.condition + _selection.outcome.toString())
        betSelection.bet = accountAddr
        betSelection.selection = selection.id
        betSelection.save()
      }

    }
    else if (ix.placeFreeBet !== null) {
      accountAddr = ix.accounts[3]
      bet = new Bet(accountAddr)

      bet.account = accountAddr
      bet.bettor = ix.accounts[0]

      bet.minOdds = BigInt.fromU64(ix.placeFreeBet!.minOdds)
      bet.settledOdds = new BigInt(0)
      bet.amount = BigInt.fromU64(ix.placeFreeBet!.amount)
      bet.status = "PENDING"
      bet.isLive = !!ix.placeFreeBet!.isLiveBet
      bet.isSOLfree = !!ix.placeFreeBet!.isSolFree

      bet.betId = 0
      bet.freeBetId = ix.placeFreeBet!.freeBetId || 0
      bet.result = "PENDING"

      bet.placedTime = BigInt.fromI64(ix.time)
      bet.placedTxHash = ix.txHash
      bet.confirmedTime = new BigInt(0)
      bet.confirmedTxHash = ""
      bet.claimedTime = new BigInt(0)
      bet.claimedTxHash = ""
      bet.canceledTime = new BigInt(0)
      bet.canceledTxHash = ""
      bet.save()

      for (let i = 0; i < ix.placeFreeBet!.selections.length; i++) {
        const _selection = ix.placeFreeBet!.selections[i]
        const selection = new Selection(_selection.condition + _selection.outcome.toString())
        selection.conditionId = _selection.condition
        selection.outcomeId = _selection.outcome.toString()
        selection.save()
      
        const betSelection = new BetSelection(accountAddr)
        betSelection.bet = accountAddr
        betSelection.selection = selection.id
        betSelection.save()
      }
    }
    else if (ix.cancelBet === true) {
      accountAddr = ix.accounts[2]
      bet = Bet.load(accountAddr)

      if (!bet) {
        log.error("Bet not found for cancelBet", [])
        return
      }

      bet.status = "CANCELED"
      bet.canceledTime = BigInt.fromI64(ix.time)
      bet.canceledTxHash = ix.txHash
      bet.save()

    }
    else if (ix.confirmBet !== null) {
      accountAddr = ix.accounts[1]
      bet = Bet.load(accountAddr)

      if (!bet) {
        log.error("Bet not found for confirmBet with accountAddr: {}", [accountAddr])
        return
      }

      bet.status = getStatusString(ix.confirmBet!.status)
      bet.betId = ix.confirmBet!.betId
      bet.confirmedTime = BigInt.fromI64(ix.time)
      bet.confirmedTxHash = ix.txHash
      bet.save()

    }
    else if (ix.claimBet !== 0) {
      accountAddr = ix.accounts[7]
      bet = Bet.load(accountAddr)

      if (!bet) {
        log.error("Bet not found for claimBet", [])
        return
      }

      const payout = ix.claimBet
      if (payout > 0) {
        bet.settledOdds = BigInt.fromU64(payout).div(bet.amount)
        bet.result = (BigInt.fromU64(payout) == bet.amount) ? "REFUND" : "WON"
      } else {
        bet.result = "LOST"
      }
      bet.status = "CLAIMED"
      bet.claimedTime = BigInt.fromI64(ix.time)
      bet.claimedTxHash = ix.txHash
      bet.save()

    }
  })

}

function getStatusString(value: i32): string {
  switch (value) {
    case 0:
      return "PENDING"
    case 1:
      return "ACTIVE"
    case 2:
      return "FAILED"
    case 3:
      return "CLAIMED"
    case 4:
      return "LOST"
    case 5:
      return "CANCELLED"
    default:
      throw new Error("Unknown status value: " + value.toString())
  }
}