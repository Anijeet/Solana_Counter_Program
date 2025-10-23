use borsh::{BorshSerialize, BorshDeserialize};
use solana_program::{
    account_info:: {AccountInfo, next_account_info},
    entrypoint::ProgramResult,entrypoint,
    msg,
    pubkey::Pubkey,
};

#[derive(BorshSerialize, BorshDeserialize)]

struct Counter{
    count: u32,
}

#[derive(BorshSerialize, BorshDeserialize)]
enum Instructiontype{
    Increment(u32),
    Decrement(u32),
}

entrypoint!(counter_program); 

pub fn counter_program(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8]
) -> ProgramResult  {
    
    let acc =next_account_info(&mut accounts.iter())?;

    let instruction_type = Instructiontype::try_from_slice(instruction_data)?;

    let mut counter_data = Counter::try_from_slice(&acc.data.borrow())?;  //here the data of account type use R and Rcell which protect data from mutiple access like mutex so we need to borrow it first
    match instruction_type{
        Instructiontype::Increment(value)=>{
            msg!("Incrementing counter by {}", value);
            counter_data.count += value;
        },
        Instructiontype::Decrement(value)=>{
            msg!("Decrementing counter by {}", value);
            counter_data.count -= value;
        }
    }

    counter_data.serialize(&mut *acc.data.borrow_mut())?; //here we need to borrow mutably to write the updated data back to the account

    msg!("Counter updated to {}", counter_data.count);

    Ok(())

}