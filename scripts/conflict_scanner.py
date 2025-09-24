
import pandas as pd, os, json, time
from pathlib import Path
BASE = Path(__file__).resolve().parents[1]
REPORTS = BASE / "reports"
catalog = REPORTS / "source_catalog.csv"
out = REPORTS / "conflicts_report.md"
if not catalog.exists():
    print("No catalog found.")
    raise SystemExit(1)
df = pd.read_csv(catalog)
df["basename"] = df.get("path_in_zip", df.get("path","")).astype(str).apply(lambda p: os.path.basename(p))
dupes = df["basename"].value_counts()
lines = ["# Potential Conflicts / Duplicates","Updated: " + time.strftime('%Y-%m-%d %H:%M:%S'),""]
for name, count in dupes.items():
    if count>1 and isinstance(name,str) and name:
        rows = df[df["basename"]==name]
        lines.append(f"- **{name}** — occurrences: {int(count)} — sources: {', '.join(rows['source'].astype(str).unique())}")
out.write_text("\n".join(lines), encoding="utf-8")
print("Done")
