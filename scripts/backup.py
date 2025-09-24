
from pathlib import Path
import shutil, time
BASE = Path(__file__).resolve().parents[1]
DEST = BASE / "backups" / time.strftime("%Y%m%d_%H%M%S")
DEST.mkdir(parents=True, exist_ok=True)
for rel in ["data","configs","reports"]:
    src = BASE / rel
    if src.exists():
        shutil.copytree(src, DEST / rel)
print("Backup created at", DEST)
