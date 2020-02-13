module.exports = {
    theme: {
        extend: {
            screens: {
                'por': { 'raw': '(orientation: portrait)' },
                'lan': { 'raw': '(orientation: landscape)' },
            }
        }
    },
    variants: {
        textColor: ['responsive', 'hover', 'focus', 'visited'],
    },
    plugins: [],
}