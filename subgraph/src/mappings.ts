import { Protobuf } from "as-proto/assembly";
import { Reader } from "as-proto/assembly";
import { Instructions } from "./pb/sol/transactions/v1/Instructions";
import { MyEntity } from "../generated/schema";
import { BigInt, log, crypto, Bytes} from "@graphprotocol/graph-ts";

export function handleTriggers(bytes: Uint8Array): void {
  const input = Protobuf.decode<Instructions>(bytes, Instructions.decode);
  
  input.instructions[0].

  log.debug("Decoded input: {}", [input.instructions[0].claimBet.toString()]);


  // log.debug("Decoded input: {}", [[input].toString()]);

  // No ID field has been found in the proto input...
  // The input has been hashed to create a unique ID, replace it with the field you want to use as ID
  const inputHash = crypto.keccak256(Bytes.fromUint8Array(bytes)).toHexString();
  let entity = new MyEntity(inputHash);

  entity.save();
}

