module.exports = {
    env: {
        node: true,
        es6: true,
    },

    parser: 'babel-eslint',

    extends: ['airbnb-base', 'prettier', 'plugin:prettier/recommended'],

    plugins: ['prettier'],

    rules: {
        'prettier/prettier': 'error',
        'no-new': 'off',
        'no-param-reassign': 'off',
        'no-useless-constructor': 'off',
        'no-unused-vars': 'off',
        'class-methods-use-this': 'off',
        'no-await-in-loop': 'off',
        'no-continue': 'off',
        'no-underscore-dangle': 'off',
        'no-prototype-builtins': 'off',
        'no-eval': 'off',
    },
};
