var config = {    
    onGameTitle: { label: 'Supply 10X (latest)', type: 'title' },
    bcMode:{ value: 0, type: 'radio',
        options: [  { value: 0, label: 'Regular martingale' },
                    { value: 1, label: 'Constantly martingale' }] },
    Amount: { label: "Amount", value: Math.floor( currency.amount / 2 ), type: "number" },   
    Bet: { label: "Bet", value: 0, type: "number" }, 
    Div: { label: "Bet Div ( 10 : 17,  18 : 51,  20 : 65,  25 : 130, 30 : 203,  40 : 600)", value: 100, type: "number" },
    limit: { label: "Combo limit( 10 : 17,  18 : 51,  20 : 65,  25 : 130, 30 : 203,  40 : 600)", value: 3, type: "number" },   
  }; 

function main() {
    const g_StartDate       = new Date();  
    let g_Wager             = 1.0;
    let g_Money             = config.Amount.value || currency.amount;
    let g_Bet               = config.Bet.value || currency.minAmount;
    let g_baseBet           = config.Bet.value || currency.minAmount;
    let g_Payout            = 10.0;
    let g_History           = [];

    let WS                  = { events: 0, combos: 0, sSum: 0, rSum: 0, tg: 0, rg: 0};
    let CV                  = { divBet: config.Div.value, limit: config.limit.value, payout: 10.0, gainX: 9};
    
    Initialize();
    game.onBet = function() {
        game.bet(g_Bet, g_Payout).then(function(payout) {  
            countgame(payout);  
            g_Wager >= CV.payout ? playWin() : playLoss(); 
            printResult(payout);     
            stopGame();      
            updateBetPayout(payout);      
        }).catch(function(error) {        
            log.info( error.message );
            WriteTime(g_StartDate);
        });
    };

    function Initialize(){       
        log.info( "New game start.");
        log.success(new Date().toLocaleString());
        log.info('.  ');
        g_baseBet = config.Bet.value || f2s( g_Money / CV.divBet );
        updateBetPayout(1);
    }

    function countgame(payout) {
        WS.events++;        
        g_Wager = game.history[0].odds;
        g_Wager >= CV.payout ? WS.combos = 0 : WS.combos++; 
        g_History.unshift(g_Wager);
        if ( g_History.length > 300 ){ g_History.pop()};
        if ( g_Wager >= CV.payout){
            WS.rSum = 0;
            log.info('.  ');
            log.info( "Found the 10X. new bet start.");            
        }
    }

    function playWin(){   
        WS.tg += g_Bet * ( g_Payout - 1 );        
    }

    function playLoss(){      
        WS.tg -= g_Bet;
    } 

    function stopGame(){
        if ( config.Amount.value != 0 ){
            if ( WS.tg >= g_Money ) {
                logGameResult('Win! Game is over.');
                game.stop();
            }
            if (g_Money + WS.tg <= 0) {
                logGameResult('Loss! Game is over.');
                game.stop();
            }
        }       
    }

    function updateBetPayout(payout) { 
        g_Payout = CV.payout;               
        let w = 1;    
        WS.sSum = 0;  
        let e = config.bcMode.value == 1 ? WS.combos : WS.combos % CV.limit;
        if ( e == 0 && WS.combos != 0){ log.info('.  '); }       
        for (let i = 0; i < e + 1; i++) {                   
            w = (WS.sSum  + 9 ) / 9;
            WS.sSum += w;
            g_Bet = g_baseBet * w;
        } 
        WS.rSum += g_Bet;
    }
 
    function logGameResult(message) {
        log.info('.  ');
        log.info(`***** ${message} *****`);
        WriteTime( g_StartDate ); 
        log.info('.  ');
    }
    
    function printResult(payout) {        
        let msg = g_Wager >= CV.payout
            ?  `E= ${WS.events}, C= ${WS.combos}, B=${f2s(g_Bet)}, P= ${g_History[0]}X, sSum=${f2s(WS.sSum)},  rSum=${f2s(WS.rSum)}, Benefit= ${f2s(WS.tg)} ----- |||||`
            : `E= ${WS.events}, C= ${WS.combos}, B=${f2s(g_Bet)}, P= ${g_History[0]}X, sSum=${f2s(WS.sSum)},  rSum=${f2s(WS.rSum)}, Benefit= ${f2s(WS.tg)}`;
        log.info(msg);
    }
    
    function WriteTime(dt){ var curDate = new Date(); var diff = calculateTimeDifference( dt ); log.info( " Now " + curDate.toLocaleString() + " : Elapsed time " + diff );}    
    function f2s( param ) { return parseFloat(param).toFixed(2); }
    function calculateTimeDifference(dt) {
        const currentDate = new Date();
        const differenceInSeconds = (currentDate - dt) / 1000;        
        const hours = Math.floor(differenceInSeconds / 3600);
        const minutes = Math.floor((differenceInSeconds % 3600) / 60);    
        const formattedMinutes = minutes.toString().padStart(2, '0');    
        return `${hours}:${formattedMinutes}`;
    }
}


