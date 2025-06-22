var config = {    
    onGameTitle: { label: 'Supply 10X (latest) 1/29/2025 :: 7:21:PM', type: 'title' },
    bcMode:{ value: 0, type: 'radio',
        options: [  { value: 0, label: 'Regular martingale' },
                    { value: 1, label: 'Constantly martingale' },
                    { value: 2, label: 'Auto safe martingale' }] },
    Amount: { label: "Amount", value: ( currency.amount / 3 ).toFixed(2), type: "number" },   
    Bet: { label: "Bet", value: 0, type: "number" }, 
    Div: { label: "Bet Div ( 10 : 17,  18 : 51,  20 : 65,  25 : 130, 30 : 203,  40 : 600)", value: 100, type: "number" },
    limit: { label: "Combo limit", value: 7, type: "number" },   
    startNum: { label: "Start number ex: 10X.All Events 3.93", value: 0, type: "number" },        
  }; 

function main() {
    const g_StartDate       = new Date();  
    let g_Wager             = 1.0;
    let g_Money             = config.Amount.value || currency.amount;
    let g_Bet               = config.Bet.value || currency.minAmount;
    let g_baseBet           = config.Bet.value || currency.minAmount;
    let g_Payout            = 10.0;
    let g_History           = [];
    let WS                  = { events: 0, combos: 0, sSum: 0, rSum: 0, tg: 0, rg: 0, wake: 0, wEvents: 0, w10X: 0};
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

        if ( config.bcMode.value == 2 && config.startNum.value != 0){
            let number = config.startNum.value;
            let [w10X, wEvents] = number.toString().split(".");        
            WS.wake = 1;
            WS.w10X = parseInt(w10X, 10);
            WS.wEvents = parseInt(wEvents, 10);
        }

        updateBetPayout(1);
    }

    function countgame(payout) {
        WS.events++;        
        g_Wager = game.history[0].odds;
        g_Wager >= CV.payout ? WS.combos = 0 : WS.combos++; 
        
        g_History.unshift(g_Wager);
        if ( g_History.length > 600 ){ g_History.pop()};
        
        if ( g_Wager >= CV.payout){
            WS.rSum = 0;
            logAlarm(  "Found the 10X. new bet start." );          
        }

        let msg = "";
        let condition = 0;
        let count10X = 0, avgStep = 0;

        if ( config.bcMode.value == 2 ){
            if (WS.wake == 1){
                WS.wEvents++;
                if ( g_Wager >= CV.payout ) WS.w10X ++;
            }
            if( WS.wake == 0){
                for (let i = 0; i < (g_History.length < 180 ? g_History.length : 180) ; i++) {          
                        
                    if ( g_History[i] >= CV.payout ){ count10X ++; }
                    avgStep = i / (count10X == 0 ? 1 : count10X);

                    if ( count10X == 0 && avgStep >= 45 ){ condition = 1; }
                    if ( count10X == 1 && avgStep >= 60 ){ condition = 1; }
                    if ( count10X == 2 && avgStep >= 35 ){ condition = 1; }
                    if ( count10X == 3 && avgStep >= 25 ){ condition = 1; }
                    if ( count10X == 4 && avgStep >= 22 ){ condition = 1; }
                    if ( count10X == 5 && avgStep >= 20 ){ condition = 1; }
                    if ( count10X == 6 && avgStep >= 19 ){ condition = 1; }
                    if ( count10X == 7 && avgStep >= 18 ){ condition = 1; }
                    if ( count10X == 8 && avgStep >= 17 ){ condition = 1; }
                    if ( count10X == 9 && avgStep >= 16 ){ condition = 1; }
                    if ( count10X == 10 && avgStep >= 15 ){ condition = 1; }

                     if ( condition == 1 ){
                        WS.wEvents = i;
                        WS.w10X = count10X;
                        msg = `New roud start! Dist= ${i} 10X= ${count10X} avg= ${avgStep}`;
                        let len = i * 2 < g_History.length ? i * 2 : g_History.length;

                        for (let j = i; j < len; j++) { 
                            if ( g_History[i] >= CV.payout ){ count10X ++; }  
                        }

                        avgStep = len / (count10X == 0 ? 1 : count10X);

                        if ( avgStep > 10 ){
                            WS.wake = 1;
                            WS.rg = 0;
                            WS.combos = 0;
                            logAlarm( msg );
                            return;
                        }
                    }                
                } 
            }
        }        
    }

    function playWin(){   
        WS.tg += g_Bet * ( g_Payout - 1 );    
        if ( config.bcMode.value == 2 && WS.wake == 1)
            WS.rg += g_Bet * ( g_Payout - 1 );  
    }

    function playLoss(){      
        WS.tg -= g_Bet;
        if ( config.bcMode.value == 2 && WS.wake == 1)
            WS.rg -= g_Bet;
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
        
        if ( config.bcMode.value == 2 && WS.wake == 1){
            if ( WS.rg >= g_baseBet * 25) {
                logGameResult('This times is win! enjoy.');
                WS.wake = 0;
                WS.rg = 0;
                WS.wEvents = 0;
                WS.w10X = 0;
            }
            if ( (WS.wEvents / WS.w10X) < 10){
                logGameResult('This times is win! enjoy.');
                WS.wake = 0;
                WS.rg = 0;
                WS.wEvents = 0;
                WS.w10X = 0;
            }
        }
    }

    function updateBetPayout(payout) { 
        g_Payout = CV.payout;               
        let wagerMultiplier  = 1;    
        WS.sSum = 0;  

        const comboLimit  = config.bcMode.value == 1 ? WS.combos : WS.combos % CV.limit;

        if ( comboLimit === 0 && WS.combos != 0){ 
            log.info('.  '); 
        }

        for (let i = 0; i < comboLimit  + 1; i++) {                   
            wagerMultiplier  = (WS.sSum  + 9 ) / 9;
            WS.sSum += wagerMultiplier ;
            g_Bet = g_baseBet * wagerMultiplier ;
        } 

        if ( config.bcMode.value == 2 && WS.wake == 0 ){
            g_Bet = currency.minAmount;
            WS.sSum = 0;
        }

        WS.rSum += g_Bet;
    }
 
    function logGameResult(message) {
        log.info('.  ');
        log.info(`***** ${message} *****`);
        WriteTime( g_StartDate ); 
        log.info('.  ');
    }

    function logAlarm(message){
        log.info('.  ');
        log.info(`***** ${message} *****`);
    }
    
    function printResult(payout) {        
        let msg = "";
        if ( config.bcMode.value == 2){
            msg = `Auto E/C= ${WS.events}/ ${WS.combos}, G=${f2s(WS.tg)}`;
            msg = WS.wake == 0 ? `${msg}` : `${msg} , S=${f2s(WS.sSum)}/ ${f2s(WS.rSum)}, G= ${f2s(WS.tg)}/ ${f2s(WS.rg)} E/10X= ${WS.wEvents}/ ${WS.w10X}, A=${f2s(WS.wEvents/WS.w10X)}`;
            
        }else{
            msg = `E= ${WS.events}, C= ${WS.combos}, B=${f2s(g_Bet)}, P= ${g_History[0]}X, sSum=${f2s(WS.sSum)},  rSum=${f2s(WS.rSum)}, Benefit= ${f2s(WS.tg)}`;                       
        }         
         
        if ( g_Wager >= CV.payout ) msg = `${msg} ----- |||||`
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
