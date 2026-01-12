from datetime import datetime, timedelta
from typing import Optional
import hashlib
import json

class CacheManager:
    def __init__(self, db_session):
        self.db_session = db_session

    def get_cached_content(self, url: str) -> Optional[dict]:
        """Get cached article content if available and not expired"""
        from database import CacheDB
        
        try:
            cache_entry = self.db_session.query(CacheDB).filter(CacheDB.url == url).first()
            if not cache_entry:
                return None
            
            # Check if cache is still valid (24 hours)
            cache_age = datetime.utcnow() - cache_entry.created_at
            if cache_age > timedelta(hours=24):
                self.db_session.delete(cache_entry)
                self.db_session.commit()
                return None
            
            return cache_entry.content
        except Exception:
            return None

    def set_cached_content(self, url: str, content: dict) -> bool:
        """Cache article content"""
        from database import CacheDB
        
        try:
            cache_id = hashlib.md5(url.encode()).hexdigest()
            cache_entry = CacheDB(id=cache_id, url=url, content=content)
            self.db_session.add(cache_entry)
            self.db_session.commit()
            return True
        except Exception:
            return False

    def clear_expired_cache(self) -> int:
        """Remove expired cache entries"""
        from database import CacheDB
        
        try:
            cutoff_time = datetime.utcnow() - timedelta(hours=24)
            deleted = self.db_session.query(CacheDB).filter(CacheDB.created_at < cutoff_time).delete()
            self.db_session.commit()
            return deleted
        except Exception:
            return 0
