import { currenciesSymbolToCode, currenciesCodesList } from './currencies';

export default (val, result_currency='USD') => {
    for (let sym in currenciesSymbolToCode) {
        val = val.split(sym).join(currenciesSymbolToCode[sym]);
    }
    let valid = true;
    let curPos = 0;
    let tokens = [];
    let curToken = null;

    let nestingLevel = 0;

    while (curPos !== val.length) {
        let curCh = val[curPos];
        if (/^\d+$/.test(curCh)) {
            if (curCh === '0') {
                if (curToken && curToken.type === 'number') {
                    curToken.value += curCh;

                } else if (curPos+1 < val.length && val[curPos+1] === '.') {
                    curToken = {
                        type: 'number',
                        value: curCh,
                        currency: result_currency
                    };

                } else {
                    valid = false;
                    break;
                }
            } else {
                if (curToken) {
                    if (curToken.type === 'number') {
                        curToken.value += curCh;
                    } else {
                        valid = false;
                        break;
                    }
                } else {
                    curToken = {
                        type: 'number',
                        value: curCh,
                        currency: result_currency
                    };
                }
            }
        }

        else if ((/[+\-×÷/*]/gi).test(curCh)) {
            if (curToken) tokens.push(curToken);
            tokens.push({
                type: 'operator',
                value: curCh
            });
            curToken = null;
        } else if ((/[()]/gi).test(curCh)) {
            if (curToken) {
                if (curToken) tokens.push(curToken);
                if (curToken.type === 'number' && curCh === '(') {
                    tokens.push({
                        type: 'operator',
                        value: '*'
                    });
                }
                curToken = null;
            }

            let prevToken = tokens[tokens.length - 1];
            if (prevToken && prevToken.type === 'bracket') {
                if (prevToken.value === ')' &&  curCh === '(') {
                    tokens.push({
                        type: 'operator',
                        value: '*'
                    });
                } else if (prevToken.value === '(' &&  curCh === ')') {
                    valid = false;
                    break;
                }
            }

            tokens.push({
                type: 'bracket',
                value: curCh
            });
            if (curCh === '(') nestingLevel++;
            if (curCh === ')') nestingLevel--;

            if (nestingLevel < 0) {
                valid = false;
                break;
            }

        } else if (curCh === '.' && curToken && curToken.type === 'number') {
            curToken.value += curCh;
        } else if (curCh === ' ') {
            //skip
        } else if ((/\w/gi).test(curCh)) {
            // We sure that this is first letter of number currency
            if (curToken) {
                if (curToken.type === 'number') {
                    if (curPos+2 <= val.length) {
                        let currency = val.substr(curPos, 3);
                        if (!currenciesCodesList.includes(currency)) {
                            valid = false;
                            break;
                        } else {
                            curToken.currency = currency;
                            curPos += 2;
                        }
                    } else {
                        valid = false;
                        break;
                    }
                } else {
                    valid = false;
                    break;
                }
            } else {
                valid = false;
                break;
            }
        } else {
            valid = false;
            break;
        }

        curPos++;
    }

    if (curToken) {
        tokens.push(curToken);
    }

    if (nestingLevel !== 0) valid = false;

    return {valid, tokens}

};