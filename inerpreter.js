class GenZHindiCompiler {
    constructor() {
        this.keywords = {
            '+': '+',
            '-': '-',
            '*': '*',
            '/': '/',
            'sanchay': 'let',
            'nishchit': 'const',
            'yadi': 'if',
            'kriya': 'function',
            'yaavat': 'for',
            'yathakaal': 'while',
            'darsha': 'console.log',
            'bhed': 'break',
            'nirantar': 'continue',
            'satya': 'true',
            'asatya': 'false',
            'tulya': '===',
            'bhinna': '!==',
            'samaan': '=',
            'laghu': '<',
            'dirgha': '>',
            'vapas': 'return',
        };
    }
    tokenize(code) {
        code = code.replace(/\/\/.*$/gm, '');
        code = code.replace(/\/\*[\s\S]*?\*\//g, '');
        const tokens = [];
        let current = '';
        let inString = false;
        let stringChar = '';
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            if ((char === '"' || char === "'") && code[i - 1] !== '\\') {
                if (inString && char === stringChar) {
                    tokens.push(current + char);
                    current = '';
                    inString = false;
                } else if (!inString) {
                    if (current) tokens.push(current);
                    current = char;
                    inString = true;
                    stringChar = char;
                } else {
                    current += char;
                }
                continue;
            }
            if (inString) {
                current += char;
                continue;
            }
            if (/[\s\(\)\{\}\[\]\;\,\+\-\*\/\=\<\>\!]/.test(char)) {
                if (current) {
                    tokens.push(current);
                    current = '';
                }
                if (!char.match(/\s/)) {
                    tokens.push(char);
                }
            } else {
                current += char;
            }
        }
        if (current) {
            tokens.push(current);
        }
        return tokens;
    }
    translate(token) {
        if ((token.startsWith('"') && token.endsWith('"')) || 
            (token.startsWith("'") && token.endsWith("'"))) {
            return token;
        }
        return this.keywords[token] || token;
    }
    formatCode(code) {
        let indent = 0;
        const lines = code.split(';');
        let formattedCode = '';
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            if (line.includes('}')) indent--;
            formattedCode += '    '.repeat(Math.max(0, indent)) + line + ';\n';
            if (line.includes('{')) indent++;
        }
        return formattedCode;
    }
    compile(code) {
        const tokens = this.tokenize(code);
        let compiledCode = tokens.map(token => this.translate(token)).join(' ');
        compiledCode = compiledCode
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}()=+\-*/<>!;,])\s*/g, '$1')
            .replace(/([{}()=+\-*/<>!;,])/g, ' $1 ')
            .replace(/\s+/g, ' ')
            .trim();
        return this.formatCode(compiledCode);
    }
    execute(code) {
        try {
            const compiledCode = this.compile(code);
            return {
                compiledCode,
                output: eval(compiledCode),
                error: null
            };
        } catch (error) {
            return {
                compiledCode: null,
                output: null,
                error: error.message
            };
        }
    }
}
window.GenZHindiCompiler = GenZHindiCompiler;