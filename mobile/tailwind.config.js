/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    presets: [require('nativewind/preset')],
    theme: {
        extend: {
            colors: {
                primary: '#8B593E',
                background: '#FFF8F3',
                surface: '#F5ECE6',
                text: '#4A3428',
                border: '#E5D3B7',
                white: '#FFFFFF',
                textLight: '#9A8478',
                expense: '#E74C3C',
                income: '#2ECC71',
                card: '#FFFFFF',
                shadow: '#000000',
            },
            boxShadow: {
                card: '0 2px 8px rgba(0,0,0,0.08)',
            },
            fontFamily: {
                regular: ['Inter_400Regular'],
                medium: ['Inter_500Medium'],
                semibold: ['Inter_600SemiBold'],
                bold: ['Inter_700Bold'],
                extrabold: ['Inter_800ExtraBold'],
                black: ['Inter_900Black'],
            },
        },
    },
    plugins: [],
};
