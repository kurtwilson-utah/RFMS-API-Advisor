import os
from dataclasses import dataclass
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")


@dataclass(frozen=True)
class Settings:
    base_url: str
    store_code: str
    api_key: str
    default_store_number: int | None
    log_path: Path


def load_settings() -> Settings:
    base_url = os.environ.get("RFMS_BASE_URL", "").rstrip("/")
    store_code = os.environ.get("RFMS_STORE_CODE", "")
    api_key = os.environ.get("RFMS_API_KEY", "")
    store_num_raw = os.environ.get("RFMS_DEFAULT_STORE_NUMBER", "").strip()
    log_path = Path(os.environ.get("RFMS_LOG_PATH", ROOT / "logs" / "rfms-api.log"))

    missing = [k for k, v in {
        "RFMS_BASE_URL": base_url,
        "RFMS_STORE_CODE": store_code,
        "RFMS_API_KEY": api_key,
    }.items() if not v]
    if missing:
        raise RuntimeError(f"Missing required env vars: {', '.join(missing)}")

    return Settings(
        base_url=base_url,
        store_code=store_code,
        api_key=api_key,
        default_store_number=int(store_num_raw) if store_num_raw else None,
        log_path=log_path,
    )
