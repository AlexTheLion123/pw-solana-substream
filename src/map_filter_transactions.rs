use crate::parser;
use crate::pb::sol::transactions::v1::{Instruction, Transaction, Transactions};
use anyhow::anyhow;
use serde::Deserialize;
use substreams_solana::pb::sf::solana::r#type::v1::{Block, ConfirmedTransaction};

#[derive(Deserialize, Debug)]
struct TransactionFilterParams {
    signature: Option<String>,
}

#[substreams::handlers::map]
fn map_filter_transactions(params: String, blk: Block) -> Result<Transactions, Vec<substreams::errors::Error>> {
    let filters = parse_filters_from_params(params)?;
    let time = match &blk.block_time {
        Some(unix_time_stamp) => unix_time_stamp.timestamp,
        _ => 0,
    };

    let mut transactions: Vec<Transaction> = Vec::new();

    blk.transactions
        .iter()
        .filter(|tx| apply_filter(tx, &filters))
        .for_each(|tx| {
            let tx_hash = match &tx.transaction {
                Some(transaction) => bs58::encode(transaction.signatures[0].clone()).into_string(),
                None => String::from("")
            };

            let msg = tx.transaction.as_ref().unwrap().message.as_ref().unwrap();
            let acct_keys = tx.resolved_accounts();

            let insts: Vec<Instruction> = msg
                .instructions
                .iter()
                .filter_map(|inst| {
                    let data = parser::parse_ix_data(&inst.data);

                    if data.is_some() {
                        let ix = Instruction {
                            program_id: bs58::encode(acct_keys[inst.program_id_index as usize].to_vec()).into_string(),
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

                    core::option::Option::None
                })
                .collect();

            let t = Transaction {
                signatures: tx
                    .transaction
                    .as_ref()
                    .unwrap()
                    .signatures
                    .iter()
                    .map(|sig| bs58::encode(sig).into_string())
                    .collect(),
                instructions: insts,
            };
            transactions.push(t);
        });

    Ok(Transactions { transactions })
}

fn parse_filters_from_params(params: String) -> Result<TransactionFilterParams, Vec<substreams::errors::Error>> {
    let parsed_result = serde_qs::from_str(&params);
    if parsed_result.is_err() {
        return Err(Vec::from([anyhow!("Unexpected error while parsing parameters")]));
    }

    let filters = parsed_result.unwrap();
    //todo: verify_filters(&filters)?;

    Ok(filters)
}

fn apply_filter(transaction: &&ConfirmedTransaction, filters: &TransactionFilterParams) -> bool {
    if filters.signature.is_none() {
        return true;
    }

    let mut found = false;

    transaction
        .transaction
        .as_ref()
        .unwrap()
        .signatures
        .iter()
        .for_each(|sig| {
            let xsig = bs58::encode(&sig).into_string();
            if xsig == filters.signature.clone().unwrap() {
                found = true;
            }
        });

    found
}
