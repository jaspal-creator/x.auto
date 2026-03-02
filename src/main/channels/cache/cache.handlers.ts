import { Response, STATUS } from '../../../interfaces/response.type';
import { cacheManager } from '../../lib/ClearCache';

export const clearAuthSession = async (): Promise<Response<any>> => {
  try {
    cacheManager.clearAuthSession();
    return { [STATUS.Success]: { msg: 'Authentication session cleared' } };
  } catch (error: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const clearAllSessions = async (): Promise<Response<any>> => {
  try {
    cacheManager.clearAllSessions();
    return { [STATUS.Success]: { msg: 'All sessions cleared' } };
  } catch (error: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const clearWebCache = async (): Promise<Response<any>> => {
  try {
    await cacheManager.clearWebCache();
    return { [STATUS.Success]: { msg: 'Web cache cleared' } };
  } catch (error: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const clearStoredData = async (): Promise<Response<any>> => {
  try {
    await cacheManager.clearStoredData();
    return { [STATUS.Success]: { msg: 'Stored data cleared' } };
  } catch (error: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const clearEverythingExceptDatabase = async (): Promise<Response<any>> => {
  try {
    await cacheManager.clearEverythingExceptDatabase();
    return { [STATUS.Success]: { msg: 'All cache and session data cleared' } };
  } catch (error: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};

export const getCacheInfo = async (): Promise<Response<any>> => {
  try {
    const info = await cacheManager.getCacheInfo();
    return { [STATUS.Success]: info };
  } catch (error: unknown) {
    return { [STATUS.Error]: { msg: STATUS.InternalServerError } };
  }
};
