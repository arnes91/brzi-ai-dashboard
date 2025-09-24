export default [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: "module",
            globals: {
                window: "readonly",
                document: "readonly",
                console: "readonly",
                localStorage: "readonly",
                Chart: "readonly",
                fetch: "readonly",
                alert: "readonly",
                confirm: "readonly",
                prompt: "readonly",
                setTimeout: "readonly",
                setInterval: "readonly",
                clearTimeout: "readonly",
                clearInterval: "readonly",
                Blob: "readonly",
                URL: "readonly",
                FileReader: "readonly",
                navigator: "readonly",
                btoa: "readonly",
                atob: "readonly",
                module: "readonly"
            }
        },
        rules: {
            "no-unused-vars": ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_" }],
            "no-undef": "error",
            "semi": ["error", "always"],
            "quotes": ["error", "single"],
            "no-console": "off"
        }
    }
];