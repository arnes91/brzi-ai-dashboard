
# Build FAISS index over text-like files in data/knowledge
from pathlib import Path
import pickle, os, re
from sentence_transformers import SentenceTransformer
import faiss

BASE = Path(__file__).resolve().parents[1]
KB = BASE / "data" / "knowledge"
INDEXES = BASE / "data" / "indexes"
INDEXES.mkdir(parents=True, exist_ok=True)

def load_text(fp: Path) -> str:
    try:
        if fp.suffix.lower() in [".md",".txt",".json",".yaml",".yml",".csv"]:
            return fp.read_text(encoding="utf-8", errors="ignore")[:20000]
        elif fp.suffix.lower()==".pdf":
            # extremely simple PDF text extraction (deps intentionally minimal)
            try:
                import pypdf
                reader = pypdf.PdfReader(str(fp))
                return "\n".join(page.extract_text() or "" for page in reader.pages)[:50000]
            except Exception:
                return ""
        else:
            return ""
    except Exception:
        return ""

files = [p for p in KB.glob("**/*") if p.is_file()]
docs, meta = [], []
for p in files:
    txt = load_text(p)
    if txt and len(txt.split())>20:
        docs.append(txt[:4000])
        meta.append({"relpath": str(p.relative_to(KB))})
if not docs:
    print("No text docs found.")
    raise SystemExit(1)

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
emb = model.encode(docs, show_progress_bar=True)
index = faiss.IndexFlatL2(emb.shape[1])
index.add(emb.astype("float32"))
faiss.write_index(index, str(INDEXES / "faiss.index"))
with open(INDEXES / "meta.pkl","wb") as f:
    pickle.dump(meta, f)
print(f"Indexed {len(docs)} docs.")
