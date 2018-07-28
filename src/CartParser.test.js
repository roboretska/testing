import CartParser from './CartParser';

import result from '../samples/cart.js';


let parser;

beforeEach(() => {
    parser = new CartParser();
    const parse = parser.parse.bind(parser);
    const readFile = parser.readFile.bind(parser);
    const validate = parser.validate.bind(parser);
    const parseLine = parser.parseLine.bind(parser);


});

describe("CartParser - unit tests", () => {
    describe("Validation test", () => {
        it('should get error message when wrong header received', () => {
            //initial variable that contain wrong header amount
            const expectedName = 'Product name,Price\n' + 'string,0,0';

            //initial error message that is expected
            const error = {
                type: 'header',
                row: 0,
                column: 2,
                message: `Expected header to be named "Quantity" but received undefined.`

            };

            //compare expected and received results
            expect(parser.validate(expectedName)).toEqual([error]);

        });

        it('should get error message when wrong cells amount received', () => {
            //initial variable
            const expectedName = 'Product name,Price, Quantity\n' + 'string,0';

            //initial error message that is expected
            const error = {
                type: 'row',
                row: 1,
                column: -1,
                message: `Expected row to have 3 cells but received 2.`

            };

            //compare expected and received results
            expect(parser.validate(expectedName)).toEqual([error]);
        });

        it('should get error message when cells with empty string were received', () => {
            //initial variable that contain  wrong cells amount
            const expectedName = 'Product name,Price, Quantity\n' +
                ', 3,2\n';

            //initial error message that is expected
            const error = {
                type: 'cell',
                row: 1,
                column: 0,
                message: `Expected cell to be a nonempty string but received "".`


            };

            //compare expected and received results
            expect(parser.validate(expectedName)).toEqual([error]);


        });

        it('should get error message when received cells with negative number type instead of positive number type ', () => {
            //initial variable that contain  wrong cells amount
            const expectedName = 'Product name,Price, Quantity\n' +
                'string,-3,2\n' +
                `string, 2, 3`;

            //initial error message that is expected
            const error = [{
                type: 'cell',
                row: 1,
                column: 1,
                message: `Expected cell to be a positive number but received "-3".`
            }]

            //compare expected and received results
            expect(parser.validate(expectedName)).toEqual(error);


        });

        it('should get error message when received cells with string type instead of positive number type ', () => {
            //initial variable that contain  wrong cells amount
            const expectedName = 'Product name,Price, Quantity\n' +
                'string, 3,2\n' +
                `string, 2, string`;

            //initial error message that is expected
            const error = [{
                type: 'cell',
                row: 2,
                column: 2,
                message: `Expected cell to be a positive number but received "string".`

            }];

            //compare expected and received results
            expect(parser.validate(expectedName)).toEqual(error);


        });


        it('should don\'t get errors', () => {
            //initial variable that contain wrong header amount
            const expectedName = 'Product name,Price,Quantity\n' + 'string,1,1\n' + 'string,1,1';

            //initial error message that is expected
            const error = [];

            //compare expected and received results
            expect(parser.validate(expectedName)).toEqual(error);

        });

        it('Should return all err when receiver wrong file ', () => {
            let wrongContent = 'Product name,Price\n' +
                'item,4\n' +
                'item,-5,3\n' +
                ',1,string';
            let err = [
                {
                    type: 'header',
                    row: 0,
                    column: 2,
                    message: `Expected header to be named "Quantity" but received undefined.`
                },
                {
                    type: 'row',
                    row: 1,
                    column: -1,
                    message: `Expected row to have 3 cells but received 2.`
                }, {
                    type: 'cell',
                    row: 2,
                    column: 1,
                    message: `Expected cell to be a positive number but received \"-5\".`
                }, {
                    type: 'cell',
                    row: 3,
                    column: 0,
                    message: `Expected cell to be a nonempty string but received \"\".`

                }, {
                    type: 'cell',
                    row: 3,
                    column: 2,
                    message: `Expected cell to be a positive number but received \"string\".`
                }

            ];
            expect(parser.validate(wrongContent)).toEqual(err);
        });

        it('Should get error when file contain broken headers', () => {
            expect(() => parser.parse('./samples/wrongHeaders.csv')).toThrow();

        })

        it('Should return final price when csv file is correct', ()=>{
            expect(parser.parse('./samples/cart.csv').total).toEqual(result.total);

        })


    });

    describe("ParseLine tests", () => {
        it("Should return valid JSON", () => {
            const line = "SomeValue,3,4";

            const expected = {
                'name': "SomeValue",
                'price': 3,
                'quantity': 4
            };
            const received = parser.parseLine(line);
            delete received.id;

            expect(expected).toEqual(received);
        });
    });

    describe("calcTotal tests", () => {
        it("Should return correct price", () => {
            const line = [{
                'name': "SomeValue",
                'price': 1,
                'quantity': 3
            }, {
                'name': "SomeValue",
                'price': 5,
                'quantity': 2
            }];

            const expected_price = 13;


            expect(expected_price).toEqual(parser.calcTotal(line));
        });
    });

});
describe("CartParser - integration tests", () => {
    // Add your integration tests here.


    it('Should return value when input data are correct', () => {
        const resultObj = result.items;
        resultObj.forEach(item => {
            delete item.id
        })
        const expectedObj = parser.parse('./samples/cart.csv').items;
        expectedObj.forEach(item => {
            delete item.id
        })

        expect(expectedObj).toEqual(resultObj);

    });

});