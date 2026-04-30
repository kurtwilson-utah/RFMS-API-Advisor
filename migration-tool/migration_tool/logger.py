import json
import time
from pathlib import Path
from typing import Any


class ApiCallLogger:
    """Append-only JSONL log of every RFMS API call. One record per request,
    written after the response (or exception) is observed."""

    def __init__(self, path: Path):
        path.parent.mkdir(parents=True, exist_ok=True)
        self.path = path

    def record(
        self,
        *,
        method: str,
        url: str,
        request_body: Any,
        response_status: int | None,
        response_body: Any,
        duration_ms: int,
        error: str | None = None,
    ) -> None:
        entry = {
            "ts": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
            "method": method,
            "url": url,
            "request_body": request_body,
            "response_status": response_status,
            "response_body": response_body,
            "duration_ms": duration_ms,
            "error": error,
        }
        with self.path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(entry, default=str) + "\n")
