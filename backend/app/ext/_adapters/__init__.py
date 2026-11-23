"""Verbatim copies of the online project's pure-function modules.

Only the pure layers are here:
  • formatting.py    – string/number formatting
  • text_analysis.py – emoji, keyword and tag statistics
  • reports.py       – Row dataclass + compute_* functions (NO database access)

The DB-touching half of the online project's reports.py (load_rows, build_report,
build_history, get_saved_report, remove_from_history, list_comments) is reimplemented
in app/ext/reports.py against THIS project's schema.
"""