import { Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { expect, test} from 'bun:test';

let adminAccount = Keypair.generate();
let userAccount = Keypair.generate();

test("Airdrop SOL to admin account", async ()=>{
    const connection = new Connection("http://127.0.0.1:8899")
    const txn = await connection.requestAirdrop(adminAccount.publicKey, 10* LAMPORTS_PER_SOL);
    await connection.confirmTransaction(txn);
    const balance = await connection.getBalance(adminAccount.publicKey);
    console.log("Admin account balance:", balance / LAMPORTS_PER_SOL);
    const data = await connection.getAccountInfo(adminAccount.publicKey);

    console.log(data);
})