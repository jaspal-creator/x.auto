import { Channel } from '../../lib/Channel';
import { authMiddleware } from '../../middlewares';
import applyMiddlewares from '../../middlewares/middleware';
import {
  clearAuthSession,
  clearAllSessions,
  clearWebCache,
  clearStoredData,
  clearEverythingExceptDatabase,
  getCacheInfo
} from './cache.handlers';

export class Cache extends Channel {
  constructor(name: string) {
    super(name);
  }

  clearAuthSession() {
    this.Mutate('CLEAR_AUTH_SESSION', async () => 
      applyMiddlewares([authMiddleware], clearAuthSession)
    );
  }

  clearAllSessions() {
    this.Mutate('CLEAR_ALL_SESSIONS', async () => 
      applyMiddlewares([authMiddleware], clearAllSessions)
    );
  }

  clearWebCache() {
    this.Mutate('CLEAR_WEB_CACHE', async () => 
      applyMiddlewares([authMiddleware], clearWebCache)
    );
  }

  clearStoredData() {
    this.Mutate('CLEAR_STORED_DATA', async () => 
      applyMiddlewares([authMiddleware], clearStoredData)
    );
  }

  clearEverything() {
    this.Mutate('CLEAR_EVERYTHING', async () => 
      applyMiddlewares([authMiddleware], clearEverythingExceptDatabase)
    );
  }

  getCacheInfo() {
    this.Query('GET_CACHE_INFO', async () => 
      applyMiddlewares([authMiddleware], getCacheInfo)
    );
  }
}
