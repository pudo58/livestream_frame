(function(global){
    function formatK(amount, locale) {
        if (typeof amount !== 'number') return '';
        const compact = new Intl.NumberFormat('en', {
            notation: 'compact',
            compactDisplay: 'short',
            maximumFractionDigits: 1
        });
        const parts = compact.formatToParts(amount);
        const numberStr = parts
            .filter(p => p.type !== 'compact' && p.type !== 'literal')
            .map(p => p.value)
            .join('');
        const unit = parts.find(p => p.type === 'compact')?.value || '';
        const number = Number(numberStr);
        const hasDecimal = numberStr.includes('.');
        const numberFormatter = new Intl.NumberFormat(locale, {
            minimumFractionDigits: hasDecimal ? 1 : 0,
            maximumFractionDigits: 1
        });
        const formattedNumber = numberFormatter.format(number);
        const finalUnit = unit === 'K' ? 'k' : unit;
        return formattedNumber + finalUnit;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { formatK };
    }
    global.formatK = formatK;
})(typeof window !== 'undefined' ? window : globalThis);
