#!/bin/bash
cat config.ini
python scripts/gethtml.py
python scripts/parse_common.py
python scripts/parse_dpt.py
python scripts/parse_pe.py
python scripts/parse.py