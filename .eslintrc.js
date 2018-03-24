module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "linebreak-style": ["warn", "unix"],
        "quotes": ["warn", "double"],
        "semi": ["warn", "always", { "omitLastInOneLineBlock": true}],
        "func-style": ["warn", "expression", { "allowArrowFunctions": true }],
        "max-depth": ["warn", 4],
        "max-len": ["warn", { "code": 100, "comments": 120 }],
        "block-spacing": "warn",
        "brace-style": ["warn", "stroustrup", { "allowSingleLine": true }],
        "camelcase": "warn",
        "no-var": "error",
        "no-duplicate-imports": "error",
        "no-multi-spaces": ["warn", { ignoreEOLComments: false }],
        "no-trailing-spaces": "warn",
        "space-before-blocks": ["warn", { "functions": "always", "keywords": "always", "classes": "always" }],
        "space-before-function-paren": ["warn", {"anonymous": "always", "named": "always", "asyncArrow": "always"}],
        "arrow-spacing": "warn",
        "no-console": "warn"
    }
};