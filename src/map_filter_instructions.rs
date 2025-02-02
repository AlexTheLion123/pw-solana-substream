use crate::parser;
use crate::pb::sol::transactions::v1::{Instruction, Instructions};
use anyhow::anyhow;
use serde::Deserialize;
use substreams_solana::pb::sf::solana::r#type::v1::{Block, CompiledInstruction};

#[derive(Deserialize, Debug)]
struct InstructionFilterParams {
    program_id: Option<String>,
}

#[substreams::handlers::map]
fn map_filter_instructions(params: String, blk: Block) -> Result<Instructions, substreams::errors::Error> {
    let filters = parse_filters_from_params(params)?;
    let time = match &blk.block_time {
        Some(unix_time_stamp) => unix_time_stamp.timestamp,
        _ => 0,
    };

    substreams::log::info!("Applying filters to block: {:?}", filters);

    let instructions: Vec<Instruction> = blk
        .transactions()
        .flat_map(|tx| {
            let tx_hash = match &tx.transaction {
                Some(transaction) => bs58::encode(transaction.signatures[0].clone()).into_string(),
                None => String::from("")
            };

            let msg = tx.transaction.as_ref().unwrap().message.as_ref().unwrap();
            let acct_keys = tx.resolved_accounts();

            msg.instructions
                .iter()
                .filter_map(|inst| {
                    if apply_filter(inst, &filters, &acct_keys) {
                        let data = parser::parse_ix_data(&inst.data);

                        if data.is_some() {
                            let ix = Instruction {
                                program_id: bs58::encode(acct_keys[inst.program_id_index as usize].to_vec())
                                    .into_string(),
                                accounts: inst
                                    .accounts
                                    .iter()
                                    .map(|acct| bs58::encode(acct_keys[*acct as usize].to_vec()).into_string())
                                    .collect(),
                                time,
                                tx_hash: tx_hash.clone(),
                                data,
                            };

                            return core::option::Option::Some(ix);
                        }
                    }

                    core::option::Option::None
                })
                .collect::<Vec<_>>()
        })
        .collect();

    Ok(Instructions { instructions })
}

fn parse_filters_from_params(params: String) -> Result<InstructionFilterParams, substreams::errors::Error> {
    match serde_qs::from_str(&params) {
        Ok(filters) => Ok(filters),
        Err(e) => Err(anyhow!("Failed to parse filters from params: {}", e)),
    }
}

fn apply_filter(
    instruction: &CompiledInstruction,
    filters: &InstructionFilterParams,
    account_keys: &Vec<&Vec<u8>>,
) -> bool {
    if filters.program_id.is_none() {
        return true;
    }
    let program_id_filter = filters.program_id.as_ref().unwrap();

    let program_account_key = account_keys.get(instruction.program_id_index as usize);
    if program_account_key.is_none() {
        return false;
    }
    let program_account_key_val = bs58::encode(program_account_key.unwrap()).into_string();

    if &program_account_key_val != program_id_filter {
        return false;
    }

    true
}
