
const LOCAL_API = 'http://localhost:4444';
const PRODUCTION_API = 'https://covaci.md'; 

let selectedApi = LOCAL_API;

export const checkBackendHealth = async (): Promise<string> => {
  try {
    // Спробуй підключитися до локального бекенду
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 секунди timeout
    
    const response = await fetch(`${LOCAL_API}/categories`, {
      signal: controller.signal,
      method: 'GET',
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('✅ Підключено до локального бекенду');
      selectedApi = LOCAL_API;
      return LOCAL_API;
    }
  } catch (error) {
    console.log(error, '⚠️ Локальний бекенд недоступний, використовую production');

  }
  
  selectedApi = PRODUCTION_API;
  return PRODUCTION_API;
};

export const getApiUrl = () => selectedApi;