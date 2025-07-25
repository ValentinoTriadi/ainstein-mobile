import Constants from 'expo-constants';

export const generateAPIUrl = (path: string): string => {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (!apiUrl) {
    throw new Error('API URL not configured');
  }
  
  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Ensure apiUrl doesn't end with slash and cleanPath doesn't start with slash
  const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
  
  return `${baseUrl}/${cleanPath}`;
}; 