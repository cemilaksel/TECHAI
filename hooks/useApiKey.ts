
import { useState, useCallback, useEffect } from 'react';
import * as ApiKeyModel from '../models/ApiKeyModel';
import * as ApiKeyController from '../controllers/ApiKeyController';

export const useApiKey = () => {
  const [apiKey, setApiKeyInternal] = useState<string | null>(ApiKeyModel.getApiKey());
  const [isValid, setIsValid] = useState<boolean>(ApiKeyModel.hasApiKey());

  const saveKey = useCallback((key: string) => {
    const success = ApiKeyController.handleSaveApiKey(key);
    if (success) {
      setApiKeyInternal(key);
      setIsValid(true);
    }
    return success;
  }, []);

  const clearKey = useCallback(() => {
    ApiKeyController.handleClearApiKey();
    setApiKeyInternal(null);
    setIsValid(false);
  }, []);

  return {
    apiKey,
    isValid,
    saveKey,
    clearKey,
    hasApiKey: isValid
  };
};
