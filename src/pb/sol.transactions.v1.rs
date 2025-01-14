use borsh::BorshDeserialize;


#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Instructions {
    #[prost(message, repeated, tag="1")]
    pub instructions: ::prost::alloc::vec::Vec<Instruction>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Transactions {
    #[prost(message, repeated, tag="1")]
    pub transactions: ::prost::alloc::vec::Vec<Transaction>,
}
#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Transaction {
    #[prost(string, repeated, tag="1")]
    pub signatures: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(message, repeated, tag="2")]
    pub instructions: ::prost::alloc::vec::Vec<Instruction>,
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, BorshDeserialize, PartialEq, ::prost::Message)]
pub struct BetData {
    #[prost(uint64, tag="1")]
    pub amount: u64,
    #[prost(uint64, tag="2")]
    pub min_odds: u64,
    #[prost(uint32, tag="3")]
    pub free_bet_id: u32,
    #[prost(bool, tag="4")]
    pub is_live_bet: bool,
    #[prost(bool, tag="5")]
    pub is_sol_free: bool,
    #[prost(bytes="vec", tag="6")]
    pub selections: ::prost::alloc::vec::Vec<u8>,
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct BetCondition {
    #[prost(string, tag="1")]
    pub condition: ::prost::alloc::string::String,
    #[prost(uint32, tag="2")]
    pub outcome: u32,
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct BetDataInflated {
    #[prost(uint64, tag="1")]
    pub amount: u64,
    #[prost(uint64, tag="2")]
    pub min_odds: u64,
    #[prost(uint32, tag="3")]
    pub free_bet_id: u32,
    #[prost(bool, tag="4")]
    pub is_live_bet: bool,
    #[prost(bool, tag="5")]
    pub is_sol_free: bool,
    #[prost(message, repeated, tag="6")]
    pub selections: ::prost::alloc::vec::Vec<BetCondition>,
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Message)]
pub struct Instruction {
    #[prost(string, tag="1")]
    pub program_id: ::prost::alloc::string::String,
    #[prost(string, repeated, tag="2")]
    pub accounts: ::prost::alloc::vec::Vec<::prost::alloc::string::String>,
    #[prost(oneof="Actions", tags="3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15")]
    pub data: ::core::option::Option<Actions>
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, Copy, PartialEq, ::prost::Message)]
pub struct BetConfirmation {
    #[prost(enumeration="BetStatus", tag="1")]
    pub status: i32,
    #[prost(uint32, tag="2")]
    pub bet_id: u32,
}

#[allow(clippy::derive_partial_eq_without_eq)]
#[derive(Clone, PartialEq, ::prost::Oneof)]
pub enum Actions {
    #[prost(message, tag="3")]
    PlaceBet(BetDataInflated),
    #[prost(message, tag="4")]
    PlaceFreeBet(BetDataInflated),
    #[prost(bool, tag="5")]
    CancelBet(bool),
    #[prost(message, tag="6")]
    ConfirmBet(BetConfirmation),
    #[prost(uint64, tag="7")]
    ClaimBet(u64),
    #[prost(int64, tag="8")]
    SetCancellationDelay(i64),
    #[prost(enumeration="OperationalStatus", tag="9")]
    SetOperationalStatus(i32),
    #[prost(uint64, tag="10")]
    SetServiceFee(u64),
    #[prost(uint64, tag="11")]
    SetRelayerFee(u64),
    #[prost(uint64, tag="12")]
    WithdrawFromPool(u64),
    #[prost(uint64, tag="13")]
    WithdrawFromFeeAccount(u64),
    #[prost(bool, tag="14")]
    InitializeProgram(bool),
    #[prost(bool, tag="15")]
    ClearBetAccounts(bool),
}

#[derive(Clone, BorshDeserialize, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[borsh(use_discriminant=true)]
#[repr(i32)]
pub enum OperationalStatus {
    BettingActive = 0,
    BettingPaused = 1,
    ClaimingPaused = 2,
    Paused = 3,
}

#[derive(Clone, BorshDeserialize, Copy, Debug, PartialEq, Eq, Hash, PartialOrd, Ord, ::prost::Enumeration)]
#[borsh(use_discriminant=true)]
#[repr(i32)]
pub enum BetStatus {
    Pending = 0,
    Active = 1,
    Failed = 2,
    Claimed = 3,
    Lost = 4,
}
// @@protoc_insertion_point(module)
