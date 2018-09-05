const Eos = require('eosjs');
const EosApi = require('eosjs-api');
const http = require('http');
const querystring = require('querystring');

let config = {
    expireInSeconds: 60,
    broadcast: true,
    debug: false,
    sign: true,
    // mainNet bp endpoint
    httpEndpoint: 'https://api1.eosdublin.io',
    keyProvider:'5JWpYF61M1A94fDguTuULqa5XcoHHNu8GdFBAbRQLH9ZMXMocE8',
    // mainNet chainId
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
};

var eos = Eos(config);
var eosapi = EosApi(config);

async function asyncTransfer(config) {
// Prepare headers
    expireInSeconds = 60 * 60 // 1 hour
    info = await eos.getInfo({})
    chainDate = new Date(info.head_block_time + 'Z')
    expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
    expiration = expiration.toISOString().split('.')[0]

    block = await eos.getBlock(info.last_irreversible_block_num)

    transactionHeaders = {
        expiration,
        ref_block_num: info.last_irreversible_block_num &0xffff,
        ref_block_prefix: block.ref_block_prefix
    }
// OFFLINE (bring `transactionHeaders`)'https://api1.eosdublin.io'
    eos = Eos({httpEndpoint: null, chainId:config.chainId,keyProvider:config.keyProvider, transactionHeaders})
    transfer = await eos.transfer('yyloveuu1314', 'williamoony5', '0.1000 EOS','',false)
    transferTransaction = transfer.transaction
    processedTransaction =await eos.pushTransaction(transferTransaction)
}




async function asyncNewAccount(config) {
// Prepare headers
    expireInSeconds = 60 * 60 // 1 hour
    info = await eos.getInfo({})
    chainDate = new Date(info.head_block_time + 'Z')
    expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
    expiration = expiration.toISOString().split('.')[0]

    block = await eos.getBlock(info.last_irreversible_block_num)

    transactionHeaders = {
        expiration,
        ref_block_num: info.last_irreversible_block_num &0xffff,
        ref_block_prefix: block.ref_block_prefix
    }
// OFFLINE (bring `transactionHeaders`)'https://api1.eosdublin.io'
    pubkey = 'EOS68hmKN91AnKr5WaRWNgCFDbLCVmcBi48y9tDVUMMJD9W4zQFL8'
    eos = Eos({httpEndpoint: null, chainId:config.chainId,keyProvider:config.keyProvider, transactionHeaders})
    //transfer = await eos.newaccount('yyloveuu1314', 'hongyuanyang', 'EOS68hmKN91AnKr5WaRWNgCFDbLCVmcBi48y9tDVUMMJD9W4zQFL8','EOS8YrihssLWj51u1MRNoJURDawkeBuEq4sQrgDhFskoEZYCLqYyi',false)
    newaccpunt =await eos.transaction(tr => {
        tr.newaccount({
            creator: 'yyloveuu1314',
            name: 'hongyuanyang',
            owner: pubkey,
            active: pubkey
        })

        tr.buyrambytes({
            payer: 'yyloveuu1314',
            receiver: 'hongyuanyang',
            bytes: 4096
        })

        tr.delegatebw({
            from: 'yyloveuu1314',
            receiver: 'hongyuanyang',
            stake_net_quantity: '0.0500 EOS',
            stake_cpu_quantity: '0.1500 EOS',
            transfer: 0
        })
    })
    newaccpuntTransaction = newaccpunt.transaction
    processedTransaction =await eos.pushTransaction(newaccpuntTransaction)
}


async function asyncgetActions(config) {
// Prepare headers
    expireInSeconds = 60 * 60 // 1 hour
    info = await eos.getInfo({})
    chainDate = new Date(info.head_block_time + 'Z')
    expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
    expiration = expiration.toISOString().split('.')[0]

    block = await eos.getBlock(info.last_irreversible_block_num)

    transactionHeaders = {
        expiration,
        ref_block_num: info.last_irreversible_block_num &0xffff,
        ref_block_prefix: block.ref_block_prefix
    }
// OFFLINE (bring `transactionHeaders`)'https://api1.eosdublin.io'
    eosapi = EosApi({httpEndpoint: config.httpEndpoint, chainId:config.chainId,keyProvider:config.keyProvider, transactionHeaders})
    transfer = await eosapi.getActions('yyloveuu1314', 0, 10)
    transferTransaction = transfer.transaction

    //processedTransaction =await eos.pushTransaction(transferTransaction)

}

async function asyncDelegatebw(config) {
// Prepare headers
    expireInSeconds = 60 * 60 // 1 hour
    info = await eos.getInfo({})
    chainDate = new Date(info.head_block_time + 'Z')
    expiration = new Date(chainDate.getTime() + expireInSeconds * 1000)
    expiration = expiration.toISOString().split('.')[0]

    block = await eos.getBlock(info.last_irreversible_block_num)

    transactionHeaders = {
        expiration,
        ref_block_num: info.last_irreversible_block_num &0xffff,
        ref_block_prefix: block.ref_block_prefix
    }
// OFFLINE (bring `transactionHeaders`)'https://api1.eosdublin.io'
    eos = Eos({httpEndpoint: null, chainId:config.chainId,keyProvider:config.keyProvider, transactionHeaders})
    transfer = await eos.delegatebw('yyloveuu1314','yyloveuu1314', '0.0000 EOS','0.5000 EOS', 0)
    transferTransaction = transfer.transaction
    var contents = JSON.stringify(transferTransaction);
    var options = {
        hostname: '127.0.0.1',
        port: 9082,
        path:'/eosmix/chain/transaction/push',
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Content-Length':contents.length
        }
    }

    var req = http.request(options, function(res){
        res.setEncoding('utf8');
        res.on('data',function(data){
            console.log("data:",data);   //一段html代码
        });
    });

    req.write(contents);
    req.end;
    //processedTransaction =await eos.pushTransaction(transferTransaction)
}

/*
asyncNewAccount(config).then(data => { console.log(data); //asyncFunction return 的内容在这里获取
    }).catch(error => { console.log(error); // asyncFunction 的错误统一在这里抓取
    });


asyncTransfer(config).then(data => { console.log(data); //asyncFunction return 的内容在这里获取
 }).catch(error => { console.log(error); // asyncFunction 的错误统一在这里抓取
 });

asyncgetActions(config).then(data => { console.log(data); //asyncFunction return 的内容在这里获取
}).catch(error => { console.log(error); // asyncFunction 的错误统一在这里抓取
});
*/
asyncDelegatebw(config).then(data => { console.log(data); //asyncFunction return 的内容在这里获取
}).catch(error => { console.log(error); // asyncFunction 的错误统一在这里抓取
});
