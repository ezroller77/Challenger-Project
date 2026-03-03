#!/usr/bin/env python3
"""Assembles src/*.jsx fragments into preview.html and home-screen.jsx."""

import os

DIR = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(DIR, "src")

# Ordered source files (no import/export — raw JSX fragments)
SOURCES = [
    "theme.jsx",
    "data.jsx",
    "primitives.jsx",
    "sidebar.jsx",
    "connect.jsx",
    "connectors.jsx",
    "onboarding.jsx",
    "chat-onboarding.jsx",
    "starter.jsx",
    "goals.jsx",
    "score.jsx",
    "tasks.jsx",
    "registers.jsx",
    "people.jsx",
    "catalog.jsx",
    "app-detail.jsx",
    "build-mode.jsx",
    "edit-mode.jsx",
    "home.jsx",
    "app.jsx",
]

def read_sources():
    parts = []
    for name in SOURCES:
        path = os.path.join(SRC, name)
        with open(path, "r") as f:
            parts.append(f.read().rstrip())
    return "\n\n".join(parts)

def build_preview(body):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flows</title>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%231A1A1E'/%3E%3Cpath d='M15 50c10-20 22-20 32 0s22 20 32 0' stroke='%23fff' stroke-width='8' stroke-linecap='round' fill='none'/%3E%3C/svg%3E" />
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel" data-type="module">
const {{ useState, useEffect, useRef, useCallback, useMemo }} = React;

{body}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
"""

def build_module(body):
    return f'import {{ useState, useEffect, useRef, useCallback, useMemo }} from "react";\n\n{body}\n\nexport default App;\n'

def main():
    body = read_sources()

    preview_path = os.path.join(DIR, "preview.html")
    with open(preview_path, "w") as f:
        f.write(build_preview(body))

    module_path = os.path.join(DIR, "home-screen.jsx")
    with open(module_path, "w") as f:
        f.write(build_module(body))

    # Count lines for feedback
    with open(preview_path, "r") as f:
        plines = sum(1 for _ in f)
    with open(module_path, "r") as f:
        mlines = sum(1 for _ in f)

    print(f"✓ preview.html     ({plines} lines)")
    print(f"✓ home-screen.jsx  ({mlines} lines)")
    print(f"  Built from {len(SOURCES)} source files in src/")

if __name__ == "__main__":
    main()
