
import * as ApiKeyModel from '../models/ApiKeyModel';

export const handleSaveApiKey = (key: string): boolean => {
  if (validateApiKey(key)) {
    ApiKeyModel.setApiKey(key.trim());
    return true;
  }
  return false;
};

export const handleClearApiKey = (): void => {
  ApiKeyModel.removeApiKey();
};

export const validateApiKey = (key: string): boolean => {
  // Basic validation for Gemini API key format (usually starts with AIza)
  return key.trim().length > 20;
};

export const getStatus = () => {
  return ApiKeyModel.hasApiKey();
};
