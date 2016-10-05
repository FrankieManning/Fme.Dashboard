module.exports = function () {
    var config = {
        tsSource: ['./app/**/*.ts', 'node_modules/angular2/typings/browser.d.ts'],
        tsOutputPath: './app/'
    }

    return config;
}
