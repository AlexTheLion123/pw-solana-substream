// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal,
} from "@graphprotocol/graph-ts";

export class MyEntity extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save MyEntity entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type MyEntity must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("MyEntity", id.toString(), this);
    }
  }

  static loadInBlock(id: string): MyEntity | null {
    return changetype<MyEntity | null>(store.get_in_block("MyEntity", id));
  }

  static load(id: string): MyEntity | null {
    return changetype<MyEntity | null>(store.get("MyEntity", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }
}

export class Bet extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Bet entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Bet must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Bet", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Bet | null {
    return changetype<Bet | null>(store.get_in_block("Bet", id));
  }

  static load(id: string): Bet | null {
    return changetype<Bet | null>(store.get("Bet", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get account(): string {
    let value = this.get("account");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }

  get bettor(): string {
    let value = this.get("bettor");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set bettor(value: string) {
    this.set("bettor", Value.fromString(value));
  }

  get minOdds(): BigDecimal {
    let value = this.get("minOdds");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set minOdds(value: BigDecimal) {
    this.set("minOdds", Value.fromBigDecimal(value));
  }

  get amount(): BigDecimal {
    let value = this.get("amount");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set amount(value: BigDecimal) {
    this.set("amount", Value.fromBigDecimal(value));
  }

  get status(): string {
    let value = this.get("status");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set status(value: string) {
    this.set("status", Value.fromString(value));
  }

  get isLive(): boolean {
    let value = this.get("isLive");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set isLive(value: boolean) {
    this.set("isLive", Value.fromBoolean(value));
  }

  get isSOLfree(): boolean {
    let value = this.get("isSOLfree");
    if (!value || value.kind == ValueKind.NULL) {
      return false;
    } else {
      return value.toBoolean();
    }
  }

  set isSOLfree(value: boolean) {
    this.set("isSOLfree", Value.fromBoolean(value));
  }

  get betId(): i32 {
    let value = this.get("betId");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set betId(value: i32) {
    this.set("betId", Value.fromI32(value));
  }

  get freeBetId(): i32 {
    let value = this.get("freeBetId");
    if (!value || value.kind == ValueKind.NULL) {
      return 0;
    } else {
      return value.toI32();
    }
  }

  set freeBetId(value: i32) {
    this.set("freeBetId", Value.fromI32(value));
  }

  get result(): string {
    let value = this.get("result");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set result(value: string) {
    this.set("result", Value.fromString(value));
  }

  get settledOdds(): BigDecimal {
    let value = this.get("settledOdds");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigDecimal();
    }
  }

  set settledOdds(value: BigDecimal) {
    this.set("settledOdds", Value.fromBigDecimal(value));
  }
}

export class Record extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Record entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Record must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Record", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Record | null {
    return changetype<Record | null>(store.get_in_block("Record", id));
  }

  static load(id: string): Record | null {
    return changetype<Record | null>(store.get("Record", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get timestamp(): BigInt {
    let value = this.get("timestamp");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set timestamp(value: BigInt) {
    this.set("timestamp", Value.fromBigInt(value));
  }

  get txHash(): string {
    let value = this.get("txHash");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set txHash(value: string) {
    this.set("txHash", Value.fromString(value));
  }
}

export class Selection extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Selection entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Selection must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`,
      );
      store.set("Selection", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Selection | null {
    return changetype<Selection | null>(store.get_in_block("Selection", id));
  }

  static load(id: string): Selection | null {
    return changetype<Selection | null>(store.get("Selection", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get conditionId(): string {
    let value = this.get("conditionId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set conditionId(value: string) {
    this.set("conditionId", Value.fromString(value));
  }

  get outcomeId(): string {
    let value = this.get("outcomeId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set outcomeId(value: string) {
    this.set("outcomeId", Value.fromString(value));
  }
}
