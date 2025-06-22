let rows = 51, cols = 3;
    let matrix = Array.from({ length: rows }, (_, index) => [index, 0, 0]); // [j, count, mainModel]
    
    function UpdatePayoutAndBet(payout) {       
        let stdLength = 30;
    
        for (let i = 0; i < Math.min(g_History.length, stdLength); i++) {
            for (let j = 11; j <= 50; j++) {
                if (g_History[i] >= j / 10) {  
                    matrix[j][1]++;  // Increase count
                }
                
                let avgStep = matrix[j][1] > 0 ? i / matrix[j][1] : 0;
                // check this part
                let stdStep = 100 / (99 / (j / 10));
                let mainModel = avgStep / stdStep;
                matrix[j][2] = Math.max(matrix[j][2], mainModel);  
    
            //    log.info(`${j / 10}X - ${matrix[j][2]}`);
            }
        }
    
        // Sort matrix by the third column (mainModel) in descending order
        let sortedMatrix = matrix.slice(11, 51).sort((a, b) => b[2] - a[2]);
    
        // Get the top 5 values (j, mainModel)
        let top5 = sortedMatrix.slice(0, 5).map(([j, _, value]) => [j, f2s(value)]);
    
        log.info(`${top5}`);       

    }