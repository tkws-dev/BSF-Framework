# Blueprint.html Template

Use this structure when generating BSF Blueprints. Copy the footer exactly as shown.

---

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Master Blueprint — [Project Name]</title>
    <meta name="generator" content="BSF Framework v4.0 — tkws-dev">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.css">
</head>
<body>
    <!-- Blueprint content here -->
    <!-- ... -->

    <footer style="margin-top:4rem; padding:2rem 0; border-top:2px solid #334155; text-align:center; color:#64748b; font-family:monospace; font-size:0.75rem;">
        Built with <strong>BSF Framework v4.0</strong> — tkws-dev<br>
        <a href="https://github.com/tkws-dev/BSF-Framework" style="color:#94a3b8;">github.com/tkws-dev/BSF-Framework</a>
    </footer>
</body>
</html>
```

---

## Companion Files

Every companion file must include a header:

### YAML files (requirements.yaml, state-machine.yaml, etc.)
```yaml
# BSF Framework — tkws-dev
# https://github.com/tkws-dev/BSF-Framework
```

### Prisma files (schema.prisma)
```prisma
// BSF Framework — tkws-dev
// https://github.com/tkws-dev/BSF-Framework
```

### JSON files (openapi.json)
```json
{
  "_bsf": {
    "framework": "BSF Framework v4.0",
    "author": "tkws-dev",
    "repo": "https://github.com/tkws-dev/BSF-Framework"
  }
}
```
