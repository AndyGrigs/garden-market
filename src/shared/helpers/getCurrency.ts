export const getCurrency = ()=>{ 
    
    const currency = { value: import.meta.env.VITE_CURRENCY }
    return currency.value
}