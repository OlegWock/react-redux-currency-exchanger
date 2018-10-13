import parse from './parser';

describe('Parser should validate input correcrtly', () => {
    it('should parse simple expressions', () => {
        let result1 = parse('1+4EUR*0.8', 'USD');
        expect(result1.valid).toBe(true);
        expect(JSON.stringify(result1.tokens)).toMatchSnapshot();
    });

    it('should correctly parse complex expressions', () => {
        let {valid, tokens} = parse('(13$+4.5EUR - 8GBP) * 0.8 / 2');
        expect(valid).toBe(true);

        expect(JSON.stringify(tokens)).toMatchSnapshot();
    });

    it('should correctly parse invalid expressions', () => {
        let {valid} = parse('))(()(24()');
        expect(valid).toBe(false);

        valid = parse('))sdfs').valid;
        expect(valid).toBe(false);

        valid = parse('()*()').valid;
        expect(valid).toBe(false);

        valid = parse('-1EUR+3#USD').valid;
        expect(valid).toBe(false);


    })
});