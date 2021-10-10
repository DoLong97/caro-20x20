import { location_end, location_end_ai } from '../components/Game/index';

export const k = 5;
export const N = 20;
export let check_win_ai = 0;
export let check_win_ai_1 =true;
let check_win = 0;
let test_win = 0;
let location_new;
let tempArray_location = [];
let array_location = [];
let row_new;
let col_new;
// function isCover(Sum, x1,y1,x2,y2, tempArray){
//     if((x1 < 1) || (x2 > N) || (y1 < 1) || (y2 > N))
//         return false;
//     if((tempArray[x1-1][y1 - 1] === (k + 2 - (Sum/k))) && (tempArray[x2-1][y2 - 1] === (k + 2 - (Sum/k))))
//         return true;
//     return false;
// }

function win(Sum) {
    if (Sum === k) {
        check_win = test_win;
        location_new = location_end;
        array_location = location_new.split(",");
        row_new = parseInt(array_location.slice(0));
        col_new = parseInt(array_location.slice(1));
        check_win_ai_1=false;
    }
    if ((Sum === (k + 1) * k)) {
        // console.log(location_end_ai.length);
        // console.log(location_end.length); 
        if ((location_end_ai.length === 0 )) { 
            check_win = test_win;
            location_new = location_end;
            array_location = location_new.split(",");
            row_new = parseInt(array_location.slice(0));
            col_new = parseInt(array_location.slice(1)); 
        }
        else {
            check_win = test_win;
            location_new = location_end_ai;
            row_new = parseInt(location_new.slice(0)) + 1;
            col_new = parseInt(location_new.slice(1)) + 1;
        }
    }
    
}
export function calculateWinner(tempArray) {
    checkRow(tempArray);
    checkColume(tempArray);
    checkMainDiagonal(tempArray);
    checkExtraDiagonal(tempArray);
    switch (check_win) {
        case 1:
            //row
            let minX = Math.max(col_new - 4, 1);
            let currentX = col_new;
            let sumX = 0;
            let fladX = true;
            while (fladX && (currentX >= minX)) {
                if (tempArray[row_new - 1][currentX - 1] === tempArray[row_new - 1][col_new - 1]) {
                    sumX++;
                    console.log(sumX);
                    currentX--;
                }
                else fladX = false;
            }
            currentX++;
            for (let i = currentX; i < currentX + 5; i++) {

                tempArray_location.push({ x: row_new, y: i });
            }
             return tempArray_location;
            
        //break; 
        case 2:
            //colume
            let minY = Math.max(row_new - 4, 1);
            let currentY = row_new;
            let sumY = 0;
            let fladY = true;
            while (fladY && (currentY >= minY)) {
                if (tempArray[currentY - 1][col_new - 1] === tempArray[row_new - 1][col_new - 1]) {
                    sumY++;
                    currentY--;
                }
                else fladY = false;
            }
            currentY++;
            for (let i = currentY; i < currentY + 5; i++) {
                tempArray_location.push({ x: i, y: col_new });
               
            } return tempArray_location;
        //break;
        case 3:
            //maincross
            let minX_1 = Math.max(col_new - 4, 1);
            let minY_1 = Math.max(row_new - 4, 1);
            let currentX_1 = col_new;
            let currentY_1 = row_new;
            let sumX_1 = 0;
            let fladX_1 = true;
            while (fladX_1 && (currentX_1 >= minX_1) && (currentY_1 >= minY_1)) {
                if (tempArray[currentY_1 - 1][currentX_1 - 1] === tempArray[row_new - 1][col_new - 1]) {
                    sumX_1++;
                    console.log(sumX_1);
                    currentX_1--;
                    currentY_1--;
                }
                else fladX_1 = false;
            }
            currentX_1++;
            currentY_1++;
            for (let i = currentX_1; i < currentX_1 + 5; i++) {
                tempArray_location.push({ x: i - currentX_1 + currentY_1, y: i });
                
            } return tempArray_location;

        // break;    

        case 4:
            //crossextra
            let minX_2 = Math.max(col_new - 4, 1);
            let minY_2 = Math.max(row_new - 4, 1);
            let currentX_2 = col_new;
            let currentY_2 = row_new;
            let sumX_2 = 0;
            let fladX_2 = true;
            while (fladX_2 && (currentY_2 >= minY_2) && (currentX_2 >= minX_2)) {
                if (tempArray[currentY_2 - 1][currentX_2 - 1] === tempArray[row_new - 1][col_new - 1]) {
                    sumX_2++;
                    console.log(sumX_2);

                    currentX_2--;
                    currentY_2++;
                }
                else fladX_2 = false;
            }
            currentX_2++;
            currentY_2--;
            for (let i = currentX_2; i < currentX_2 + 5; i++) {
                tempArray_location.push({ x: currentX_2 + currentY_2 - i, y: i });
               
            } return tempArray_location

        default: return null;
    }
}

function checkRow(tempArray) {
    test_win = 1;
    
    let Sum = 0;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < k; j++)
            Sum = Sum + tempArray[i][j];
        //win(Sum);
        win(Sum);
        for (let j = k; j < N; j++) {
            Sum = Sum + tempArray[i][j] - tempArray[i][j - k];
            win(Sum);
            //win(Sum,j,-1,j,j-k);
        }
        Sum = 0;
        
    }
}
function checkColume(tempArray) {
    test_win = 2;
    let Sum = 0;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < k; j++)
            Sum = Sum + tempArray[j][i];
        win(Sum); 
        for (let j = k; j < N; j++) {
            Sum = Sum + tempArray[j][i] - tempArray[j - k][i];
            win(Sum);     
        }
        Sum = 0;
    }
}
function checkMainDiagonal(tempArray) {
    test_win = 3;
    let Sum = 0;
    for (let j = 0; j < N; j++) {
        if ((N - j) >= k) {
            Sum = 0;
            for (let i = 0; i < k; i++)
                Sum = Sum + tempArray[i][i + j];
            win(Sum);
            for (let i = k; i < N - j; i++) {
                Sum = Sum + tempArray[i][i + j] - tempArray[i - k][i - k + j];
                win(Sum);
            }
        }
    }
    for (let j = 0; j < N; j++) {
        if ((N - j) >= k) {
            Sum = 0;
            for (let i = 0; i < k; i++)
                Sum = Sum + tempArray[i + j][i];
            win(Sum);
            for (let i = k; i < N - j; i++) {
                Sum = Sum + tempArray[i + j][i] - tempArray[i + j - k][i - k];
                win(Sum); 
            }
        }
    }
}
function checkExtraDiagonal(tempArray) {
    test_win = 4;
    let Sum = 0;
    for (let a = 0; a < N; a++) {
        if ((N - a) >= k) {
            Sum = 0;
            for (let b = 0; b < k; b++)
                Sum = Sum + tempArray[b + a][N - (b + 1)];
            win(Sum);
            for (let b = k; b < N - a; b++) {
                Sum = Sum + tempArray[b + a][N - (b + 1)] - tempArray[b + a - k][(N - (b + 1)) + k];
                win(Sum);
            }
        }
    }

    for (let a = 0; a < N; a++) {
        if ((N - a) >= k) {
            Sum = 0;
            for (let b = 0; b < k; b++)
                Sum = Sum + tempArray[b][N - (b + 1 + a)];
            win(Sum);
            for (let b = k; b < N - a; b++) {
                Sum = Sum + tempArray[b][N - (b + 1 + a)] - tempArray[b - k][(N - (b + 1 + a)) + k];
                win(Sum);
            }
        }
    }
}
export function includeArray(array) {
    const result = [];
    array.forEach(nested => {
        result.push(Object.assign([], nested));
    });
    return result;
}