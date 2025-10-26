import * as borsh from 'borsh';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { expect, test} from 'bun:test';
import { GEETING_SIZE, schema } from './types';

let adminAccount = Keypair.generate();
let dataAccount = Keypair.generate();

const PROGRAM_ID = new PublicKey('Fbyt9sZ2yri163XWArEiB8yhNGSGWCYmthsm3M4Wzqm7');
    const connection = new Connection("http://127.0.0.1:8899")

test("Account is initialized to ", async ()=>{
    const txn = await connection.requestAirdrop(adminAccount.publicKey, 10* LAMPORTS_PER_SOL);
    await connection.confirmTransaction(txn);
    const lamports = await connection.getMinimumBalanceForRentExemption(GEETING_SIZE);

    const ix = SystemProgram.createAccount({
        fromPubkey: adminAccount.publicKey,
        newAccountPubkey: dataAccount.publicKey,
        lamports,
        space: GEETING_SIZE,
        programId: PROGRAM_ID
    })

    const createAccountTxn = new Transaction();
    createAccountTxn.add(ix);
    
    const singature = await connection.sendTransaction(createAccountTxn, [adminAccount, dataAccount]); // here admin and dataaccout are singature 
    await connection.confirmTransaction(singature);

    console.log(dataAccount.publicKey.toBase58());

    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    console.log(dataAccountInfo?.data);
    const counter = borsh.deserialize(schema,dataAccountInfo?.data);
    console.log(counter.count);
    expect(counter.count).toBe(0);

})