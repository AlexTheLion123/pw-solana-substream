use borsh::BorshDeserialize;
use crate::pb::sol::transactions::v1::{
    BetData,
    BetStatus,
    BetConfirmation,
    OperationalStatus,
    Actions as IxActions
};

// #[derive(BorshDeserialize, Debug)]
// enum OperationalStatus {
//     Active,
//     BettingPaused,
//     ClaimingPaused,
//     Paused,
// }

// #[derive(BorshDeserialize, Debug)]
// struct BetData {
//     amount: u64,
//     min_odds: u64,
//     free_bet_id: u32,
//     is_live_bet: bool,
//     is_sol_free: bool,
//     selections: Vec<u8>,
// }

// #[derive(BorshDeserialize, Debug)]
// pub enum BetStatus {
//     Pending,
//     Active,
//     Failed,
//     Claimed,
//     Lost,
// }

#[derive(BorshDeserialize, Debug)]
enum Actions {
    PlaceBet(BetData),
    PlaceFreeBet(BetData),
    CancelBet,
    ConfirmBet { status: BetStatus, bet_id: u32 },
    ClaimBet(u64),

    SetCancellationDelay(i64),
    SetOperationalStatus(OperationalStatus),
    SetServiceFee(u64),
    SetRelayerFee(u64),

    WithdrawFromPool(u64),
    WithdrawFromFeeAccount(u64),

    InitializeProgram,
    ClearBetAccounts,
}

pub fn parse_ix_data(mut buf: &[u8]) -> core::option::Option<IxActions> {
    let res = Actions::deserialize(&mut buf);

    let ix_actions = match res.unwrap() {
        Actions::PlaceBet(bet_data) => IxActions::PlaceBet(bet_data),
        Actions::PlaceFreeBet(bet_data) => IxActions::PlaceFreeBet(bet_data),
        Actions::CancelBet => IxActions::CancelBet(true),
        Actions::ConfirmBet {status, bet_id} => {
            let bc = BetConfirmation { status: status as i32, bet_id };
            IxActions::ConfirmBet(bc)
        }
        Actions::ClaimBet(amount) => IxActions::ClaimBet(amount),

        Actions::SetCancellationDelay(time) => IxActions::SetCancellationDelay(time),
        Actions::SetOperationalStatus(os) => IxActions::SetOperationalStatus(os as i32),
        Actions::SetServiceFee(amount) => IxActions::SetServiceFee(amount),
        Actions::SetRelayerFee(amount) => IxActions::SetRelayerFee(amount),

        Actions::WithdrawFromPool(amount) => IxActions::WithdrawFromPool(amount),
        Actions::WithdrawFromFeeAccount(amount) => IxActions::WithdrawFromFeeAccount(amount),

        Actions::InitializeProgram => IxActions::InitializeProgram(true),
        Actions::ClearBetAccounts => IxActions::ClearBetAccounts(true)
    };

    core::option::Option::Some(ix_actions)
}
