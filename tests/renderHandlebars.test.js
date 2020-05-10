const fs = require('fs');
const handlebars = require('handlebars');
const renderHandlebars = require('../src/renderHandlebars');

jest.mock('fs', () => ({
    promises: {
        readFile: jest.fn(),
    },
}));

jest.mock('handlebars');

describe('renderHandlebars', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should read expected file if it exists', async () => {
        const givenOptions = {
            filename: './test.html',
            context: {},
        };

        fs.promises.readFile.mockResolvedValue('fake file content');
        handlebars.compile.mockReturnValue(jest.fn());

        await renderHandlebars(givenOptions);

        expect(fs.promises.readFile).toHaveBeenCalledWith(
            './test.html',
            'utf8'
        );
    });

    it('should throw an error if the file does not exist', async () => {
        const givenOptions = {
            filename: './test.html',
            context: {},
        };

        fs.promises.readFile.mockRejectedValue(new Error('File not found'));

        await expect(renderHandlebars(givenOptions)).rejects.toThrow(
            new Error('File not found')
        );
    });

    it('should compile file content with handlebars', async () => {
        const givenOptions = {
            filename: './test.html',
            context: {},
        };

        fs.promises.readFile.mockResolvedValue('fake file content');
        handlebars.compile.mockReturnValue(jest.fn());

        await renderHandlebars(givenOptions);

        expect(handlebars.compile).toHaveBeenCalledWith('fake file content', {
            noEscape: true,
        });
    });

    it('should render template with expected context', async () => {
        const givenOptions = {
            filename: './test.html',
            context: {
                fake: 'context',
            },
        };

        const mockTemplateFunction = jest.fn();

        fs.promises.readFile.mockResolvedValue('fake file content');
        handlebars.compile.mockReturnValue(mockTemplateFunction);

        await renderHandlebars(givenOptions);

        expect(mockTemplateFunction).toHaveBeenCalledWith({
            fake: 'context',
        });
    });
});
