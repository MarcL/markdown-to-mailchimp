const path = require('path');
const markdown = require('../src/markdown');

describe('markdown', () => {
    const getFullFilePath = filename => path.resolve(__dirname, filename);

    it('should return the expect error if no file is found', async () => {
        const output = await markdown(
            getFullFilePath('./fixtures/invalidFile.md')
        );

        expect(output).toMatchSnapshot();
    });

    describe('when keeping Mailchimp tags', () => {
        it('should leave Mailchimp tag in converted HTML', async () => {
            const output = await markdown(
                getFullFilePath('./fixtures/withMailchimpTag.md')
            );

            expect(output).toMatchSnapshot();
        });

        it('should convert link to expected tag in converted HTML', async () => {
            const output = await markdown(
                getFullFilePath('./fixtures/withMailchimpLinkTag.md')
            );

            expect(output).toMatchSnapshot();
        });

        it('should convert link with no query parameters to expected tag in converted HTML', async () => {
            const output = await markdown(
                getFullFilePath('./fixtures/withLinkWithNoQueryParameters.md')
            );

            expect(output).toMatchSnapshot();
        });
    });

    describe('when ignoring Mailchimp tags', () => {
        it('should convert Mailchimp tag to <em> tag in converted HTML', async () => {
            const output = await markdown(
                getFullFilePath('./fixtures/withMailchimpTag.md'),
                false
            );

            expect(output).toMatchSnapshot();
        });

        it('should convert link to expected tag in converted HTML', async () => {
            const output = await markdown(
                getFullFilePath('./fixtures/withMailchimpLinkTag.md'),
                false
            );

            expect(output).toMatchSnapshot();
        });

        it('should convert link with no query parameters to expected tag in converted HTML', async () => {
            const output = await markdown(
                getFullFilePath('./fixtures/withLinkWithNoQueryParameters.md')
            );

            expect(output).toMatchSnapshot();
        });
    });
});
