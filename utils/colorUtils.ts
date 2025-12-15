// src/app-dras/utils/colorUtils.ts (NOVO ARQUIVO)

/**
 * Gera um array de cores RGB espaçadas uniformemente com base no número total de cores.
 * @param count O número de cores necessárias.
 * @param saturation A saturação das cores (0 a 100).
 * @param lightness A luminosidade das cores (0 a 100).
 * @param alpha A opacidade (canal alfa) para a cor de fundo (0.0 a 1.0).
 * @returns Um objeto com arrays de cores de fundo (background) e borda (border).
 */
export const generateDynamicColors = (count: number, alpha: number = 0.5) => {
    const backgroundColors: string[] = [];
    const borderColors: string[] = [];
    
    // Define a saturação e luminosidade padrão para cores vibrantes, mas suaves.
    const saturation = 70; 
    const lightness = 60;  

    for (let i = 0; i < count; i++) {
        // Calcula o matiz (hue) distribuindo 360 graus pelo número de dados
        const hue = Math.round((360 / count) * i);
        
        // Cor de Fundo (com transparência)
        // Usa o formato HSL para gerar o tom (hue)
        const backgroundColor = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        backgroundColors.push(backgroundColor);

        // Cor de Borda (sem transparência ou com alpha 1.0)
        const borderColor = `hsl(${hue}, ${saturation}%, ${lightness - 10}%)`; // Escurece um pouco a borda
        borderColors.push(borderColor);
    }

    return { backgroundColors, borderColors };
};