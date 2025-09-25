"""
Wrapper to execute the build_vector_index script from the root scripts directory.
This file enables calling the index builder via app/scripts path.
"""
import runpy
from pathlib import Path

if __name__ == "__main__":
    # Determine the repository root (two levels up from this file)
    repo_root = Path(__file__).resolve().parents[2]
    script_path = repo_root / "scripts" / "build_vector_index.py"
    # Execute the script
    runpy.run_path(str(script_path), run_name="__main__")
