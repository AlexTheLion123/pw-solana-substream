use borsh::BorshDeserialize;
use flate2::read::ZlibDecoder;
use std::io::Read;
use crate::pb::sol::transactions::v1::{
    BetData,
    BetCondition,
    BetDataInflated,
    BetStatus,
    BetConfirmation,
    OperationalStatus,
    Actions as IxActions
};


#[derive(BorshDeserialize, Debug)]
struct Condition {
    condition: [u8; 48],
    outcome: u16
}


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
    if let Ok(action) = Actions::deserialize(&mut buf) {
        let ix_actions = match action {
            Actions::PlaceBet(bet_data) => {
                if let Ok(data) = inflate_bet_data(bet_data) {
                    IxActions::PlaceBet(data)                    
                } else {
                    return core::option::Option::None;
                }
            },
            Actions::PlaceFreeBet(bet_data) => {
                if let Ok(data) = inflate_bet_data(bet_data) {
                    IxActions::PlaceFreeBet(data)
                } else {
                    return core::option::Option::None;
                }
            },
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
    } else {
        core::option::Option::None
    }
}

fn inflate_bet_data(bet_data: BetData) -> Result<BetDataInflated, ()> {
    let mut zlib_decoder = ZlibDecoder::new(&bet_data.selections[..]);
    let mut output_buf = Vec::new();

    if zlib_decoder.read_to_end(&mut output_buf).is_ok() {
        if let Ok(conditions) = Vec::deserialize(&mut &output_buf[..]) {
            let selections = conditions.iter().filter_map(|v: &Condition| {
                if let Ok(condition) = String::from_utf8(v.condition.to_vec()) {
                    Some(BetCondition { condition, outcome: v.outcome as u32 })
                } else {
                    None
                }                
            }).collect::<Vec<_>>();

            return Ok(BetDataInflated {
                amount: bet_data.amount,
                min_odds: bet_data.min_odds,
                free_bet_id: bet_data.free_bet_id,
                is_live_bet: bet_data.is_live_bet,
                is_sol_free: bet_data.is_sol_free,
                selections
            });
        }
    }

    Err(())
}
