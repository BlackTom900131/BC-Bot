var config = {    
    onGameTitle: { label: 'Game Mode ', type: 'title' },
        bcMode:{ value: 1, type: 'radio',
                options: [  { value: 1, label: 'Wake' },
                            { value: 0, label: 'Hibernate' }] },
    Amount: { label: "Amount", value: Math.floor( currency.amount / 2 ), type: "number" },   
    Bet: { label: "Bet", value: 0, type: "number" },
    Times: { label: "Times", value: 60, type: "number" },
    Speed:{ value: 0, type: 'radio',
        options: [  { value: 0, label: 'X30_P11 - 60' },
                    { value: 1, label: 'X30_P3 - 180' },
                    { value: 2, label: 'X30_P8 - 200' },
                    { value: 3, label: 'X30_P7 - 230' }] },
    onGameType: { label: 'Game Type ', type: 'title' },
    GameType:{ value: 1, type: 'radio',
        options: [  { value: 1, label: 'Crash' },
                    { value: 0, label: 'Hash Dice' }] },
  }; 

function main() {
    const g_StartDate       = new Date();  
    let g_Money             = config.Amount.value || currency.amount;
    let g_Bet               = config.Bet.value || currency.minAmount;
    let g_baseBet           = config.Bet.value || currency.minAmount;
    let g_Payout            = 2.0;
    let g_History           = []; 

    let WS = { state: config.bcMode.value, events: 0, wake: 0, combos: 0, tg: 0, rg: 0};
    let CV = { divBet: [60, 180, 200, 230], payout: 3.0, combo: 11, gainX: 0.2};
    const XB = Object.freeze({ X30_P11: 0, X30_P3: 1, X30_P8: 2, X30_P7: 3});

    const CXB = { // 1    2    3     4     5     6     7     8     9     10    11    12    13   14     15    16    17    18    19    20     21     22     23     24     25     26     27     28     29     30
        [XB.X30_P11]:{ //50
            payout: [1.5, 3,   3,    3,    3,    3,    3,    3,    3,    3,    3,    3,    3,    3,    5,    5,    5,    5,    5,    6,     6,     6,     6,     6,     6,     10,    10,    10,    10,    10    ],
            bet:    [1,   0.5, 0.75, 1.13, 1.69, 2.53, 3.80, 5.70, 8.54, 12.8, 8.54, 5.70, 3.80, 2.50, 1.7,  0.1,  0.1,  0.1,  0.1,  0.1,   0.1,   0.1,   0.1,   0.1,   0.1,   0.1,   0.1,   0.1,   0.1,   0.1   ],
        },                    
        [XB.X30_P3]:{//178
            payout: [1.5, 3,   3.3,  3.6,  3.9,  4.2,  4.5,  4.8,  5.1,  5.4,  5.7,  6,    6.3,  6.6,  6.9,  7.2,  7.5,  7.8,  8.1,  8.4,   8.7,   9,     9.3,   9.6,   9.9,   10.2,  10.5,  10.8,  11.1,  11.4  ],
            bet:    [1,   0.5, 0.65, 0.83, 1.03, 1.25, 1.50, 1.78, 2.08, 2.41, 2.77, 3.16, 3.58, 4.03, 4.51, 5.02, 5.56, 6.13, 6.73, 7.37,  8.04,  8.74,  9.48,  10.25, 11.06, 11.90, 12.77, 13.69, 14.63, 15.62 ],
        },
        [XB.X30_P8]:{ //196
            payout: [1.5, 3,   3,    3,    3,    3,    3,    4,    5,    5.64, 6.12, 6.60, 7.07, 7.55, 8.02, 8.5,  8.97, 9.45, 9.93, 10.40, 10.88, 11.36, 11.83, 12.31, 12.79, 13.26, 13.74, 14.21, 14.69, 15.17 ],
            bet:    [1,   0.5, 0.75, 1.13, 1.69, 2.53, 3.80, 3.80, 3.80, 4.10, 4.51, 4.93, 5.35, 5.78, 6.21, 6.65, 7.08, 7.52, 7.97, 8.41,  8.85,  9.30,  9.75,  10.20, 10.66, 11.11, 11.57, 12.03, 12.49, 12.95 ],
        },
        [XB.X30_P7]:{ //220.2
            payout: [1.5, 3,   3,    3,    3,    3,    3.5,  4,    4.5,  5,    5.5,  6,    6.5,  7,    7.5,  8,    8.5,  9,    9.5,  10,    10.5,  11,    11.5,  12,    12.5,  13,    13.5,  14,    14.5,  15    ],
            bet:    [1,   0.5, 0.75, 1.13, 1.69, 2.53, 3.04, 3.54, 4.05, 4.56, 5.06, 5.57, 6.08, 6.58, 7.09, 7.59, 8.1,  8.61, 9.11, 9.62,  10.13, 10.63, 11.14, 11.64, 12.15, 12.66, 13.16, 13.67, 14.18, 14.68 ],
        },
    };

    Initialize();
    game.onBet = function() {
        game.bet(g_Bet, g_Payout).then(function(payout) {  
            countgame(payout);  
            payout > 1 ? playWin() : playLoss(); 
            if ( WS.state == 1 ) { printResult(payout) } else{ log.info( "E= " + WS.events + ", X= " + g_History[0] )};        
            stopGame();
            controlGame( payout );   
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
        g_baseBet = config.Bet.value || f2s( g_Money / CV.divBet[config.Speed.value] );
        updateBetPayout(1);
    }

    function countgame(payout) {
        WS.events++;
        if ( WS.state == 1 ) WS.wake++;
        payout > 1 ? WS.combos = 0 : WS.combos++; 
        var crash = config.GameType.value ? game.history[0].odds : (payout > 1 ? g_Payout : 1.0);
        g_History.unshift(crash);
        if ( g_History.length > 300 ){ g_History.pop()};
    }

    function playWin(){   
        WS.tg += g_Bet * ( g_Payout - 1 );
        if ( WS.state == 1) WS.rg += g_Bet * ( g_Payout - 1 );
    }

    function playLoss(){      
        WS.tg -= g_Bet;
        if ( WS.state == 1) WS.rg -= g_Bet;
    }

    function stopGame(){
        if (g_Money + WS.tg <= 0) {
            logGameResult('Loss! Game is over.');
            game.stop();
            return;
        }        
        if ( config.Amount.value != 0 ){
            if (g_Money <= WS.tg ) {
                logGameResult('Win! Game is over.');
                game.stop();
                return;
            }            
        }              
    }

    function setState(state){
        WS.state = state;      
        WS.wake = 0;
        WS.rg = 0;
    }
    function controlGame(payout){       
        if ( WS.state == 0){
            if ( WS.combos != 0){ return;}
            for (let i = 1; i < g_History.length; i++) {
                if ( g_History[i] >= CV.payout ){
                    if ( i >= CV.combo ) {
                        logGameResult( "Wake! Combos = " + i);
                        setState( 1 );
                    }
                    return;
                }      
            }
        }else if (WS.state == 1){
            if ( WS.rg  >= g_Money * CV.gainX ) {
                logGameResult('Win! Round is over. RoundProfit = ' + f2s(WS.rg) );
                setState( 0 );
                return;                         
            } 
            if ( config.Times.value != 0 && config.Times.value <= WS.wake && WS.combos <= 1 ){
                logGameResult(' Round is over because of number of executions. RoundProfit = ' + f2s(WS.rg));
                setState( 0 );
            } 
            if ( WS.combos > 28) { WS.combos = 0}
        }   
    }

    function updateBetPayout(payout) { 
        if ( WS.state == 1 ){
            let index = config.Speed.value;
            g_Bet = CXB[index].bet[WS.combos];
            g_Bet *= g_baseBet;
            g_Payout = CXB[index].payout[WS.combos];
        }else if( WS.state == 0 ){
            g_Bet = currency.minAmount;
            g_Payout = CV.payout;
        }        
    }
 
    function logGameResult(message) {
        log.info('.  ');
        log.info(`***** ${message} *****`);
        WriteTime( g_StartDate ); 
        log.info('.  ');
    }
    
    function printResult(payout) {        
        let msg = payout > 1
            ?  `E= ${WS.events}/${WS.wake}, C= ${WS.combos}, B=${f2s(g_Bet)}, P= ${g_Payout}X, G= ${f2s(WS.tg)}  ----- |||||`
            : `E= ${WS.events}/${WS.wake}, C= ${WS.combos}, B=${f2s(g_Bet)}, P= ${g_Payout}X, G= ${f2s(WS.tg)} `;
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


